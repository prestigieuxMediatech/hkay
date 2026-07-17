'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, ChevronRight, Download } from 'lucide-react'

const statusStyles = {
  paid: 'bg-green-50 text-green-700',
  pending_payment: 'bg-amber-50 text-amber-700',
  shipped: 'bg-blue-50 text-blue-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
}

function formatStatus(status) {
  return status
    ?.split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default function OrdersPage() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [invoiceByOrderId, setInvoiceByOrderId] = useState({})
  const [invoiceLoading, setInvoiceLoading] = useState(false)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/sign-in?redirect_url=/orders')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    let isActive = true

    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders/user')
        const data = await res.json()

        if (isActive) {
          setOrders(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err)
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    fetchOrders()

    return () => {
      isActive = false
    }
  }, [isLoaded, isSignedIn])

  useEffect(() => {
    if (!isLoaded || !isSignedIn || orders.length === 0) return

    let isActive = true

    async function fetchInvoices() {
      setInvoiceLoading(true)

      try {
        const entries = await Promise.all(
          orders.map(async (order) => {
            try {
              const res = await fetch(`/api/orders/${order.id}/invoice`)

              if (!res.ok) {
                return [order.id, null]
              }

              const data = await res.json()
              return [order.id, data.invoice || null]
            } catch (error) {
              console.error(`Failed to fetch invoice for order ${order.id}:`, error)
              return [order.id, null]
            }
          })
        )

        if (isActive) {
          setInvoiceByOrderId(Object.fromEntries(entries))
        }
      } finally {
        if (isActive) {
          setInvoiceLoading(false)
        }
      }
    }

    fetchInvoices()

    return () => {
      isActive = false
    }
  }, [orders, isLoaded, isSignedIn])

  if (!isLoaded || !isSignedIn || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-400 text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-16">
      {/* Dark banner */}
      <div className="bg-stone-900 h-[200px] sm:h-[220px] flex items-end px-6 pb-8 md:px-10 lg:px-20">
        <div className="mt-20">
          <p className="text-stone-400 text-sm mb-2">
            Home / My Orders
          </p>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            My Orders
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {orders.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-stone-400" />
            </div>
            <p className="text-lg font-semibold text-stone-800 mb-2">
              No orders yet
            </p>
            <p className="text-sm text-stone-500 mb-6">
              When you place an order, it&apos;ll show up here.
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3 rounded-xl text-sm font-medium text-white transition hover:opacity-90"
              style={{ background: '#1c0d02' }}
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const invoice = invoiceByOrderId[order.id]

              return (
                <div
                  key={order.id}
                  className="bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-md transition"
                >
                  <div className="p-5 sm:p-6 flex items-center justify-between gap-4">
                    <Link
                      href={`/order-confirmation/${order.id}`}
                      className="flex items-center gap-4 min-w-0 flex-1"
                    >
                      <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0">
                        <Package size={20} className="text-stone-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-stone-900">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-stone-500 mt-1">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                          {' · '}
                          {order.items?.length || 0} item{order.items?.length === 1 ? '' : 's'}
                        </p>
                      </div>
                    </Link>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${
                          statusStyles[order.status] || 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {formatStatus(order.status)}
                      </span>
                      <p className="text-sm font-bold text-stone-900 hidden sm:block">
                        &#8377;{order.total?.toLocaleString('en-IN')}
                      </p>
                      <ChevronRight size={18} className="text-stone-300" />
                    </div>
                  </div>

                  <div className="border-t border-stone-100 px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-stone-900">Invoice</p>
                      {invoiceLoading ? (
                        <p className="text-xs text-stone-500 mt-1">
                          Checking invoice status...
                        </p>
                      ) : invoice ? (
                        <p className="text-xs text-stone-500 mt-1">
                          {invoice.invoice_number}
                        </p>
                      ) : (
                        <p className="text-xs text-stone-500 mt-1">
                          Invoice not ready yet
                        </p>
                      )}
                    </div>

                    {invoice?.downloadUrl ? (
                      <a
                        href={invoice.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition hover:opacity-90"
                        style={{ background: '#1c0d02' }}
                      >
                        <Download size={16} />
                        Download invoice
                      </a>
                    ) : (
                      <span className="text-xs text-stone-400">
                        {invoiceLoading ? 'Loading invoice...' : 'No download available'}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
