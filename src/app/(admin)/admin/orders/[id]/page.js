import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function OrderDetailPage({ params }) {
  const orderId = params.id

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-4 block text-sm text-muted-foreground"
      >
        ← Orders
      </Link>

      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">#{orderId}</h1>
        <Badge className="bg-green-100 text-green-700">Paid</Badge>
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-sm font-medium">Priya Mehta</p>
            </div>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">+91 88501 49101</p>
            </div>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-sm font-medium">priya@email.com</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="text-sm font-medium">
                12 MG Road, Bangalore, Karnataka 560001
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
              <p className="text-sm text-muted-foreground">Product</p>
              <p className="text-sm font-medium">Slim Wallet</p>
            </div>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground">Quantity</p>
              <p className="text-sm font-medium">1</p>
            </div>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-sm font-medium">₹1,100</p>
            </div>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground">Payment</p>
              <p className="text-sm font-medium">UPI — Paid</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="text-sm font-medium">Jun 10, 2026</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shipment Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-start gap-3">
            <div className="mt-1 h-3 w-3 rounded-full bg-green-500" />
            <div>
              <p className="text-sm font-medium">Order created</p>
              <p className="text-xs text-muted-foreground">Jun 10</p>
            </div>
          </div>

          <div className="mb-4 flex items-start gap-3">
            <div className="mt-1 h-3 w-3 rounded-full bg-green-500" />
            <div>
              <p className="text-sm font-medium">Picked up</p>
              <p className="text-xs text-muted-foreground">Jun 10</p>
            </div>
          </div>

          <div className="mb-4 flex items-start gap-3">
            <div className="mt-1 h-3 w-3 rounded-full bg-stone-300" />
            <div>
              <p className="text-sm font-medium">In transit</p>
              <p className="text-xs text-muted-foreground">—</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 h-3 w-3 rounded-full bg-stone-300" />
            <div>
              <p className="text-sm font-medium">Delivered</p>
              <p className="text-xs text-muted-foreground">—</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <Button
          className="w-full text-white md:w-auto"
          style={{ background: "#1c0d02" }}
        >
          Create Shiprocket Shipment
        </Button>
        <Button variant="outline" className="w-full md:w-auto">
          Print Invoice
        </Button>
      </div>
    </div>
  )
}
