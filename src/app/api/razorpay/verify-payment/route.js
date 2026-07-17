import { auth } from '@clerk/nextjs/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { supabase } from '@/lib/supabase'
import Razorpay from 'razorpay'
import { generateInvoiceForOrder } from '@/lib/invoices/generateInvoiceForOrder'
import { generateOrderNumber } from '@/lib/invoices/generateOrderNumber'

export const runtime = 'nodejs'

function signaturesMatch(expectedSignature, providedSignature) {
  const expectedBuffer = Buffer.from(expectedSignature.toLowerCase(), 'utf8')
  const providedBuffer = Buffer.from(String(providedSignature).toLowerCase(), 'utf8')

  if (expectedBuffer.length !== providedBuffer.length) {
    return false
  }

  return timingSafeEqual(expectedBuffer, providedBuffer)
}

export async function POST(request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
      items,
      shippingAddress,
    } = body

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !email ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !shippingAddress ||
      typeof shippingAddress !== 'object' ||
      Array.isArray(shippingAddress)
    ) {
      return Response.json(
        { error: 'Missing required payment or order details' },
        { status: 400 }
      )
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET
    const keyId = process.env.RAZORPAY_KEY_ID

    if (!keySecret || !keyId) {
      return Response.json(
        { error: 'Razorpay credentials are not configured' },
        { status: 500 }
      )
    }

    // 1. Verify signature
    const expectedSignature = createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (!signaturesMatch(expectedSignature, razorpay_signature)) {
      return Response.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // 2. Idempotency check — prevent duplicate orders from retries
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('*')
      .eq('razorpay_payment_id', razorpay_payment_id)
      .maybeSingle()

    if (existingOrder) {
      return Response.json(existingOrder)
    }

    // 3. Fetch the REAL paid amount from Razorpay directly — never trust client total
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })
    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id)
    const verifiedTotal = razorpayOrder.amount / 100 // paise -> rupees

    // 4. Generate a clean, sequential order number
    const orderNo = await generateOrderNumber()

    // 5. Insert order using server-verified amount, not client-sent total
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        order_no: orderNo,
        items,
        shipping_address: {
          ...shippingAddress,
          email,
        },
        subtotal: verifiedTotal,
        shipping_fee: 0,
        total: verifiedTotal,
        status: 'paid',
        razorpay_order_id,
        razorpay_payment_id,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // 6. Generate invoice — wrapped separately so a PDF/HSN failure never
    // breaks the payment confirmation response. The order is already paid
    // and saved; invoice generation can be retried by admin if it fails.
    try {
      await generateInvoiceForOrder(data.id)
    } catch (invoiceError) {
      console.error(`Invoice generation failed for order ${data.id}:`, invoiceError)
      // order still returns successfully to the customer — payment succeeded
    }

    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    )
  }
}