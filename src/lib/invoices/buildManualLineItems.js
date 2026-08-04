// lib/invoices/buildManualLineItems.js
import { SELLER_DETAILS } from './sellerConfig'

function round2(n) {
  return Math.round(n * 100) / 100
}

function normalizeState(state) {
  return (state || '').trim().toLowerCase()
}

// items: [{ name, hsn_code, quantity, rate, gstRate }]
// `rate` is the GST-inclusive unit price (matches how online invoices already work)
export function buildManualLineItems(items, buyerState) {
  const isIntraState = normalizeState(buyerState) === normalizeState(SELLER_DETAILS.state)

  let subtotal = 0
  let totalTax = 0
  let grandTotal = 0

  const lineItems = items.map((item) => {
    const quantity = Number(item.quantity)
    const rate = Number(item.rate)
    const gstRate = Number(item.gstRate)

    const lineTotal = rate * quantity
    const taxableValue = round2(lineTotal / (1 + gstRate / 100))
    const lineTax = round2(lineTotal - taxableValue)

    const cgst = isIntraState ? round2(lineTax / 2) : 0
    const sgst = isIntraState ? round2(lineTax / 2) : 0
    const igst = isIntraState ? 0 : lineTax

    subtotal += taxableValue
    totalTax += lineTax
    grandTotal += round2(lineTotal)

    return {
      name: item.name,
      hsn_code: item.hsn_code,
      quantity,
      rate,
      gst_rate: gstRate,
      taxable_value: taxableValue,
      cgst,
      sgst,
      igst,
      total: round2(lineTotal),
    }
  })

  return {
    lineItems,
    subtotal: round2(subtotal),
    totalTax: round2(totalTax),
    grandTotal: round2(grandTotal),
    isIntraState,
  }
}