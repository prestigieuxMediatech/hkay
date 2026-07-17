// lib/invoices/InvoiceDocument.jsx
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { numberToWords } from './numberToWords'
import { TERMS_AND_CONDITIONS } from './sellerConfig'

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 9, fontFamily: 'Helvetica', color: '#1a1a1a' },
  border: { border: '1pt solid #333', padding: 15 },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  brandName: { fontSize: 18, fontWeight: 'bold' },
  brandSub: { fontSize: 8, color: '#555', marginTop: 2 },
  brandAddress: { fontSize: 8, color: '#555', marginTop: 4, lineHeight: 1.4 },
  invoiceTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  invoiceSubtitle: { fontSize: 8, textAlign: 'center', color: '#555', marginTop: 2 },

  metaTable: { alignSelf: 'flex-end', width: 220 },
  metaRow: { flexDirection: 'row', marginBottom: 2 },
  metaLabel: { width: 90, fontSize: 8, color: '#333' },
  metaValue: { fontSize: 8, fontWeight: 'bold' },

  detailBoxesRow: { flexDirection: 'row', gap: 10, marginTop: 12, marginBottom: 12 },
  detailBox: { flex: 1, border: '1pt solid #333' },
  detailHeader: { backgroundColor: '#1a1a1a', color: '#fff', padding: 4, fontSize: 8, fontWeight: 'bold' },
  detailBody: { padding: 8 },
  detailName: { fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  detailLine: { fontSize: 8, marginBottom: 2, lineHeight: 1.3 },

  orderInfoTable: { flexDirection: 'row', border: '1pt solid #333', marginBottom: 12 },
  orderInfoCell: { flex: 1, borderRight: '1pt solid #333', padding: 5 },
  orderInfoCellLast: { flex: 1, padding: 5 },
  orderInfoLabel: { fontSize: 7, color: '#555', marginBottom: 2 },
  orderInfoValue: { fontSize: 8, fontWeight: 'bold' },

  table: { border: '1pt solid #333' },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#eee6d9', borderBottom: '1pt solid #333' },
  tableRow: { flexDirection: 'row', borderBottom: '0.5pt solid #ccc' },
  th: { padding: 5, fontSize: 7.5, fontWeight: 'bold', textAlign: 'center' },
  td: { padding: 5, fontSize: 8, textAlign: 'center' },
  colSr: { width: '5%' },
  colName: { width: '25%', textAlign: 'left' },
  colHsn: { width: '10%' },
  colQty: { width: '6%' },
  colRate: { width: '12%' },
  colTaxable: { width: '13%' },
  colCgst: { width: '10%' },
  colSgst: { width: '10%' },
  colIgst: { width: '10%' },
  colTotal: { width: '13%' },

  hsnNote: { fontSize: 7, color: '#555', marginTop: 4 },

  summaryRow: { flexDirection: 'row', marginTop: 12 },
  wordsBox: { flex: 1, border: '1pt solid #333', padding: 8, marginRight: 10 },
  wordsLabel: { fontSize: 8, fontWeight: 'bold', marginBottom: 4 },
  wordsValue: { fontSize: 9, fontWeight: 'bold' },
  taxTable: { width: 220 },
  taxRow: { flexDirection: 'row', border: '1pt solid #333', borderTop: 0 },
  taxRowFirst: { flexDirection: 'row', border: '1pt solid #333' },
  taxLabel: { flex: 1, padding: 5, fontSize: 8 },
  taxValue: { width: 80, padding: 5, fontSize: 8, textAlign: 'right', borderLeft: '1pt solid #333' },
  grandTotalRow: { backgroundColor: '#eee6d9' },
  grandTotalLabel: { flex: 1, padding: 5, fontSize: 9, fontWeight: 'bold' },
  grandTotalValue: { width: 80, padding: 5, fontSize: 9, fontWeight: 'bold', textAlign: 'right', borderLeft: '1pt solid #333' },

  taxSummaryBar: { border: '1pt solid #333', padding: 6, marginTop: 10, textAlign: 'center', fontSize: 8 },

  footerRow: { flexDirection: 'row', gap: 10, marginTop: 12, border: '1pt solid #333' },
  footerCol: { flex: 1, padding: 8, borderRight: '1pt solid #333' },
  footerColLast: { flex: 1, padding: 8 },
  footerHeader: { fontSize: 8, fontWeight: 'bold', marginBottom: 6 },
  footerLine: { fontSize: 7.5, marginBottom: 3 },
  signatureArea: { marginTop: 20, textAlign: 'center' },

  bottomNote: { textAlign: 'center', fontSize: 7, color: '#555', marginTop: 10 },
  thankYou: { textAlign: 'center', fontSize: 11, fontWeight: 'bold', marginTop: 6 },
  thankYouSub: { textAlign: 'center', fontSize: 8, color: '#555', marginTop: 2 },
})

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB').replace(/\//g, '/')
}

function money(n) {
  return Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Build a de-duplicated HSN legend line, e.g. "4202 – Articles of Leather"
// You'll need an hsnDescriptions map (hsn_code -> description) passed in or imported
function buildHsnNote(lineItems, hsnDescriptions = {}) {
  const seen = new Set()
  const parts = []
  for (const item of lineItems) {
    if (!seen.has(item.hsn_code)) {
      seen.add(item.hsn_code)
      const desc = hsnDescriptions[item.hsn_code]
      if (desc) parts.push(`${item.hsn_code} – ${desc}`)
    }
  }
  return parts.length ? `HSN Codes: ${parts.join('; ')}` : null
}

export default function InvoiceDocument({ invoice, hsnDescriptions }) {
  const { seller_details: seller, billing_details: buyer, line_items: items } = invoice
  const hasIgst = items.some(i => i.igst > 0)
  const hsnNote = buildHsnNote(items, hsnDescriptions)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.border}>

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={{ width: '35%' }}>
              <Text style={styles.brandName}>{seller.name}</Text>
              <Text style={styles.brandSub}>Handmade Leather Goods</Text>
              <Text style={styles.brandAddress}>{seller.address}</Text>
            </View>
            <View style={{ width: '30%' }}>
              <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
              <Text style={styles.invoiceSubtitle}>(Original for Recipient)</Text>
            </View>
            <View style={styles.metaTable}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Invoice No.</Text>
                <Text style={styles.metaValue}>: {invoice.invoice_number}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Invoice Date</Text>
                <Text style={styles.metaValue}>: {formatDate(invoice.invoice_date)}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Due Date</Text>
                <Text style={styles.metaValue}>: {formatDate(invoice.due_date)}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Place of Supply</Text>
                <Text style={styles.metaValue}>: {invoice.place_of_supply}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Reverse Charge</Text>
                <Text style={styles.metaValue}>: {invoice.reverse_charge ? 'Yes' : 'No'}</Text>
              </View>
            </View>
          </View>

          {/* Seller / Buyer boxes */}
          <View style={styles.detailBoxesRow}>
            <View style={styles.detailBox}>
              <Text style={styles.detailHeader}>SELLER DETAILS</Text>
              <View style={styles.detailBody}>
                <Text style={styles.detailName}>{seller.name}</Text>
                <Text style={styles.detailLine}>GSTIN: {seller.gstin}</Text>
                <Text style={styles.detailLine}>State Code: {seller.stateCode} - {seller.state}</Text>
                <Text style={styles.detailLine}>Mobile: +91 {seller.mobile}</Text>
                <Text style={styles.detailLine}>Email: {seller.email}</Text>
              </View>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailHeader}>BUYER DETAILS</Text>
              <View style={styles.detailBody}>
                <Text style={styles.detailName}>{buyer.name}</Text>
                <Text style={styles.detailLine}>{buyer.address}, {buyer.city}, {buyer.state} – {buyer.pincode}</Text>
                {buyer.gstin && <Text style={styles.detailLine}>GSTIN: {buyer.gstin}</Text>}
                <Text style={styles.detailLine}>State Code: {invoice.place_of_supply}</Text>
                <Text style={styles.detailLine}>Address Type: {invoice.address_type}</Text>
              </View>
            </View>
          </View>

          {/* Order info strip */}
          <View style={styles.orderInfoTable}>
            <View style={styles.orderInfoCell}>
              <Text style={styles.orderInfoLabel}>Order No.</Text>
              <Text style={styles.orderInfoValue}>{invoice.order_no}</Text>
            </View>
            <View style={styles.orderInfoCell}>
              <Text style={styles.orderInfoLabel}>Payment Method</Text>
              <Text style={styles.orderInfoValue}>{invoice.payment_method}</Text>
            </View>
            <View style={styles.orderInfoCell}>
              <Text style={styles.orderInfoLabel}>Dispatch Date</Text>
              <Text style={styles.orderInfoValue}>{formatDate(invoice.dispatch_date)}</Text>
            </View>
            <View style={styles.orderInfoCell}>
              <Text style={styles.orderInfoLabel}>Transporter</Text>
              <Text style={styles.orderInfoValue}>{invoice.transporter || '-'}</Text>
            </View>
            <View style={styles.orderInfoCellLast}>
              <Text style={styles.orderInfoLabel}>AWB No.</Text>
              <Text style={styles.orderInfoValue}>{invoice.awb_no || '-'}</Text>
            </View>
          </View>

          {/* Line items table */}
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.th, styles.colSr]}>Sr.No.</Text>
              <Text style={[styles.th, styles.colName]}>Product Name</Text>
              <Text style={[styles.th, styles.colHsn]}>HSN Code</Text>
              <Text style={[styles.th, styles.colQty]}>Qty</Text>
              <Text style={[styles.th, styles.colRate]}>Unit Price (₹)</Text>
              <Text style={[styles.th, styles.colTaxable]}>Taxable Value (₹)</Text>
              <Text style={[styles.th, styles.colCgst]}>CGST 9% (₹)</Text>
              <Text style={[styles.th, styles.colSgst]}>SGST 9% (₹)</Text>
              <Text style={[styles.th, styles.colIgst]}>IGST 18% (₹)</Text>
              <Text style={[styles.th, styles.colTotal]}>Total Amount (₹)</Text>
            </View>
            {items.map((item, idx) => (
              <View style={styles.tableRow} key={idx}>
                <Text style={[styles.td, styles.colSr]}>{idx + 1}</Text>
                <Text style={[styles.td, styles.colName]}>{item.name}</Text>
                <Text style={[styles.td, styles.colHsn]}>{item.hsn_code}</Text>
                <Text style={[styles.td, styles.colQty]}>{item.quantity}</Text>
                <Text style={[styles.td, styles.colRate]}>{money(item.rate)}</Text>
                <Text style={[styles.td, styles.colTaxable]}>{money(item.taxable_value)}</Text>
                <Text style={[styles.td, styles.colCgst]}>{item.cgst ? money(item.cgst) : '–'}</Text>
                <Text style={[styles.td, styles.colSgst]}>{item.sgst ? money(item.sgst) : '–'}</Text>
                <Text style={[styles.td, styles.colIgst]}>{item.igst ? money(item.igst) : '–'}</Text>
                <Text style={[styles.td, styles.colTotal]}>{money(item.total)}</Text>
              </View>
            ))}
          </View>
          {hsnNote && <Text style={styles.hsnNote}>{hsnNote}</Text>}

          {/* Totals + words */}
          <View style={styles.summaryRow}>
            <View style={styles.wordsBox}>
              <Text style={styles.wordsLabel}>Total in Words (₹):</Text>
              <Text style={styles.wordsValue}>{numberToWords(invoice.grand_total)}</Text>
            </View>
            <View style={styles.taxTable}>
              <View style={styles.taxRowFirst}>
                <Text style={styles.taxLabel}>Total Taxable Value</Text>
                <Text style={styles.taxValue}>{money(invoice.subtotal)}</Text>
              </View>
              <View style={styles.taxRow}>
                <Text style={styles.taxLabel}>Total CGST (9%)</Text>
                <Text style={styles.taxValue}>{hasIgst ? '–' : money(invoice.total_tax / 2)}</Text>
              </View>
              <View style={styles.taxRow}>
                <Text style={styles.taxLabel}>Total SGST (9%)</Text>
                <Text style={styles.taxValue}>{hasIgst ? '–' : money(invoice.total_tax / 2)}</Text>
              </View>
              <View style={styles.taxRow}>
                <Text style={styles.taxLabel}>Total IGST (18%)</Text>
                <Text style={styles.taxValue}>{hasIgst ? money(invoice.total_tax) : '–'}</Text>
              </View>
              <View style={[styles.taxRow, styles.grandTotalRow]}>
                <Text style={styles.grandTotalLabel}>Grand Total (₹)</Text>
                <Text style={styles.grandTotalValue}>{money(invoice.grand_total)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.taxSummaryBar}>
            <Text>
              Taxable Value: ₹{money(invoice.subtotal)}  |  CGST: ₹{hasIgst ? '0.00' : money(invoice.total_tax / 2)}  |  SGST: ₹{hasIgst ? '0.00' : money(invoice.total_tax / 2)}  |  IGST: ₹{hasIgst ? money(invoice.total_tax) : '0.00'}  |  Total Tax: ₹{money(invoice.total_tax)}
            </Text>
          </View>

          {/* Terms + signature (bank details section removed) */}
          <View style={styles.footerRow}>
            <View style={styles.footerCol}>
              <Text style={styles.footerHeader}>TERMS & CONDITIONS</Text>
              {TERMS_AND_CONDITIONS.map((term, idx) => (
                <Text style={styles.footerLine} key={idx}>{idx + 1}. {term}</Text>
              ))}
            </View>
            <View style={styles.footerColLast}>
              <Text style={styles.footerHeader}>For {seller.name}</Text>
              <View style={styles.signatureArea}>
                <Text style={{ fontSize: 8, marginTop: 30 }}>Authorised Signature</Text>
              </View>
            </View>
          </View>

          <Text style={styles.bottomNote}>Note: This is a computer generated invoice and does not require any physical signature.</Text>
          <Text style={styles.thankYou}>Thank You!</Text>
          <Text style={styles.thankYouSub}>We truly appreciate your business.</Text>

        </View>
      </Page>
    </Document>
  )
}