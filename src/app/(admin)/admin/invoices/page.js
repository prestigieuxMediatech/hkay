// app/admin/invoices/page.js
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
import { Download, Plus } from "lucide-react"

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await fetch('/api/admin/invoices')
        const data = await res.json()
        setInvoices(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to fetch invoices:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchInvoices()
  }, [])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <Button asChild className="text-white" style={{ background: "#1c0d02" }}>
          <Link href="/admin/invoices/new">
            <Plus className="mr-2 h-4 w-4" />
            New Manual Invoice
          </Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading invoices...</p>
      ) : invoices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No invoices yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No.</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.invoice_number}</TableCell>
                    <TableCell>{inv.billing_details?.name || '—'}</TableCell>
                    <TableCell>
                      {inv.order_id ? (
                        <Link
                          href={`/admin/orders/${inv.order_id}`}
                          className="text-sm underline"
                          style={{ color: "#1c0d02" }}
                        >
                          <Badge className="bg-blue-100 text-blue-700">Online Order</Badge>
                        </Link>
                      ) : (
                        <Badge className="bg-stone-100 text-stone-600">Manual Sale</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(inv.invoice_date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>₹{Number(inv.grand_total || 0).toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      {inv.downloadUrl ? (
                        <Button variant="outline" size="sm" asChild>
                          <a href={inv.downloadUrl} target="_blank" rel="noreferrer">
                            <Download className="mr-1.5 h-3.5 w-3.5" />
                            Download
                          </a>
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Preparing...</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}