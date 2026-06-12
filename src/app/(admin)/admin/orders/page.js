"use client"

import { useState } from "react"
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

const orders = [
  {
    id: "1042",
    customer: "Priya M.",
    product: "Slim Wallet",
    amount: "₹1,100",
    date: "Jun 10, 2026",
    status: "Paid",
    badgeClass: "bg-green-100 text-green-700",
    tab: "all",
  },
  {
    id: "1041",
    customer: "Arjun K.",
    product: "Briefcase Pro",
    amount: "₹4,200",
    date: "Jun 9, 2026",
    status: "Shipped",
    badgeClass: "bg-blue-100 text-blue-700",
    tab: "shipped",
  },
  {
    id: "1040",
    customer: "Sneha R.",
    product: "Tote Bag",
    amount: "₹3,500",
    date: "Jun 9, 2026",
    status: "Pending",
    badgeClass: "bg-amber-100 text-amber-700",
    tab: "pending",
  },
  {
    id: "1039",
    customer: "Rohan S.",
    product: "Classic Belt",
    amount: "₹900",
    date: "Jun 8, 2026",
    status: "Delivered",
    badgeClass: "bg-green-100 text-green-700",
    tab: "delivered",
  },
  {
    id: "1038",
    customer: "Meera D.",
    product: "Watch Strap",
    amount: "₹999",
    date: "Jun 7, 2026",
    status: "Delivered",
    badgeClass: "bg-green-100 text-green-700",
    tab: "delivered",
  },
]

const tabs = [
  { key: "all", label: "All", count: 48 },
  { key: "pending", label: "Pending", count: 5 },
  { key: "shipped", label: "Shipped", count: 18 },
  { key: "delivered", label: "Delivered", count: 25 },
]

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.tab === activeTab)

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
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge className={order.badgeClass}>{order.status}</Badge>
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
                    <p className="font-bold">#{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.product}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                    <Badge className={`mt-1 ${order.badgeClass}`}>
                      {order.status}
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
