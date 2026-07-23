'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

const CartContext = createContext()

// Build a stable composite key for a cart line: same product + same variant = same line
function lineKey(productId, variantId) {
  return `${productId}::${variantId || 'novariant'}`
}

export function CartProvider({ children }) {
  const { user, isLoaded } = useUser()

  const [cartCount, setCartCount] = useState(0)
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    if (!isLoaded) return

    if (user) {
      fetchCart(user.id)
    } else {
      const local = getLocalCart()
      setCartItems(local)
      setCartCount(local.reduce((sum, item) => sum + item.quantity, 0))
    }
  }, [user, isLoaded])

  async function fetchCart(userId) {
    try {
      const res = await fetch(`/api/cart?userId=${userId}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setCartItems(data)
        setCartCount(data.reduce((sum, item) => sum + item.quantity, 0))
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    }
  }

  function getLocalCart() {
    try {
      const cart = localStorage.getItem('hkay_cart')
      return cart ? JSON.parse(cart) : []
    } catch {
      return []
    }
  }

  function saveLocalCart(items) {
    localStorage.setItem('hkay_cart', JSON.stringify(items))
  }

  // ADD TO CART
  async function addToCart(product, variant = null, quantity = 1) {
    const variantId = variant?.id || null
    const variantLabel = variant?.variant_label || null
    const variantPrice = variant?.price ?? null

    if (user) {
      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            productId: product.id,
            variantId,
            quantity
          })
        })
        await fetchCart(user.id)
      } catch (error) {
        console.error('Failed to add to cart:', error)
      }
    } else {
      const local = getLocalCart()
      const existing = local.find(
        i => lineKey(i.product_id, i.variant_id) === lineKey(product.id, variantId)
      )

      if (existing) {
        existing.quantity += quantity
      } else {
        local.push({
          product_id: product.id,
          variant_id: variantId,
          variant_label: variantLabel,
          variant_price: variantPrice,
          quantity,
          products: product
        })
      }

      saveLocalCart(local)
      setCartItems(local)
      setCartCount(local.reduce((sum, item) => sum + item.quantity, 0))
    }
  }

  // REMOVE FROM CART
  // For guests: pass { productId, variantId }. For logged-in: pass the cart row id (string/uuid), unchanged.
  // REMOVE FROM CART — pass the full cart item object
  async function removeFromCart(item) {
    if (user) {
      await fetch(`/api/cart/${item.id}`, { method: 'DELETE' })
      await fetchCart(user.id)
    } else {
      const local = getLocalCart().filter(
        i => lineKey(i.product_id, i.variant_id) !== lineKey(item.product_id, item.variant_id)
      )
      saveLocalCart(local)
      setCartItems(local)
      setCartCount(local.reduce((sum, i) => sum + i.quantity, 0))
    }
  }

  // UPDATE QUANTITY — pass the full cart item object + new quantity
  async function updateQuantity(item, quantity) {
    if (user) {
      await fetch(`/api/cart/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      })
      await fetchCart(user.id)
    } else {
      const local = getLocalCart().map(i =>
        lineKey(i.product_id, i.variant_id) === lineKey(item.product_id, item.variant_id)
          ? { ...i, quantity }
          : i
      )
      saveLocalCart(local)
      setCartItems(local)
      setCartCount(local.reduce((sum, i) => sum + i.quantity, 0))
    }
  }
  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}