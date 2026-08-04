import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/require-admin'
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
  const auth = await requireAdmin(request)
  if (auth.response) return auth.response

  try {
    const { id } = await params

    const { data: orderDetails, error: orderDetailsError } = await supabase
      .from('orders')
      .select('status')
      .eq('id', id)
      .single()

    if (orderDetailsError || !orderDetails) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
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
      return NextResponse.json({ error: 'Invoice not available for this order status' }, { status: 404 })
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