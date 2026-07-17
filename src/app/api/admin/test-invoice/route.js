// app/api/admin/test-invoice/route.jsx
// TEMPORARY — delete this file once real invoice generation is confirmed working
import { NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/require-admin'
import InvoiceDocument from '@/lib/invoices/InvoiceDocument'
import { HSN_DESCRIPTIONS } from '@/lib/invoices/hsnDescriptions'

export async function POST(request) {
  const auth = await requireAdmin(request)
  if (auth.response) return auth.response

  const mockInvoice = {
    id: '00000000-0000-0000-0000-000000000001',
    invoice_number: 'HKAY/2025-26/TEST',
    invoice_date: new Date().toISOString(),
    due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    place_of_supply: 'Delhi (07)',
    reverse_charge: false,
    order_no: 'ORD/TEST/0001',
    payment_method: 'Razorpay',
    address_type: 'Inter-State',
    line_items: [
      { name: 'Leather Wallet', hsn_code: '4202', quantity: 1, rate: 2500, taxable_value: 2500, cgst: 0, sgst: 0, igst: 450, total: 2950 },
      { name: 'Leather Watch Strap', hsn_code: '9113', quantity: 1, rate: 1500, taxable_value: 1500, cgst: 0, sgst: 0, igst: 270, total: 1770 },
    ],
    billing_details: {
      name: 'Rahul Sharma',
      email: 'test@example.com',
      phone: '9876543210',
      address: 'Flat No. 101, Shree Residency, Dwarka Sector 15',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110078',
      gstin: null,
    },
    seller_details: {
      name: 'HKAY LEATHER GOODS',
      gstin: '27AKWPI1394K1ZG',
      address: 'Shop No. 1, Ground Floor, Near Green Park, Lane No. 5, Kurla (West), Mumbai – 400070, Maharashtra, India',
      state: 'Maharashtra',
      stateCode: '27',
      mobile: '8850149101',
      email: 'hkayhandmadeleather@gmail.com',
    },
    subtotal: 4000,
    total_tax: 720,
    grand_total: 4720,
  }

  try {
    const pdfBuffer = await renderToBuffer(
      <InvoiceDocument invoice={mockInvoice} hsnDescriptions={HSN_DESCRIPTIONS} />
    )

    const { error: uploadError } = await supabase
      .storage
      .from('invoices')
      .upload('TEST-invoice.pdf', pdfBuffer, { contentType: 'application/pdf', upsert: true })

    if (uploadError) throw new Error(uploadError.message)

    const { data: signedUrlData, error: signError } = await supabase
      .storage
      .from('invoices')
      .createSignedUrl('TEST-invoice.pdf', 300)

    if (signError) throw new Error(signError.message)

    return NextResponse.json({ success: true, url: signedUrlData.signedUrl })
  } catch (error) {
    console.error('Test invoice generation failed:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}