import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET(request, { params }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, user_id')
      .eq('id', id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('id, invoice_number, invoice_date, order_id, grand_total, status, pdf_url')
      .eq('order_id', id)
      .maybeSingle()

    if (invoiceError) {
      return NextResponse.json({ error: invoiceError.message }, { status: 500 })
    }

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    let downloadUrl = null

    if (invoice.pdf_url) {
      const { data: signedUrlData, error: signError } = await supabase
        .storage
        .from('invoices')
        .createSignedUrl(invoice.pdf_url, 300)

      if (signError) {
        return NextResponse.json({ error: signError.message }, { status: 500 })
      }

      downloadUrl = signedUrlData.signedUrl
    }

    return NextResponse.json({
      invoice: {
        ...invoice,
        downloadUrl,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to load invoice' },
      { status: 500 }
    )
  }
}
