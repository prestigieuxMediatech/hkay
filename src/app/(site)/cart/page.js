'use client'

import { useCart } from '../components/CartContext'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'

function getVariantLabel(item) {
  return item.product_variants?.variant_label || item.variant_label || null
}

function getItemPrice(item) {
  const variantPrice = item.product_variants?.price ?? item.variant_price
  return variantPrice ?? item.products?.price ?? 0
}

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart()
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()

  const total = cartItems.reduce((sum, item) => {
    return sum + getItemPrice(item) * item.quantity
  }, 0)

  function handleCheckoutClick() {
    if (!isLoaded) return
    if (!isSignedIn) {
      router.push('/sign-in?redirect_url=/checkout')
      return
    }
    router.push('/checkout')
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-2">
          <ShoppingBag size={28} className="text-stone-400" />
        </div>
        <p className="text-xl font-semibold text-stone-800">
          Your cart is empty
        </p>
        <p className="text-sm text-stone-400 max-w-xs">
          Looks like you haven't added anything yet. Browse our collection and find something you love.
        </p>
        <Link href="/shop" className="mt-3 px-8 py-3 rounded-xl text-sm font-medium text-white transition hover:opacity-90" style={{ background: '#1c0d02' }}>
          Browse Shop
        </Link>
      </div>
    )
  }

  return (
  <div className="min-h-screen bg-stone-50 pb-16">

    <div className="bg-stone-900 h-[200px] sm:h-[220px] 
      flex items-end px-6 pb-8 md:px-10 lg:px-20">
      <div className="mt-16">
        <p className="text-stone-400 text-sm mb-2">
          Home / Cart
        </p>
        <h1 className="text-3xl font-bold text-white md:text-4xl">
          Your Cart
          <span className="ml-3 text-lg font-normal text-stone-400">
            ({cartItems.length} {cartItems.length === 1
              ? 'item' : 'items'})
          </span>
        </h1>
      </div>
    </div>

    <div className="max-w-6xl mx-auto px-4 sm:px-6 
      lg:px-8 py-10">

      <div className="flex flex-col lg:flex-row gap-6 items-start">

        <div className="w-full lg:flex-1 flex flex-col gap-3">
          {cartItems.map((item) => {
            const variantLabel = getVariantLabel(item)
            const itemPrice = getItemPrice(item)

            return (
              <div
                key={item.id || `${item.product_id}-${item.variant_id || 'novariant'}`}
                className="bg-white border border-stone-200
                  rounded-2xl p-4 sm:p-5"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24
                    rounded-xl overflow-hidden bg-stone-100
                    flex-shrink-0">
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

                  <div className="flex-1 min-w-0 flex flex-col
                    justify-between">
                    <div className="flex items-start
                      justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-stone-900
                          text-sm sm:text-base leading-snug
                          line-clamp-2">
                          {item.products?.name}
                        </p>
                        {variantLabel && (
                          <p className="text-xs text-stone-400 mt-0.5">
                            Size: {variantLabel}
                          </p>
                        )}
                        <p className="text-sm text-stone-500 mt-1">
                          ₹{itemPrice.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item)}
                        className="text-stone-300 hover:text-red-500
                          transition flex-shrink-0 p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center
                      justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item, Math.max(1, item.quantity - 1))
                          }
                          className="w-7 h-7 rounded-lg border
                            border-stone-200 flex items-center
                            justify-center text-stone-600
                            hover:bg-stone-50 transition"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="text-sm font-medium
                          w-6 text-center text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item, item.quantity + 1)
                          }
                          className="w-7 h-7 rounded-lg border
                            border-stone-200 flex items-center
                            justify-center text-stone-600
                            hover:bg-stone-50 transition"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <p className="text-sm font-semibold
                        text-stone-900">
                        ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="w-full lg:w-80 xl:w-96 lg:sticky lg:top-28">
          <div className="bg-white border border-stone-200
            rounded-2xl p-5 sm:p-6">
            <h2 className="text-base font-semibold
              text-stone-900 mb-5">
              Order Summary
            </h2>

            <div className="flex flex-col gap-3 mb-5">
              <div className="flex justify-between items-center">
                <p className="text-sm text-stone-500">
                  Subtotal ({cartItems.length} items)
                </p>
                <p className="text-sm font-medium text-stone-900">
                  ₹{total.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-stone-500">Shipping</p>
                <p className="text-sm font-medium text-green-600">
                  Free
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-stone-500">Tax</p>
                <p className="text-sm font-medium text-stone-900">
                  Included
                </p>
              </div>
            </div>

            <div className="border-t border-stone-100 pt-4
              flex justify-between items-center mb-5">
              <p className="font-semibold text-stone-900">Total</p>
              <p className="text-lg font-bold text-stone-900">
                ₹{total.toLocaleString('en-IN')}
              </p>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full py-3.5 rounded-xl text-sm font-medium text-white text-center block transition hover:opacity-90"
              style={{ background: '#1c0d02' }}
            >
              Proceed to Checkout
            </button>

            <Link
              href="/shop"
              className="w-full py-3 rounded-xl text-sm
                font-medium text-stone-600 border
                border-stone-200 flex items-center
                justify-center hover:bg-stone-50 transition"
            >
              Continue Shopping
            </Link>

          </div>
        </div>

      </div>
    </div>
  </div>
)
}