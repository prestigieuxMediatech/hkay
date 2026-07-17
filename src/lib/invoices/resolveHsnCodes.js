// lib/invoices/resolveHsnCodes.js
import { supabase } from '@/lib/supabase'

export async function resolveHsnCodes(items) {
  const productIds = items.map(i => i.product_id)

  const { data: products, error } = await supabase
    .from('products')
    .select('id, hsn_code, category_id, categories(hsn_code)')
    .in('id', productIds)

  if (error) throw error

  const hsnMap = new Map(
    products.map(p => [p.id, p.hsn_code ?? p.categories?.hsn_code ?? null])
  )

  return items.map(item => {
    const hsn_code = hsnMap.get(item.product_id)
    if (!hsn_code) {
      throw new Error(`No HSN code found for product ${item.product_id} (checked product and category)`)
    }
    return { ...item, hsn_code }
  })
}