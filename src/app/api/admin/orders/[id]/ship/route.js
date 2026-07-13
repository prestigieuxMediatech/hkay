import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/require-admin";
import { createShiprocketOrder } from "@/lib/shiprocket";

export async function POST(request, { params }) {
    const auth = await requireAdmin(request);
    if (auth.response) return auth.response;

    const { id } = await params;

    const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'paid') {
        return NextResponse.json({ error: 'Order is not marked paid' }, { status: 400 });
    }

    if (order.shiprocket_order_id) {
        return NextResponse.json({ error: 'Order already shipped via Shiprocket' }, { status: 400 });
    }

    const items = order.items;
    const addr = order.shipping_address;

    try {
        const result = await createShiprocketOrder({
            orderId: order.id,
            orderDate: new Date(order.created_at).toISOString().slice(0, 16).replace('T', ' '),
            customerName: addr.fullName,
            customerEmail: addr.email,
            customerPhone: addr.phone,
            billingAddress: [addr.addressLine1, addr.addressLine2].filter(Boolean).join(', '),
            billingCity: addr.city,
            billingState: addr.state,
            billingPincode: addr.pincode,
            billingCountry: 'India',
            items: items.map((item) => ({
                name: item.name,
                sku: item.product_id,
                units: item.quantity,
                sellingPrice: item.price,
            })),
            totalAmount: order.total,
            itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
        });

        const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update({
                shiprocket_order_id: result.order_id,
                shiprocket_shipment_id: result.shipment_id,
                shipment_status: 'shipment_created',
            })
            .eq('id', id)
            .select()
            .single();

        if (updateError) throw updateError;

        return NextResponse.json({ success: true, data: updatedOrder });
    } catch (err) {
        console.error('Shiprocket order creation failed:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}