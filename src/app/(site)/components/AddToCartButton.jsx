'use client'

import { useState } from 'react'
import { useCart } from './CartContext'
import { ShoppingCart, Check } from 'lucide-react'

export default function AddToCartButton({ product, variant, onClick, className }) {
  const { addToCart } = useCart()

  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)

  async function handleAddToCart() {
    if (onClick) {
      const proceed = onClick()
      if (proceed === false) return
    }

    setLoading(true)
    await addToCart(product, variant || null)
    setLoading(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={`flex items-center justify-center gap-2
        w-full py-3 rounded-xl text-sm font-medium
        transition-all duration-300 disabled:opacity-60
        ${added ? 'bg-green-600 text-white' : 'text-white'}
        ${className || ''}`}
      style={!added ? { background: '#1c0d02' } : {}}
    >
      {loading ? (
        'Adding...'
      ) : added ? (
        <>
          <Check size={18} />
          Added to cart
        </>
      ) : (
        <>
          <ShoppingCart size={18} />
          Add to cart
        </>
      )}
    </button>
  )
}