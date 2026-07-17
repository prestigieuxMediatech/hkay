// app/api/admin/invoices/[id]/download/route.js
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/require-admin'

export async function GET(request, { params }) {
  const auth = await requireAdmin(request)
  if (auth.response) return auth.response

  const { id } = await params

  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('pdf_url')
    .eq('id', id)
    .single()

  if (error || !invoice?.pdf_url) {
    return NextResponse.json({ error: 'Invoice PDF not found' }, { status: 404 })
  }

  const { data: signedUrlData, error: signError } = await supabase
    .storage
    .from('invoices')
    .createSignedUrl(invoice.pdf_url, 60) // valid for 60 seconds

  if (signError) {
    return NextResponse.json({ error: signError.message }, { status: 500 })
  }

  return NextResponse.json({ url: signedUrlData.signedUrl })
}