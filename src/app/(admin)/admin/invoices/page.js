// app/admin/invoices/page.js
"use client"

import { useState, useEffect, useMemo } from "react"
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
import { Download, Plus, Check } from "lucide-react"

const TABS = [
  { key: "pending", label: "Pending Review" },
  { key: "all", label: "All Invoices" },
]

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")
  const [approvingId, setApprovingId] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchInvoices()
  }, [])

  async function fetchInvoices() {
    setLoading(true)
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

  async function handleApprove(id) {
    setError(null)
    setApprovingId(id)
    try {
      const res = await fetch(`/api/admin/invoices/${id}/approve`, {
        method: 'PATCH',
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to approve invoice')
        return
      }

      // Update locally instead of refetching everything
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, ...data.invoice } : inv))
      )
    } catch (err) {
      console.error('Failed to approve invoice:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setApprovingId(null)
    }
  }

  const pendingCount = useMemo(
    () => invoices.filter((inv) => inv.approval_status === 'pending_review').length,
    [invoices]
  )

  const visibleInvoices = useMemo(() => {
    if (activeTab === 'pending') {
      return invoices.filter((inv) => inv.approval_status === 'pending_review')
    }
    return invoices
  }, [invoices, activeTab])

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

      <div className="mb-4 flex gap-2 border-b border-stone-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.key
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-muted-foreground hover:text-stone-700'
            }`}
          >
            {tab.label}
            {tab.key === 'pending' && pendingCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading invoices...</p>
      ) : visibleInvoices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              {activeTab === 'pending' ? 'No invoices pending review.' : 'No invoices yet.'}
            </p>
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
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleInvoices.map((inv) => (
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
                      {inv.approval_status === 'pending_review' ? (
                        <Badge className="bg-amber-100 text-amber-800">Pending Review</Badge>
                      ) : inv.approval_status === 'approved' ? (
                        <Badge className="bg-green-100 text-green-700">Approved</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700">Rejected</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(inv.invoice_date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>₹{Number(inv.grand_total || 0).toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {inv.approval_status === 'pending_review' && (
                          <Button
                            size="sm"
                            className="text-white"
                            style={{ background: "#1c0d02" }}
                            onClick={() => handleApprove(inv.id)}
                            disabled={approvingId === inv.id}
                          >
                            <Check className="mr-1.5 h-3.5 w-3.5" />
                            {approvingId === inv.id ? 'Approving...' : 'Approve'}
                          </Button>
                        )}
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
                      </div>
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