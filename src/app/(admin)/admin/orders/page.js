"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"

const statusBadgeClass = {
  paid: "bg-green-100 text-green-700",
  pending_payment: "bg-amber-100 text-amber-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

function formatStatus(status) {
  return status
    ?.split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') || 'Unknown'
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/admin/orders')
        const data = await res.json()
        setOrders(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to fetch orders:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const tabs = [
    { key: "all", label: "All", count: orders.length },
    { key: "pending_payment", label: "Pending", count: orders.filter(o => o.status === 'pending_payment').length },
    { key: "paid", label: "Paid", count: orders.filter(o => o.status === 'paid').length },
    { key: "shipped", label: "Shipped", count: orders.filter(o => o.status === 'shipped').length },
    { key: "delivered", label: "Delivered", count: orders.filter(o => o.status === 'delivered').length },
  ]

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.status === activeTab)

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading orders...</p>
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Orders</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "outline"}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label} ({tab.count})
          </Button>
        ))}
      </div>

      <Card className="hidden md:block">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id.slice(0, 8).toUpperCase()}</TableCell>
                  <TableCell>{order.shipping_address?.fullName || '—'}</TableCell>
                  <TableCell>
                    {order.items?.length || 0} item{order.items?.length === 1 ? '' : 's'}
                  </TableCell>
                  <TableCell>₹{order.total?.toLocaleString('en-IN')}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusBadgeClass[order.status] || "bg-stone-100 text-stone-600"}>
                      {formatStatus(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/orders/${order.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="space-y-3 md:hidden">
        {filteredOrders.map((order) => (
          <Link key={order.id} href={`/admin/orders/${order.id}`}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.shipping_address?.fullName || '—'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{order.total?.toLocaleString('en-IN')}</p>
                    <Badge className={`mt-1 ${statusBadgeClass[order.status] || "bg-stone-100 text-stone-600"}`}>
                      {formatStatus(order.status)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}