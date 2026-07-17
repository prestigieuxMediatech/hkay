// lib/invoices/resolveHsnCodes.js
import { supabase } from '@/lib/supabase'

const DEFAULT_HSN_CODE = '4202'
const WATCH_STRAP_HSN_CODE = '9113'

function inferHsnCode(item, product) {
  const haystack = [
    item?.name,
    product?.name,
    product?.slug,
    product?.categories?.name,
    product?.categories?.slug,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  if (haystack.includes('watch strap') || (haystack.includes('watch') && haystack.includes('strap'))) {
    return WATCH_STRAP_HSN_CODE
  }

  return DEFAULT_HSN_CODE
}

export async function resolveHsnCodes(items) {
  const productIds = items.map(i => i.product_id).filter(Boolean)

  if (!productIds.length) {
    return items.map(item => ({ ...item, hsn_code: inferHsnCode(item) }))
  }

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, category_id, categories(id, name, slug)')
    .in('id', productIds)

  if (error) throw error

  const productMap = new Map(products.map(p => [p.id, p]))

  return items.map(item => {
    const product = productMap.get(item.product_id)
    const hsn_code = inferHsnCode(item, product)

    return { ...item, hsn_code }
  })
}
