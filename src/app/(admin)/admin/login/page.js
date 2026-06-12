import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Mail, LockKeyhole } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#eadccf_0%,#f7f2ec_42%,#f1e8de_100%)] px-4 py-8 text-stone-900">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="flex flex-col justify-between rounded-3xl bg-[#1c0d02] p-8 text-white shadow-[0_30px_80px_rgba(28,13,2,0.18)] md:p-10">
            <div className="space-y-5">
              <div className="inline-flex rounded-2xl bg-white/10 p-3">
                <Image
                  src="/logo_white.png"
                  alt="HKAY"
                  width={96}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-stone-400">
                  Admin access
                </p>
                <h1 className="mt-3 text-3xl font-semibold leading-tight">
                  Simple, secure entry to the HKAY admin panel.
                </h1>
                <p className="mt-3 max-w-md text-sm leading-6 text-stone-300">
                  Log in to review orders, update products, and keep the store
                  running smoothly.
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-3 text-sm text-stone-300 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Orders
                <p className="mt-2 text-lg font-semibold text-white">Live</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Products
                <p className="mt-2 text-lg font-semibold text-white">Managed</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Content
                <p className="mt-2 text-lg font-semibold text-white">Ready</p>
              </div>
            </div>
          </section>

          <Card className="border-stone-200/80 bg-white/90 shadow-[0_30px_80px_rgba(28,13,2,0.1)] backdrop-blur">
            <CardContent className="p-6 md:p-8">
              <div className="mb-8">
                <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
                  Welcome back
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-stone-900">
                  Sign in to continue
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Use your admin credentials to access the panel.
                </p>
              </div>

              <form className="space-y-4">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700">
                    <Mail size={16} />
                    Email
                  </span>
                  <Input type="email" placeholder="admin@hkay.com" />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700">
                    <LockKeyhole size={16} />
                    Password
                  </span>
                  <Input type="password" placeholder="Enter your password" />
                </label>

                <div className="flex items-center justify-between text-sm text-stone-500">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="size-4 rounded border-stone-300 text-[#1c0d02] focus:ring-[#1c0d02]"
                    />
                    Remember me
                  </label>

                  <button type="button" className="hover:text-stone-700">
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="button"
                  className="h-11 w-full bg-[#1c0d02] text-white hover:bg-[#2a1506]"
                >
                  Sign in
                </Button>
              </form>

              <div className="mt-8 border-t border-stone-200 pt-6">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900"
                >
                  <ArrowLeft size={16} />
                  Back to storefront
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
