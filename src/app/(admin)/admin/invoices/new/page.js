// app/admin/invoices/new/page.js
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Chandigarh", "Puducherry",
]

const emptyItem = { name: "", hsn_code: "", quantity: 1, rate: "", gstRate: 18 }

const inputClass =
  "w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:border-stone-400"

export default function NewManualInvoicePage() {
  const router = useRouter()

  const [buyer, setBuyer] = useState({
    name: "", phone: "", email: "", address: "", city: "",
    state: "Maharashtra", pincode: "", gstin: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("Cash")
  const [items, setItems] = useState([{ ...emptyItem }])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function updateBuyer(field, value) {
    setBuyer((b) => ({ ...b, [field]: value }))
  }

  function updateItem(index, field, value) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  function addItem() {
    setItems((prev) => [...prev, { ...emptyItem }])
  }

  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyer, items, paymentMethod }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create invoice')
        return
      }

      router.push('/admin/invoices')
    } catch (err) {
      console.error('Failed to create invoice:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <Link href="/admin/invoices" className="mb-4 block text-sm text-muted-foreground">
        ← Manual Invoices
      </Link>

      <h1 className="mb-6 text-2xl font-semibold">New Manual Invoice</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <Card>
          <CardHeader>
            <CardTitle>Buyer Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Input
              placeholder="Full name *"
              value={buyer.name}
              onChange={(e) => updateBuyer('name', e.target.value)}
              required
            />
            <Input
              placeholder="Phone"
              value={buyer.phone}
              onChange={(e) => updateBuyer('phone', e.target.value)}
            />
            <Input
              placeholder="Email"
              value={buyer.email}
              onChange={(e) => updateBuyer('email', e.target.value)}
            />
            <Input
              placeholder="GSTIN (optional)"
              value={buyer.gstin}
              onChange={(e) => updateBuyer('gstin', e.target.value)}
            />
            <Input
              placeholder="Address"
              value={buyer.address}
              onChange={(e) => updateBuyer('address', e.target.value)}
              className="sm:col-span-2"
            />
            <Input
              placeholder="City"
              value={buyer.city}
              onChange={(e) => updateBuyer('city', e.target.value)}
            />
            <Input
              placeholder="Pincode"
              value={buyer.pincode}
              onChange={(e) => updateBuyer('pincode', e.target.value)}
            />
            <select
              className={inputClass}
              value={buyer.state}
              onChange={(e) => updateBuyer('state', e.target.value)}
            >
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              className={inputClass}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Other">Other</option>
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {items.map((item, i) => (
              <div key={i} className="grid gap-2 rounded-lg border border-stone-200 p-3 sm:grid-cols-12 sm:items-center">
                <Input
                  className="sm:col-span-4"
                  placeholder="Item name *"
                  value={item.name}
                  onChange={(e) => updateItem(i, 'name', e.target.value)}
                  required
                />
                <Input
                  className="sm:col-span-2"
                  placeholder="HSN code *"
                  value={item.hsn_code}
                  onChange={(e) => updateItem(i, 'hsn_code', e.target.value)}
                  required
                />
                <Input
                  className="sm:col-span-1"
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(i, 'quantity', e.target.value)}
                  required
                />
                <Input
                  className="sm:col-span-2"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price (incl. GST) *"
                  value={item.rate}
                  onChange={(e) => updateItem(i, 'rate', e.target.value)}
                  required
                />
                <Input
                  className="sm:col-span-2"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="GST %"
                  value={item.gstRate}
                  onChange={(e) => updateItem(i, 'gstRate', e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="sm:col-span-1"
                  onClick={() => removeItem(i)}
                  disabled={items.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addItem} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add item
            </Button>
          </CardContent>
        </Card>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          type="submit"
          className="w-full text-white sm:w-auto"
          style={{ background: "#1c0d02" }}
          disabled={submitting}
        >
          {submitting ? 'Generating invoice...' : 'Generate Invoice'}
        </Button>
      </form>
    </div>
  )
}