'use client'

import { useState } from 'react'
import { useCart } from './CartContext'
import { ShoppingCart, Check } from 'lucide-react'

export default function AddToCartButton({ product }) {
  // get addToCart function from cart context
  const { addToCart } = useCart()

  // loading = true while adding to cart
  const [loading, setLoading] = useState(false)

  // added = true for 2 seconds after adding
  // shows a green "Added" confirmation
  const [added, setAdded] = useState(false)

  async function handleAddToCart() {
    setLoading(true)

    // call addToCart from context
    // this handles both logged in and guest users
    await addToCart(product)

    setLoading(false)
    setAdded(true)

    // reset button back to normal after 2 seconds
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={`flex items-center justify-center gap-2
        w-full py-3 rounded-xl text-sm font-medium
        transition-all duration-300 disabled:opacity-60
        ${added ? 'bg-green-600 text-white' : 'text-white'}`}
      style={!added ? { background: '#1c0d02' } : {}}
    >
      {loading ? (
        // while adding
        'Adding...'
      ) : added ? (
        // after adding — show for 2 seconds
        <>
          <Check size={18} />
          Added to cart
        </>
      ) : (
        // default state
        <>
          <ShoppingCart size={18} />
          Add to cart
        </>
      )}
    </button>
  )
}