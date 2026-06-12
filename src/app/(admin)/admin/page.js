import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const stats = [
  {
    label: "Today's Orders",
    value: "12",
    note: "4 waiting for fulfillment",
    dot: "bg-emerald-500",
  },
  {
    label: "Revenue Today",
    value: "Rs. 18,400",
    note: "Up from yesterday",
    dot: "bg-amber-500",
  },
  {
    label: "Pending Orders",
    value: "5",
    note: "Needs a quick follow-up",
    dot: "bg-sky-500",
  },
  {
    label: "Low Stock Items",
    value: "3",
    note: "Restock before the weekend",
    dot: "bg-rose-500",
  },
]

const recentOrders = [
  {
    id: "1042",
    customer: "Priya M.",
    product: "Slim Wallet",
    amount: "Rs. 1,100",
    status: "Paid",
    badgeClass: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "1041",
    customer: "Arjun K.",
    product: "Briefcase Pro",
    amount: "Rs. 4,200",
    status: "Shipped",
    badgeClass: "bg-sky-100 text-sky-700",
  },
  {
    id: "1040",
    customer: "Sneha R.",
    product: "Tote Bag",
    amount: "Rs. 3,500",
    status: "Pending",
    badgeClass: "bg-amber-100 text-amber-700",
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Overview
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900">
              Dashboard
            </h1>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              A clear snapshot of orders, revenue, and stock levels in one
              place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-emerald-700"
            >
              Live store
            </Badge>
            <Button
              asChild
              className="bg-[#1c0d02] text-white hover:bg-[#2a1506]"
            >
              <Link href="/admin/orders">View orders</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border-stone-200/80 bg-white shadow-sm"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-stone-500">{stat.label}</p>
                <span className={`size-2.5 rounded-full ${stat.dot}`} />
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-stone-500">{stat.note}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <Card className="border-stone-200/80 bg-white shadow-sm">
          <CardHeader className="border-b border-stone-200/70 pb-4">
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest orders that need a quick scan.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between border-b border-stone-100 px-5 py-4 transition-colors last:border-b-0 hover:bg-stone-50"
              >
                <div>
                  <p className="font-medium text-stone-900">
                    #{order.id} - {order.customer}
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    {order.product} - {order.amount}
                  </p>
                </div>
                <Badge className={order.badgeClass}>{order.status}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-stone-200/80 bg-white shadow-sm">
          <CardHeader className="border-b border-stone-200/70 pb-4">
            <CardTitle>Store Focus</CardTitle>
            <CardDescription>Simple reminders for today.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <div className="rounded-2xl bg-stone-50 p-4">
              <p className="text-sm font-medium text-stone-900">
                5 orders need attention
              </p>
              <p className="mt-1 text-sm text-stone-500">
                Check pending and shipped orders before the end of day.
              </p>
            </div>
            <div className="rounded-2xl bg-stone-50 p-4">
              <p className="text-sm font-medium text-stone-900">
                3 products are low in stock
              </p>
              <p className="mt-1 text-sm text-stone-500">
                Restock the fastest-moving items to avoid gaps.
              </p>
            </div>
            <div className="rounded-2xl bg-stone-50 p-4">
              <p className="text-sm font-medium text-stone-900">
                2 blog drafts are ready
              </p>
              <p className="mt-1 text-sm text-stone-500">
                Publish them when the store is quiet.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
