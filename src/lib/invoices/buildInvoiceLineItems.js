// lib/invoices/buildInvoiceLineItems.js
import { calculateLineItemTax, getStateCode } from './calculateGst'
import { resolveHsnCodes } from './resolveHsnCodes'

export async function buildInvoiceLineItems(items, buyerState) {
  const buyerStateCode = getStateCode(buyerState)
  if (!buyerStateCode) throw new Error(`Unrecognized state: ${buyerState}`)

  const itemsWithHsn = await resolveHsnCodes(items)

  const lineItems = itemsWithHsn.map((item) => {
    const taxableValue = round2(item.price * item.quantity)
    const tax = calculateLineItemTax({ taxableValue, buyerStateCode })

    return {
      name: item.name,
      hsn_code: item.hsn_code,
      quantity: item.quantity,
      rate: item.price,
      taxable_value: taxableValue,
      ...tax,
      total: round2(taxableValue + tax.totalTax),
    }
  })

  const subtotal = round2(lineItems.reduce((sum, li) => sum + li.taxable_value, 0))
  const totalTax = round2(lineItems.reduce((sum, li) => sum + li.totalTax, 0))
  const grandTotal = round2(subtotal + totalTax)

  return { lineItems, subtotal, totalTax, grandTotal, isIntraState: buyerStateCode === '27' }
}

function round2(n) {
  return Math.round(n * 100) / 100
}