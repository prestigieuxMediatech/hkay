import "server-only"
import { supabase } from '@/lib/supabase'; // adjust path to match your actual file location

const SHIPROCKET_BASE = 'https://apiv2.shiprocket.in/v1/external';

async function getCachedToken() {
  const { data } = await supabase
    .from('app_config')
    .select('value, updated_at')
    .eq('key', 'shiprocket_token')
    .single();

  if (!data) return null;

  const ageMs = Date.now() - new Date(data.updated_at).getTime();
  const NINE_DAYS = 9 * 24 * 60 * 60 * 1000;
  if (ageMs > NINE_DAYS) return null;

  return data.value;
}

async function loginAndCacheToken() {
  const res = await fetch(`${SHIPROCKET_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  if (!res.ok) {
    throw new Error(`Shiprocket login failed: ${res.status}`);
  }

  const data = await res.json();
  const token = data.token;

  await supabase
    .from('app_config')
    .upsert({ key: 'shiprocket_token', value: token, updated_at: new Date().toISOString() });

  return token;
}

export async function getShiprocketToken() {
  const cached = await getCachedToken();
  if (cached) return cached;
  return loginAndCacheToken();
}

const DEFAULT_WEIGHT_KG = 0.5;
const DEFAULT_DIMS_CM = { length: 20, breadth: 15, height: 10 };

export async function createShiprocketOrder(payload) {
  const token = await getShiprocketToken();

  const body = {
    order_id: payload.orderId,
    order_date: payload.orderDate,
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION,
    billing_customer_name: payload.customerName,
    billing_last_name: '',
    billing_address: payload.billingAddress,
    billing_city: payload.billingCity,
    billing_pincode: payload.billingPincode,
    billing_state: payload.billingState,
    billing_country: payload.billingCountry,
    billing_email: payload.customerEmail,
    billing_phone: payload.customerPhone,
    shipping_is_billing: true,
    order_items: payload.items.map((item) => ({
      name: item.name,
      sku: item.sku,
      units: item.units,
      selling_price: item.sellingPrice,
    })),
    payment_method: 'Prepaid',
    sub_total: payload.totalAmount,
    length: DEFAULT_DIMS_CM.length,
    breadth: DEFAULT_DIMS_CM.breadth,
    height: DEFAULT_DIMS_CM.height,
    weight: +(DEFAULT_WEIGHT_KG * Math.max(payload.itemCount, 1)).toFixed(2),
  };

  const res = await fetch(`${SHIPROCKET_BASE}/orders/create/adhoc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Shiprocket order creation failed: ${JSON.stringify(data)}`);
  }

  return data;
}