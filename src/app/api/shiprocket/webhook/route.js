// app/api/shiprocket/webhook/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  const incomingToken = req.headers.get('x-api-key');
  if (incomingToken !== process.env.SHIPROCKET_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Invalid webhook token' }, { status: 401 });
  }

  const payload = await req.json();

  const shiprocketOrderId = payload.order_id;
  const awb = payload.awb;
  const courierName = payload.courier_name;
  const currentStatus = payload.current_status;
  const trackingUrl = payload.track_url ?? null;

  if (!shiprocketOrderId) {
    return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
  }

  const { error } = await supabase
    .from('orders')
    .update({
      shipment_status: currentStatus,
      awb_code: awb,
      courier_name: courierName,
      tracking_url: trackingUrl,
    })
    .eq('shiprocket_order_id', shiprocketOrderId);

  if (error) {
    console.error('Failed to update order from Shiprocket webhook:', error);
    return NextResponse.json({ error: 'DB update failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}