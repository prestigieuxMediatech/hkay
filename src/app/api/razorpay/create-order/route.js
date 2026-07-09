import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import Razorpay from 'razorpay'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { items } = await request.json()

    if (!Array.isArray(items) || items.length === 0) {
      return Response.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Recalculate total server-side from real product prices — never trust client amount
    const productIds = items.map(item => item.product_id)

    const { data: products, error: productError } = await supabase
      .from('products')
      .select('id, price')
      .in('id', productIds)

    if (productError) throw productError

    const priceMap = new Map(products.map(p => [p.id, p.price]))

    let subtotal = 0
    for (const item of items) {
      const realPrice = priceMap.get(item.product_id)
      if (realPrice == null) {
        return Response.json(
          { error: `Invalid product in cart: ${item.product_id}` },
          { status: 400 }
        )
      }
      subtotal += realPrice * item.quantity
    }

    const shippingFee = 0 // match your existing free-shipping logic
    const total = subtotal + shippingFee

    if (total < 1) {
      return Response.json(
        { error: 'Order total must be at least ₹1' },
        { status: 400 }
      )
    }

    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      return Response.json(
        { error: 'Razorpay credentials are not configured' },
        { status: 500 }
      )
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    const order = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        user_id: userId,
      },
    })

    return Response.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      total, // send back so frontend can display it, but this is now server-verified
    })
  } catch (error) {
    return Response.json(
      { error: error.message || 'Failed to create Razorpay order' },
      { status: 500 }
    )
  }
}