import { supabase } from '@/lib/supabase'
import { generateInvoiceNumber } from './generateInvoiceNumber'
import { buildInvoiceLineItems } from './buildInvoiceLineItems'
import { getStateCode } from './calculateGst'
import { SELLER_DETAILS } from './sellerConfig'
import { generateAndUploadInvoicePdf } from './generateAndUploadInvoicePdf'

export async function generateInvoiceForOrder(orderId) {
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (error || !order) throw new Error('Order not found')

  const { data: existingInvoice } = await supabase
    .from('invoices')
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle()

  if (existingInvoice) {
    if (!existingInvoice.pdf_url) {
      await generateAndUploadInvoicePdf(existingInvoice)
    }

    const { data: refreshedInvoice, error: refreshError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', existingInvoice.id)
      .single()

    if (refreshError) throw refreshError

    return refreshedInvoice
  }

  const addr = order.shipping_address

  const { lineItems, subtotal, totalTax, grandTotal, isIntraState } =
    await buildInvoiceLineItems(order.items, addr.state)

  const invoiceNumber = await generateInvoiceNumber()
  const buyerStateCode = getStateCode(addr.state)

  const invoiceDate = new Date()
  const dueDate = new Date(invoiceDate)
  dueDate.setDate(dueDate.getDate() + 15)

  const { data: invoice, error: insertError } = await supabase
    .from('invoices')
    .insert({
      order_id: order.id,
      invoice_number: invoiceNumber,
      invoice_date: invoiceDate.toISOString(),
      due_date: dueDate.toISOString(),
      place_of_supply: `${addr.state} (${buyerStateCode})`,
      reverse_charge: false,
      order_no: order.order_no,
      payment_method: 'Razorpay',
      address_type: isIntraState ? 'Intra-State' : 'Inter-State',
      status: 'generated',
      line_items: lineItems,
      billing_details: {
        name: addr.fullName,
        email: addr.email,
        phone: addr.phone,
        address: [addr.addressLine1, addr.addressLine2].filter(Boolean).join(', '),
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
        gstin: addr.gstin || null,
      },
      seller_details: SELLER_DETAILS,
      subtotal,
      total_tax: totalTax,
      grand_total: grandTotal,
    })
    .select()
    .single()

  if (insertError) throw insertError

  // Generate + upload PDF now that the row exists with an id and invoice_number
  await generateAndUploadInvoicePdf(invoice)

  // Re-fetch so the returned object includes the pdf_url we just saved
  const { data: finalInvoice, error: refetchError } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', invoice.id)
    .single()

  if (refetchError) throw refetchError

  return finalInvoice
}
