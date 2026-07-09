import { createHmac, timingSafeEqual } from 'crypto'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'

function signaturesMatch(expectedSignature, providedSignature) {
  const expectedBuffer = Buffer.from(expectedSignature, 'utf8')
  const providedBuffer = Buffer.from(String(providedSignature), 'utf8')

  if (expectedBuffer.length !== providedBuffer.length) {
    return false
  }

  return timingSafeEqual(expectedBuffer, providedBuffer)
}

export async function POST(request) {
  try {
    // IMPORTANT: read the raw body text for signature verification,
    // never request.json() first — the signature is computed over the raw bytes
    const rawBody = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!webhookSecret || !signature) {
      return Response.json({ error: 'Missing webhook config or signature' }, { status: 400 })
    }

    const expectedSignature = createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex')

    if (!signaturesMatch(expectedSignature, signature)) {
      return Response.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }

    const event = JSON.parse(rawBody)

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity
      const razorpay_payment_id = payment.id
      const razorpay_order_id = payment.order_id
      const amountPaid = payment.amount / 100 // paise -> rupees
      const email = payment.email || payment.notes?.email || null

      // Idempotency check — verify-payment (client callback) may have already
      // created this order. If so, do nothing.
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('razorpay_payment_id', razorpay_payment_id)
        .maybeSingle()

      if (existingOrder) {
        return Response.json({ status: 'already recorded' })
      }

      // No order exists yet — this means the client-side verify-payment call
      // never completed (tab closed, network drop, etc). We don't have the
      // cart items or shipping address here since this came from Razorpay's
      // servers, not the browser — so create a minimal order flagged for
      // manual review rather than guessing at missing data.
      const { error } = await supabase
        .from('orders')
        .insert({
          user_id: payment.notes?.user_id || 'unknown',
          items: [],
          shipping_address: { email, note: 'Created via webhook fallback — needs manual review' },
          subtotal: amountPaid,
          shipping_fee: 0,
          total: amountPaid,
          status: 'paid',
          razorpay_order_id,
          razorpay_payment_id,
        })

      if (error) throw error
    }

    return Response.json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}