import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateInvoiceForOrder } from '@/lib/invoices/generateInvoiceForOrder'

export const runtime = 'nodejs'

async function buildInvoiceResponse(invoice) {
  let downloadUrl = null

  if (invoice?.pdf_url) {
    const { data: signedUrlData, error: signError } = await supabase
      .storage
      .from('invoices')
      .createSignedUrl(invoice.pdf_url, 300)

    if (signError) {
      return { error: signError.message, status: 500 }
    }

    downloadUrl = signedUrlData.signedUrl
  }

  return {
    invoice: {
      ...invoice,
      downloadUrl,
    },
  }
}

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

    const { data: orderDetails, error: orderDetailsError } = await supabase
      .from('orders')
      .select('status')
      .eq('id', id)
      .single()

    if (orderDetailsError) {
      return NextResponse.json({ error: orderDetailsError.message }, { status: 500 })
    }

    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('id, invoice_number, invoice_date, order_id, grand_total, status, pdf_url')
      .eq('order_id', id)
      .maybeSingle()

    if (invoiceError) {
      return NextResponse.json({ error: invoiceError.message }, { status: 500 })
    }

    if (invoice) {
      const response = await buildInvoiceResponse(invoice)
      if (response.error) {
        return NextResponse.json({ error: response.error }, { status: response.status })
      }

      return NextResponse.json(response)
    }

    const canGenerateInvoice = ['paid', 'shipped', 'delivered'].includes(orderDetails.status)

    if (!canGenerateInvoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    let generatedInvoice

    try {
      generatedInvoice = await generateInvoiceForOrder(id)
    } catch (generationError) {
      const { data: fallbackInvoice } = await supabase
        .from('invoices')
        .select('id, invoice_number, invoice_date, order_id, grand_total, status, pdf_url')
        .eq('order_id', id)
        .maybeSingle()

      if (!fallbackInvoice) {
        return NextResponse.json(
          { error: generationError.message || 'Failed to generate invoice' },
          { status: 500 }
        )
      }

      generatedInvoice = fallbackInvoice
    }

    const response = await buildInvoiceResponse(generatedInvoice)

    if (response.error) {
      return NextResponse.json({ error: response.error }, { status: response.status })
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to load invoice' },
      { status: 500 }
    )
  }
}
