import { supabase } from '@/lib/supabase'

export async function GET(request, { params }) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
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

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    const { data, error } = await supabase
      .from('orders')
      .update(body)
      .eq('id', id)
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