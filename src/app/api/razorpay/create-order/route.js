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

    // Recalculate total server-side from real product/variant prices — never trust client amount
    const productIds = items.map(item => item.product_id)
    const variantIds = items.map(item => item.variant_id).filter(Boolean)

    const { data: products, error: productError } = await supabase
      .from('products')
      .select('id, price')
      .in('id', productIds)

    if (productError) throw productError

    const priceMap = new Map(products.map(p => [p.id, p.price]))

    let variantPriceMap = new Map()
    if (variantIds.length > 0) {
      const { data: variants, error: variantError } = await supabase
        .from('product_variants')
        .select('id, price, is_active')
        .in('id', variantIds)

      if (variantError) throw variantError

      for (const v of variants) {
        if (!v.is_active) {
          return Response.json(
            { error: 'One of the selected sizes is no longer available' },
            { status: 400 }
          )
        }
        variantPriceMap.set(v.id, v.price)
      }
    }

    let subtotal = 0
    for (const item of items) {
      const basePrice = priceMap.get(item.product_id)
      if (basePrice == null) {
        return Response.json(
          { error: `Invalid product in cart: ${item.product_id}` },
          { status: 400 }
        )
      }

      // Variant price overrides base price when set; null means "inherit base price"
      let effectivePrice = basePrice
      if (item.variant_id) {
        if (!variantPriceMap.has(item.variant_id)) {
          return Response.json(
            { error: `Invalid size selected for product: ${item.product_id}` },
            { status: 400 }
          )
        }
        const variantPrice = variantPriceMap.get(item.variant_id)
        effectivePrice = variantPrice != null ? variantPrice : basePrice
      }

      subtotal += effectivePrice * item.quantity
    }

    const shippingFee = 0
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
      total,
    })
  } catch (error) {
    return Response.json(
      { error: error.message || 'Failed to create Razorpay order' },
      { status: 500 }
    )
  }
}