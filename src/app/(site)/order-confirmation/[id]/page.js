'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import Link from 'next/link'
import { CheckCircle, Package } from 'lucide-react'
import { useCart } from '../../components/CartContext'

export default function OrderConfirmationPage({ params }) {
  const { id } = use(params)
  const { fetchCart } = useCart()
  const [order, setOrder] = useState(null)
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [invoiceLoading, setInvoiceLoading] = useState(true)
  const [invoiceChecked, setInvoiceChecked] = useState(false)

  useEffect(() => {
    if (!id) return
    let isActive = true

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`)
        const data = await res.json()
        if (isActive) {
          setOrder(data)
        }
      } catch (err) {
        console.error('Failed to fetch order:', err)
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    async function fetchInvoice() {
      try {
        const res = await fetch(`/api/orders/${id}/invoice`)

        if (!res.ok) {
          return
        }

        const data = await res.json()

        if (isActive) {
          setInvoice(data.invoice)
        }
      } catch (err) {
        console.error('Failed to fetch invoice:', err)
      } finally {
        if (isActive) {
          setInvoiceLoading(false)
          setInvoiceChecked(true)
        }
      }
    }

    fetchOrder()
    fetchInvoice()

    // clear cart after successful order
    // this will be replaced by payment webhook later
    localStorage.removeItem('hkay_cart')

    return () => {
      isActive = false
    }
  }, [id])

  if (loading) {
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
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Order Confirmed
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

        {/* Success message */}
        <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-stone-900 mb-2">
            Thank you for your order!
          </h2>
          <p className="text-sm text-stone-500 mb-1">
            Order ID: <span className="font-medium text-stone-700">#{id.slice(0, 8).toUpperCase()}</span>
          </p>
          <p className="text-sm text-stone-500">
            We&apos;ll confirm your order shortly via email.
          </p>
        </div>

        {/* Order items */}
        {order && (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-stone-900 mb-4 flex items-center gap-2">
              <Package size={16} />
              Order items
            </h3>
            <div className="flex flex-col gap-3">
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
                    <p className="text-sm font-medium text-stone-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-stone-900">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-100 mt-4 pt-4 flex justify-between items-center">
              <p className="font-semibold text-stone-900">Total</p>
              <p className="text-lg font-bold text-stone-900">
                ₹{order.total?.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        )}

        {/* Shipping address */}
        {order?.shipping_address && (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-stone-900 mb-3">
              Shipping to
            </h3>
            <p className="text-sm text-stone-700">
              {order.shipping_address.fullName}
            </p>
            <p className="text-sm text-stone-500 mt-1">
              {order.shipping_address.addressLine1}
              {order.shipping_address.addressLine2 &&
                `, ${order.shipping_address.addressLine2}`}
            </p>
            <p className="text-sm text-stone-500">
              {order.shipping_address.city},{' '}
              {order.shipping_address.state} —{' '}
              {order.shipping_address.pincode}
            </p>
            <p className="text-sm text-stone-500 mt-1">
              📞 {order.shipping_address.phone}
            </p>
          </div>
        )}

        {/* Invoice */}
        {(invoiceLoading || invoiceChecked) && (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-stone-900 mb-3">
              Invoice
            </h3>

            {invoiceLoading ? (
              <p className="text-sm text-stone-500">Checking invoice status...</p>
            ) : invoice ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-stone-800">
                    {invoice.invoice_number}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Total: ₹{Number(invoice.grand_total || 0).toLocaleString('en-IN')}
                  </p>
                </div>

                {invoice.downloadUrl ? (
                  <a
                    href={invoice.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium text-white transition hover:opacity-90"
                    style={{ background: '#1c0d02' }}
                  >
                    Download invoice
                  </a>
                ) : (
                  <p className="text-sm text-stone-500">
                    Invoice PDF is being prepared.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-stone-500">
                Your invoice will appear here once it is ready.
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/shop"
            className="flex-1 py-3 rounded-xl text-sm font-medium text-white text-center transition hover:opacity-90"
            style={{ background: '#1c0d02' }}
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 rounded-xl text-sm font-medium text-stone-600 border border-stone-200 text-center hover:bg-stone-50 transition"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
