const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

function twoDigits(n) {
  if (n < 20) return ones[n]
  return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '')
}

function threeDigits(n) {
  if (n < 100) return twoDigits(n)
  return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + twoDigits(n % 100) : '')
}

export function numberToWords(num) {
  const rounded = Math.round(num)
  if (rounded === 0) return 'Zero'

  const crore = Math.floor(rounded / 10000000)
  const lakh = Math.floor((rounded % 10000000) / 100000)
  const thousand = Math.floor((rounded % 100000) / 1000)
  const remainder = rounded % 1000

  let words = ''
  if (crore) words += threeDigits(crore) + ' Crore '
  if (lakh) words += threeDigits(lakh) + ' Lakh '
  if (thousand) words += threeDigits(thousand) + ' Thousand '
  if (remainder) words += threeDigits(remainder)

  return words.trim() + ' Only'
}