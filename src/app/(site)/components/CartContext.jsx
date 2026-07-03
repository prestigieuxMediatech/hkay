'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

// Step 1 â€” create the context
// think of this as creating an empty shared box
const CartContext = createContext()

// Step 2 â€” CartProvider wraps your entire site
// every component inside it can access cart data
export function CartProvider({ children }) {
  const { user, isLoaded } = useUser()
  // user = logged in Clerk user, null if guest
  // isLoaded = false until Clerk finishes checking auth

  const [cartCount, setCartCount] = useState(0)
  const [cartItems, setCartItems] = useState([])

  // Step 3 â€” when user logs in or out, reload cart
  useEffect(() => {
    // wait for Clerk to finish loading
    if (!isLoaded) return

    if (user) {
      // user is logged in â†’ fetch cart from Supabase
      fetchCart(user.id)
    } else {
      // user is guest â†’ fetch cart from localStorage
      const local = getLocalCart()
      setCartItems(local)
      setCartCount(
        local.reduce((sum, item) => sum + item.quantity, 0)
      )
    }
  }, [user, isLoaded])

  // fetch cart from Supabase for logged in users
  async function fetchCart(userId) {
    try {
      const res = await fetch(`/api/cart?userId=${userId}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setCartItems(data)
        setCartCount(
          data.reduce((sum, item) => sum + item.quantity, 0)
        )
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    }
  }

  // get cart from localStorage for guest users
  function getLocalCart() {
    try {
      const cart = localStorage.getItem('hkay_cart')
      return cart ? JSON.parse(cart) : []
    } catch {
      return []
    }
  }

  // save cart to localStorage for guest users
  function saveLocalCart(items) {
    localStorage.setItem('hkay_cart', JSON.stringify(items))
  }

  // ADD TO CART
  // called when user clicks "Add to cart" button
  async function addToCart(product, quantity = 1) {
    if (user) {
      // logged in â†’ save to Supabase via API
      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            productId: product.id,
            quantity
          })
        })
        // refresh cart after adding
        await fetchCart(user.id)
      } catch (error) {
        console.error('Failed to add to cart:', error)
      }
    } else {
      // guest â†’ save to localStorage
      const local = getLocalCart()
      const existing = local.find(
        i => i.product_id === product.id
      )

      if (existing) {
        // product already in cart â†’ increase quantity
        existing.quantity += quantity
      } else {
        // new product â†’ add to cart
        local.push({
          product_id: product.id,
          quantity,
          products: product
        })
      }

      saveLocalCart(local)
      setCartItems(local)
      setCartCount(
        local.reduce((sum, item) => sum + item.quantity, 0)
      )
    }
  }

  // REMOVE FROM CART
  async function removeFromCart(id) {
    if (user) {
      // logged in â†’ delete from Supabase
      await fetch(`/api/cart/${id}`, { method: 'DELETE' })
      await fetchCart(user.id)
    } else {
      // guest â†’ remove from localStorage
      const local = getLocalCart().filter(
        i => i.product_id !== id
      )
      saveLocalCart(local)
      setCartItems(local)
      setCartCount(
        local.reduce((sum, item) => sum + item.quantity, 0)
      )
    }
  }

  // UPDATE QUANTITY
  async function updateQuantity(id, quantity) {
    if (user) {
      // logged in â†’ update in Supabase
      await fetch(`/api/cart/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      })
      await fetchCart(user.id)
    } else {
      // guest â†’ update in localStorage
      const local = getLocalCart().map(i =>
        i.product_id === id ? { ...i, quantity } : i
      )
      saveLocalCart(local)
      setCartItems(local)
      setCartCount(
        local.reduce((sum, item) => sum + item.quantity, 0)
      )
    }
  }

  // Step 4 â€” provide all cart data and functions
  // to every component inside CartProvider
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

// Step 5 â€” custom hook
// any component can do: const { cartCount } = useCart()
// instead of the longer: useContext(CartContext)
export function useCart() {
  return useContext(CartContext)
}
