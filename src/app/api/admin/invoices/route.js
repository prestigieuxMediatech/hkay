// app/api/admin/invoices/route.js
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/require-admin'

export async function GET(request) {
  const auth = await requireAdmin(request)
  if (auth.response) return auth.response

  const { data, error } = await supabase
    .from('invoices')
    .select('id, invoice_number, invoice_date, order_id, grand_total, status, pdf_url, edited_by_admin')
    .order('invoice_date', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}