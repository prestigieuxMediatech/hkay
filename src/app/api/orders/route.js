import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const {
      userId,
      email,
      items,
      shippingAddress,
      subtotal,
      shippingFee,
      total,
    } = await request.json()

    // insert order into Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        items,
        shipping_address: {
          ...shippingAddress,
          email
        },
        subtotal,
        shipping_fee: shippingFee,
        total,
        status: 'pending_payment'
      })
      .select()
      .single()

    if (error) throw error

    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}