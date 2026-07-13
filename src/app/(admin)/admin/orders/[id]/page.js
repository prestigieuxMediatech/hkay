"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const statusBadgeClass = {
  paid: "bg-green-100 text-green-700",
  pending_payment: "bg-amber-100 text-amber-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

const shipmentStatusBadgeClass = {
  not_shipped: "bg-stone-100 text-stone-600",
  shipment_created: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
}

function formatStatus(status) {
  return status
    ?.split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') || 'Unknown'
}

export default function OrderDetailPage({ params }) {
  const [orderId, setOrderId] = useState(null)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [shipping, setShipping] = useState(false)
  const [shipError, setShipError] = useState(null)

  useEffect(() => {
    async function resolveParams() {
      const resolved = await params
      setOrderId(resolved.id)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (!orderId) return

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/admin/orders/${orderId}`)
        const data = await res.json()
        setOrder(data)
      } catch (err) {
        console.error('Failed to fetch order:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  async function updateStatus(newStatus) {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      const data = await res.json()
      setOrder(data)
    } catch (err) {
      console.error('Failed to update order:', err)
    } finally {
      setUpdating(false)
    }
  }

  async function shipViaShiprocket() {
    setShipping(true)
    setShipError(null)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/ship`, {
        method: 'POST',
      })
      const data = await res.json()

      if (!res.ok) {
        setShipError(data.error || 'Failed to create shipment')
        return
      }

      setOrder(data.data)
    } catch (err) {
      console.error('Failed to ship order:', err)
      setShipError('Something went wrong. Please try again.')
    } finally {
      setShipping(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading order...</p>
  }

  if (!order) {
    return <p className="text-sm text-muted-foreground">Order not found.</p>
  }

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-4 block text-sm text-muted-foreground"
      >
        ← Orders
      </Link>

      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">
          #{order.id.slice(0, 8).toUpperCase()}
        </h1>
        <Badge className={statusBadgeClass[order.status] || "bg-stone-100 text-stone-600"}>
          {formatStatus(order.status)}
        </Badge>
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-sm font-medium">{order.shipping_address?.fullName || '—'}</p>
            </div>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">{order.shipping_address?.phone || '—'}</p>
            </div>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{order.shipping_address?.email || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="text-sm font-medium">
                {order.shipping_address?.addressLine1}
                {order.shipping_address?.addressLine2 && `, ${order.shipping_address.addressLine2}`}
                {`, ${order.shipping_address?.city}, ${order.shipping_address?.state} — ${order.shipping_address?.pincode}`}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground">Subtotal</p>
              <p className="text-sm font-medium">₹{order.subtotal?.toLocaleString('en-IN')}</p>
            </div>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground">Shipping</p>
              <p className="text-sm font-medium">
                {order.shipping_fee > 0 ? `₹${order.shipping_fee.toLocaleString('en-IN')}` : 'Free'}
              </p>
            </div>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-sm font-medium">₹{order.total?.toLocaleString('en-IN')}</p>
            </div>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground">Payment</p>
              <p className="text-sm font-medium">
                {order.razorpay_payment_id ? `Razorpay — ${formatStatus(order.status)}` : 'Not paid'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="text-sm font-medium">
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Items Ordered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-stone-200" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Shipping (Shiprocket)</CardTitle>
        </CardHeader>
        <CardContent>
          {order.shiprocket_order_id ? (
            <>
              <div className="mb-3 flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={shipmentStatusBadgeClass[order.shipment_status] || "bg-stone-100 text-stone-600"}>
                  {formatStatus(order.shipment_status)}
                </Badge>
              </div>
              <div className="mb-3">
                <p className="text-sm text-muted-foreground">Shiprocket Order ID</p>
                <p className="text-sm font-medium">{order.shiprocket_order_id}</p>
              </div>
              {order.awb_code && (
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground">AWB Code</p>
                  <p className="text-sm font-medium">{order.awb_code}</p>
                </div>
              )}
              {order.courier_name && (
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground">Courier</p>
                  <p className="text-sm font-medium">{order.courier_name}</p>
                </div>
              )}
              {order.tracking_url && (
                <a
                  href={order.tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline"
                  style={{ color: "#1c0d02" }}
                >
                  Track shipment →
                </a>
              )}
            </>
          ) : order.status === 'paid' ? (
            <>
              <p className="mb-3 text-sm text-muted-foreground">
                This order hasn't been shipped yet.
              </p>
              <Button
                className="w-full text-white md:w-auto"
                style={{ background: "#1c0d02" }}
                disabled={shipping}
                onClick={shipViaShiprocket}
              >
                {shipping ? 'Creating shipment...' : 'Ship via Shiprocket'}
              </Button>
              {shipError && (
                <p className="mt-2 text-sm text-red-600">{shipError}</p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Order must be paid before it can be shipped.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 md:flex-row">
        {order.status === 'paid' && (
          <Button
            className="w-full text-white md:w-auto"
            style={{ background: "#1c0d02" }}
            disabled={updating}
            onClick={() => updateStatus('shipped')}
          >
            Mark as Shipped
          </Button>
        )}
        {order.status === 'shipped' && (
          <Button
            className="w-full text-white md:w-auto"
            style={{ background: "#1c0d02" }}
            disabled={updating}
            onClick={() => updateStatus('delivered')}
          >
            Mark as Delivered
          </Button>
        )}
        <Button variant="outline" className="w-full md:w-auto">
          Print Invoice
        </Button>
      </div>
    </div>
  )
}