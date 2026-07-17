// lib/invoices/calculateGst.js

const SELLER_STATE_CODE = '27'; // Maharashtra

const STATE_CODE_MAP = {
  'Andaman and Nicobar Islands': '35', 'Andhra Pradesh': '28', 'Arunachal Pradesh': '12',
  'Assam': '18', 'Bihar': '10', 'Chandigarh': '04', 'Chhattisgarh': '22',
  'Dadra and Nagar Haveli and Daman and Diu': '26', 'Delhi': '07', 'Goa': '30',
  'Gujarat': '24', 'Haryana': '06', 'Himachal Pradesh': '02', 'Jammu and Kashmir': '01',
  'Jharkhand': '20', 'Karnataka': '29', 'Kerala': '32', 'Ladakh': '38',
  'Lakshadweep': '31', 'Madhya Pradesh': '23', 'Maharashtra': '27', 'Manipur': '14',
  'Meghalaya': '17', 'Mizoram': '15', 'Nagaland': '13', 'Odisha': '21',
  'Puducherry': '34', 'Punjab': '03', 'Rajasthan': '08', 'Sikkim': '11',
  'Tamil Nadu': '33', 'Telangana': '36', 'Tripura': '16', 'Uttar Pradesh': '09',
  'Uttarakhand': '05', 'West Bengal': '19',
};

const GST_RATE = 18; // flat rate across all HKAY products

// Price shown to the customer is GST-INCLUSIVE (what they actually pay).
// We back-calculate the taxable value and tax split from that final price,
// rather than adding tax on top of it.
export function calculateLineItemTax({ inclusivePrice, buyerStateCode }) {
  const isIntraState = buyerStateCode === SELLER_STATE_CODE;
  const taxableValue = round2(inclusivePrice / (1 + GST_RATE / 100));
  const totalTax = round2(inclusivePrice - taxableValue);

  if (isIntraState) {
    const half = round2(totalTax / 2);
    return { taxableValue, cgst: half, sgst: half, igst: 0, totalTax };
  }

  return { taxableValue, cgst: 0, sgst: 0, igst: totalTax, totalTax };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

export function getStateCode(stateName) {
  return STATE_CODE_MAP[stateName?.trim()] || null;
}

export { GST_RATE };