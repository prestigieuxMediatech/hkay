// app/api/admin/invoices/route.js
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/require-admin'
import { generateManualInvoice } from '@/lib/invoices/generateManualInvoice'

export async function GET(request) {
  const auth = await requireAdmin(request)
  if (auth.response) return auth.response

  const { data, error } = await supabase
    .from('invoices')
    .select('id, invoice_number, invoice_date, order_id, source, grand_total, status, pdf_url, edited_by_admin, billing_details')
    .order('invoice_date', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const withDownloadUrls = await Promise.all(
    (data || []).map(async (invoice) => {
      let downloadUrl = null

      if (invoice.pdf_url) {
        const { data: signedUrlData } = await supabase
          .storage
          .from('invoices')
          .createSignedUrl(invoice.pdf_url, 300)
        downloadUrl = signedUrlData?.signedUrl || null
      }

      return { ...invoice, downloadUrl }
    })
  )

  return NextResponse.json(withDownloadUrls)
}

// Create a manual invoice for an offline sale
export async function POST(request) {
  const auth = await requireAdmin(request)
  if (auth.response) return auth.response

  try {
    const body = await request.json()
    const invoice = await generateManualInvoice(body)

    let downloadUrl = null
    if (invoice.pdf_url) {
      const { data: signedUrlData } = await supabase
        .storage
        .from('invoices')
        .createSignedUrl(invoice.pdf_url, 300)
      downloadUrl = signedUrlData?.signedUrl || null
    }

    return NextResponse.json({ invoice: { ...invoice, downloadUrl } }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create invoice' },
      { status: 400 }
    )
  }
}