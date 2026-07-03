import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// ── ADMIN CONFIG ──
const secret = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET)
const COOKIE_NAME = 'admin_session'

async function isValidSession(token) {
  try {
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

// ── ROUTE MATCHERS ──
const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isAdminLogin = createRouteMatcher(['/admin/login(.*)'])
const isCustomerProtected = createRouteMatcher([
  '/account(.*)',
  '/orders(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // ── ADMIN SIDE — bypass Clerk entirely, just JWT ──
  if (isAdminRoute(req)) {
    if (isAdminLogin(req)) return NextResponse.next()

    const token = req.cookies.get(COOKIE_NAME)?.value
    if (!token || !(await isValidSession(token))) {
      const url = req.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('next', req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // ── CUSTOMER SIDE — Clerk only where needed ──
  if (isCustomerProtected(req)) {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }
  }

  return NextResponse.next() // ← ADD THIS: explicit pass-through for all other routes
})

export const config = {
  matcher: [
    /*
     * Only run middleware on:
     * - /admin routes (JWT check)
     * - /account, /orders (Clerk check)
     * - /api and /trpc routes
     *
     * Skip: _next/static, _next/image, favicon, public files
     */
    '/admin/:path*',
    '/account/:path*',
    '/orders/:path*',
    '/(api|trpc)(.*)',
  ],
}