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

export function calculateLineItemTax({ taxableValue, buyerStateCode }) {
  const isIntraState = buyerStateCode === SELLER_STATE_CODE;
  const totalTax = (taxableValue * GST_RATE) / 100;

  if (isIntraState) {
    const half = totalTax / 2;
    return { cgst: round2(half), sgst: round2(half), igst: 0, totalTax: round2(totalTax) };
  }

  return { cgst: 0, sgst: 0, igst: round2(totalTax), totalTax: round2(totalTax) };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

export function getStateCode(stateName) {
  return STATE_CODE_MAP[stateName?.trim()] || null;
}

export { GST_RATE };