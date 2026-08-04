// lib/invoices/generateManualInvoice.js
import { supabase } from '@/lib/supabase'
import { generateInvoiceNumber } from './generateInvoiceNumber'
import { buildManualLineItems } from './buildManualLineItems'
import { getStateCode } from './calculateGst'
import { SELLER_DETAILS } from './sellerConfig'
import { generateAndUploadInvoicePdf } from './generateAndUploadInvoicePdf'

// payload:
// {
//   buyer: { name, phone, email, address, city, state, pincode, gstin },
//   items: [{ name, hsn_code, quantity, rate, gstRate }],
//   paymentMethod, dispatchDate, transporter, awbNo
// }
export async function generateManualInvoice(payload) {
  const { buyer, items } = payload

  if (!buyer?.name || !buyer?.state) {
    throw new Error('Buyer name and state are required')
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('At least one line item is required')
  }

  for (const item of items) {
    if (!item.name || !item.hsn_code || !item.quantity || !item.rate || !item.gstRate) {
      throw new Error('Each item needs name, HSN code, quantity, rate, and GST rate')
    }
  }

  const { lineItems, subtotal, totalTax, grandTotal, isIntraState } =
    buildManualLineItems(items, buyer.state)

  const invoiceNumber = await generateInvoiceNumber()
  const buyerStateCode = getStateCode(buyer.state)

  const invoiceDate = new Date()
  const dueDate = new Date(invoiceDate)
  dueDate.setDate(dueDate.getDate() + 15)

  const { data: invoice, error: insertError } = await supabase
    .from('invoices')
    .insert({
      order_id: null,
      source: 'manual',
      invoice_number: invoiceNumber,
      invoice_date: invoiceDate.toISOString(),
      due_date: dueDate.toISOString(),
      place_of_supply: `${buyer.state} (${buyerStateCode})`,
      reverse_charge: false,
      order_no: 'Manual Sale',
      payment_method: payload.paymentMethod || 'Cash',
      address_type: isIntraState ? 'Intra-State' : 'Inter-State',
      status: 'generated',
      dispatch_date: payload.dispatchDate || null,
      transporter: payload.transporter || null,
      awb_no: payload.awbNo || null,
      line_items: lineItems,
      billing_details: {
        name: buyer.name,
        email: buyer.email || null,
        phone: buyer.phone || null,
        address: buyer.address || '',
        city: buyer.city || '',
        state: buyer.state,
        pincode: buyer.pincode || '',
        gstin: buyer.gstin || null,
      },
      seller_details: SELLER_DETAILS,
      subtotal,
      total_tax: totalTax,
      grand_total: grandTotal,
    })
    .select()
    .single()

  if (insertError) throw insertError

  await generateAndUploadInvoicePdf(invoice)

  const { data: finalInvoice, error: refetchError } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', invoice.id)
    .single()

  if (refetchError) throw refetchError

  return finalInvoice
}