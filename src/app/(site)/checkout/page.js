'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'
import { useCart } from '../components/CartContext'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag } from 'lucide-react'

export default function CheckoutPage() {
  const { cartItems, cartCount } = useCart()
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // form state
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/sign-in?redirect_url=/checkout')
    }
  }, [isLoaded, isSignedIn, router])

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.emailAddresses?.[0]?.emailAddress || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  })

  // calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product_variants?.price ?? item.variant_price ?? item.products?.price ?? 0
    return sum + price * item.quantity
  }, 0)
  const shippingFee = 0
  const total = subtotal + shippingFee

  function handleChange(e) {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  async function handlePlaceOrder(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const items = cartItems.map(item => {
      const variantLabel = item.product_variants?.variant_label || item.variant_label || null
      const baseName = item.products?.name
      return {
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        variant_label: variantLabel,
        name: variantLabel ? `${baseName} — ${variantLabel}` : baseName,
        price: item.product_variants?.price ?? item.variant_price ?? item.products?.price,
        quantity: item.quantity,
        image: item.products?.images?.[0] || null
      }
    })

      const shippingAddress = {
        fullName: form.fullName,
        phone: form.phone,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      }

      const createOrderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      })

      const createOrderData = await createOrderRes.json()

      if (!createOrderRes.ok) {
        setError(createOrderData.error || 'Failed to start payment')
        setLoading(false)
        return
      }

      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

      if (!razorpayKeyId || typeof window === 'undefined' || !window.Razorpay) {
        setError('Payment gateway is still loading. Please try again.')
        setLoading(false)
        return
      }

      const razorpayOptions = {
        key: razorpayKeyId,
        amount: createOrderData.amount,
        currency: createOrderData.currency,
        name: 'Hkay',
        description: 'Leather goods order',
        order_id: createOrderData.id,
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: '#1c0d02',
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            setError('Payment cancelled')
          },
        },
        handler: async (response) => {
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                email: form.email,
                items,
                shippingAddress,
                subtotal,
                shippingFee,
                total,
              }),
            })

            const verifyData = await verifyRes.json()

            if (!verifyRes.ok) {
              setError(verifyData.error || 'Payment verification failed')
              return
            }

            router.push(`/order-confirmation/${verifyData.id}`)
          } catch (err) {
            setError('Something went wrong while verifying payment. Please try again.')
          } finally {
            setLoading(false)
          }
        },
      }

      const razorpayInstance = new window.Razorpay(razorpayOptions)

      razorpayInstance.on('payment.failed', (response) => {
        setLoading(false)
        setError(
          response?.error?.description ||
          response?.error?.reason ||
          response?.error?.step ||
          'Payment failed'
        )
      })

      razorpayInstance.open()

    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  // if cart is empty redirect to shop
  if (cartCount === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-2">
          <ShoppingBag size={28} className="text-stone-400" />
        </div>
        <p className="text-xl font-semibold text-stone-800">
          Your cart is empty
        </p>
        <Link href="/shop" className="mt-3 px-8 py-3 rounded-xl text-sm font-medium text-white" style={{ background: '#1c0d02' }}>
          Browse Shop
        </Link>
      </div>
    )
  }

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-500 text-sm">Redirecting to sign in...</p>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-stone-50 pb-16">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      {/* Dark banner */}
      <div className="bg-stone-900 h-[200px] sm:h-[220px] flex items-end px-6 pb-8 md:px-10 lg:px-20">
        <div className="mt-20">
          <p className="text-stone-400 text-sm mb-2">
            Home / Cart / Checkout
          </p>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Checkout
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Back to cart */}
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition mb-8">
          <ArrowLeft size={16} />
          Back to cart
        </Link>

        <form onSubmit={handlePlaceOrder}>
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* LEFT — Shipping form */}
            <div className="w-full lg:flex-1">

              {/* Contact details */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-6">
                <h2 className="text-base font-semibold text-stone-900 mb-5">
                  Contact details
                </h2>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-medium text-stone-700 block mb-1">
                      Full name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-stone-700 block mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-stone-700 block mb-1">
                        Phone number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping address */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6">
                <h2 className="text-base font-semibold text-stone-900 mb-5">
                  Shipping address
                </h2>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-medium text-stone-700 block mb-1">
                      Address line 1 *
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={form.addressLine1}
                      onChange={handleChange}
                      required
                      placeholder="House / flat no., Street name"
                      className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-stone-700 block mb-1">
                      Address line 2
                      <span className="text-stone-400 font-normal ml-1">(optional)</span>
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={form.addressLine2}
                      onChange={handleChange}
                      placeholder="Apartment, area, landmark"
                      className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-stone-700 block mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                        placeholder="Mumbai"
                        className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-stone-700 block mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        required
                        placeholder="Maharashtra"
                        className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-stone-700 block mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        required
                        placeholder="400001"
                        maxLength={6}
                        className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — Order summary */}
            <div className="w-full lg:w-80 xl:w-96 lg:sticky lg:top-28">
              <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6">
                <h2 className="text-base font-semibold text-stone-900 mb-5">
                  Order Summary
                </h2>

                {/* Cart items */}
                <div className="flex flex-col gap-3 mb-5">
                  {cartItems.map(item => (
                    <div key={item.id || item.product_id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                        {item.products?.images?.[0] ? (
                          <img
                            src={item.products.images[0]}
                            alt={item.products.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-stone-200" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-900 truncate">
                          {item.products?.name}
                        </p>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-stone-900 flex-shrink-0">
                        ₹{((item.products?.price || 0) * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-100 pt-4 flex flex-col gap-3 mb-5">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-stone-500">Subtotal</p>
                    <p className="text-sm font-medium text-stone-900">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-stone-500">Shipping</p>
                    <p className="text-sm font-medium text-green-600">Free</p>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-4 flex justify-between items-center mb-6">
                  <p className="font-semibold text-stone-900">Total</p>
                  <p className="text-lg font-bold text-stone-900">
                    ₹{total.toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Error message */}
                {error && (
                  <p className="text-sm text-red-500 text-center mb-4">
                    {error}
                  </p>
                )}

                {/* Place order button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
                  style={{ background: '#1c0d02' }}
                >
                  {loading ? 'Placing order...' : 'Place order'}
                </button>

                {/* Payment note */}
                <p className="text-[15px] text-stone-1000 text-center mt-3">
                  It takes 6–7 days to handcraft your order.
                  After that, delivery usually takes 3–4 business days.
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}
