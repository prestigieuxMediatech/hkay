import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/require-admin'

export async function PATCH(request, { params }) {
  const auth = await requireAdmin(request)
  if (auth.response) return auth.response

  const { id } = await params

  // Only allow approving invoices that are actually pending —
  // prevents accidentally re-approving/overwriting an already-approved
  // or rejected one via a stale UI state or duplicate click.
  const { data: invoice, error: fetchError } = await supabase
    .from('invoices')
    .select('id, approval_status')
    .eq('id', id)
    .single()

  if (fetchError || !invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
  }

  if (invoice.approval_status !== 'pending_review') {
    return NextResponse.json(
      { error: `Invoice is already ${invoice.approval_status}, not pending review` },
      { status: 400 }
    )
  }

  const { data: updated, error: updateError } = await supabase
    .from('invoices')
    .update({
      approval_status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: auth.admin?.email || 'admin',
    })
    .eq('id', id)
    .select()
    .single()

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ invoice: updated })
}