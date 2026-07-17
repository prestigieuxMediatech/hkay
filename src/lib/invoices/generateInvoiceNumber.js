import { supabase } from '@/lib/supabase';

function getFinancialYear(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Jan = 1
  return month >= 4 ? `${year}-${(year + 1).toString().slice(-2)}` : `${year - 1}-${year.toString().slice(-2)}`;
}

export async function generateInvoiceNumber() {
  const fy = getFinancialYear();

  const { data, error } = await supabase.rpc('increment_invoice_counter', { fy_param: fy });

  if (error) throw new Error(`Invoice number generation failed: ${error.message}`);

  const paddedNumber = String(data).padStart(4, '0');
  return `HKAY/${fy}/${paddedNumber}`;
}