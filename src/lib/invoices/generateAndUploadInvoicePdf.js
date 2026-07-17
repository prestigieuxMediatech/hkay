import { renderToBuffer } from '@react-pdf/renderer'
import { supabase } from '@/lib/supabase'
import InvoiceDocument from './InvoiceDocument'
import { HSN_DESCRIPTIONS } from './hsnDescriptions'

export async function generateAndUploadInvoicePdf(invoice) {
  const pdfBuffer = await renderToBuffer(
    <InvoiceDocument invoice={invoice} hsnDescriptions={HSN_DESCRIPTIONS} />
  )

  // Slashes in invoice_number replaced since they'd otherwise be read as storage sub-folders
  const safeFileName = invoice.invoice_number.replace(/\//g, '-')
  const storagePath = `${safeFileName}.pdf`

  const { error: uploadError } = await supabase
    .storage
    .from('invoices')
    .upload(storagePath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true, // allows overwrite when admin regenerates
    })

  if (uploadError) {
    throw new Error(`PDF upload failed: ${uploadError.message}`)
  }

  const { error: updateError } = await supabase
    .from('invoices')
    .update({ pdf_url: storagePath, updated_at: new Date().toISOString() })
    .eq('id', invoice.id)

  if (updateError) {
    throw new Error(`Failed to save pdf_url: ${updateError.message}`)
  }

  return storagePath
}