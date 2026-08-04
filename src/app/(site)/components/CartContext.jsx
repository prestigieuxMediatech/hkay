'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

const CartContext = createContext()

// Build a stable composite key for a cart line: same product + same variant + same options = same line
function lineKey(productId, variantId, selectedOptions = {}) {
  const optionsKey = JSON.stringify(selectedOptions || {})
  return `${productId}::${variantId || 'novariant'}::${optionsKey}`
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
  // selectedOptions shape coming in from the product page: { "Foil Color": { id, value, price }, ... }
  async function addToCart(product, variant = null, quantity = 1, selectedOptions = {}) {
    const variantId = variant?.id || null
    const variantLabel = variant?.variant_label || null
    const variantPrice = variant?.price ?? null

    // Flatten to a simple, storable shape: { "Foil Color": "Gold" }
    const selectedOptionsFlat = Object.fromEntries(
      Object.entries(selectedOptions || {}).map(([group, opt]) => [group, opt.value])
    )
    const optionsPriceAdjustment = Object.values(selectedOptions || {}).reduce(
      (sum, opt) => sum + (opt.price || 0),
      0
    )

    if (user) {
      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            productId: product.id,
            variantId,
            quantity,
            selectedOptions: selectedOptionsFlat,
            optionsPriceAdjustment
          })
        })
        await fetchCart(user.id)
      } catch (error) {
        console.error('Failed to add to cart:', error)
      }
    } else {
      const local = getLocalCart()
      const existing = local.find(
        i => lineKey(i.product_id, i.variant_id, i.selected_options) ===
             lineKey(product.id, variantId, selectedOptionsFlat)
      )

      if (existing) {
        existing.quantity += quantity
      } else {
        local.push({
          product_id: product.id,
          variant_id: variantId,
          variant_label: variantLabel,
          variant_price: variantPrice,
          selected_options: selectedOptionsFlat,
          options_price_adjustment: optionsPriceAdjustment,
          quantity,
          products: product
        })
      }

      saveLocalCart(local)
      setCartItems(local)
      setCartCount(local.reduce((sum, item) => sum + item.quantity, 0))
    }
  }

  // REMOVE FROM CART — pass the full cart item object
  async function removeFromCart(item) {
    if (user) {
      await fetch(`/api/cart/${item.id}`, { method: 'DELETE' })
      await fetchCart(user.id)
    } else {
      const local = getLocalCart().filter(
        i => lineKey(i.product_id, i.variant_id, i.selected_options) !==
             lineKey(item.product_id, item.variant_id, item.selected_options)
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
        lineKey(i.product_id, i.variant_id, i.selected_options) ===
        lineKey(item.product_id, item.variant_id, item.selected_options)
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