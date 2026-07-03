import { supabase } from '@/lib/supabase'

// PUT — when user changes quantity like 1 → 2
export async function PUT(request, { params }) {
  try {
    const { id } = await params   // ✅ await added
    const { quantity } = await request.json()

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .select()

    if (error) throw error

    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// DELETE — when user removes item from cart
export async function DELETE(request, { params }) {
  try {
    const { id } = await params   // ✅ await added

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id)

    if (error) throw error

    return Response.json({ success: true })
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}