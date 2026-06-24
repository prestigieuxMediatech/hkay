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
  const { pathname } = req.nextUrl

  // ── ADMIN SIDE — JWT check ──
  if (isAdminRoute(req)) {
    // always allow admin login page
    if (isAdminLogin(req)) return NextResponse.next()

    const token = req.cookies.get(COOKIE_NAME)?.value

    if (!token || !(await isValidSession(token))) {
      const url = req.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }

    // valid admin session — allow through
    return NextResponse.next()
  }

  // ── CUSTOMER SIDE — Clerk check ──
  if (isCustomerProtected(req)) {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.redirect(
        new URL('/sign-in', req.url)
      )
    }
  }

})

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/(api|trpc)(.*)',
  ],
}