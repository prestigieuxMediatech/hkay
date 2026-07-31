"use client"

import { useEffect, useMemo, useState } from "react"
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

const statusBadgeClass = {
  paid: "bg-emerald-100 text-emerald-700",
  pending_payment: "bg-amber-100 text-amber-700",
  shipped: "bg-sky-100 text-sky-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
}

function formatStatus(status) {
  return (
    status
      ?.split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") || "Unknown"
  )
}

function formatCurrency(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`
}

function isOrderToday(order) {
  const createdAt = new Date(order.created_at)
  const today = new Date()

  return (
    createdAt.getFullYear() === today.getFullYear() &&
    createdAt.getMonth() === today.getMonth() &&
    createdAt.getDate() === today.getDate()
  )
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [productCount, setProductCount] = useState(0)
  const [categoryCount, setCategoryCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [ordersResponse, productsResponse, categoriesResponse] =
          await Promise.all([
            fetch("/api/admin/orders"),
            fetch("/api/admin/products"),
            fetch("/api/admin/categories"),
          ])

        const [ordersData, productsData, categoriesData] = await Promise.all([
          ordersResponse.ok ? ordersResponse.json() : [],
          productsResponse.ok ? productsResponse.json() : { products: [] },
          categoriesResponse.ok ? categoriesResponse.json() : { categories: [] },
        ])

        setOrders(Array.isArray(ordersData) ? ordersData : [])
        setProductCount(
          Array.isArray(productsData?.products) ? productsData.products.length : 0
        )
        setCategoryCount(
          Array.isArray(categoriesData?.categories)
            ? categoriesData.categories.length
            : 0
        )
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const stats = useMemo(
    () => [
      {
        label: "Total Orders",
        value: orders.length,
        note: "All orders placed in the store",
        dot: "bg-emerald-500",
      },
      {
        label: "Orders Today",
        value: orders.filter(isOrderToday).length,
        note: "Orders received today",
        dot: "bg-amber-500",
      },
      {
        label: "Total Categories",
        value: categoryCount,
        note: "Product categories available",
        dot: "bg-sky-500",
      },
      {
        label: "Total Products",
        value: productCount,
        note: "Products currently in the catalogue",
        dot: "bg-rose-500",
      },
    ],
    [orders, productCount, categoryCount]
  )

  const recentOrders = orders.slice(0, 5)

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
              A clear snapshot of your store activity in one place.
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
                {loading ? "—" : stat.value.toLocaleString("en-IN")}
              </p>
              <p className="mt-2 text-sm text-stone-500">{stat.note}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="border-stone-200/80 bg-white shadow-sm">
        <CardHeader className="border-b border-stone-200/70 pb-4">
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders placed in your store.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <p className="px-5 py-6 text-sm text-stone-500">Loading orders...</p>
          ) : recentOrders.length ? (
            recentOrders.map((order) => {
              const firstItem = order.items?.[0]
              const itemDescription = firstItem?.name || "No items listed"
              const additionalItems = Math.max((order.items?.length || 0) - 1, 0)

              return (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between gap-4 border-b border-stone-100 px-5 py-4 transition-colors last:border-b-0 hover:bg-stone-50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-stone-900">
                      #{order.id.slice(0, 8).toUpperCase()} -{" "}
                      {order.shipping_address?.fullName || "Guest customer"}
                    </p>
                    <p className="mt-1 truncate text-sm text-stone-500">
                      {itemDescription}
                      {additionalItems ? ` + ${additionalItems} more` : ""} -{" "}
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                  <Badge
                    className={`shrink-0 ${
                      statusBadgeClass[order.status] ||
                      "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {formatStatus(order.status)}
                  </Badge>
                </Link>
              )
            })
          ) : (
            <p className="px-5 py-6 text-sm text-stone-500">
              No orders have been placed yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
