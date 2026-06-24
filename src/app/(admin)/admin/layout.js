"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowRight,
  FileText,
  LayoutDashboard,
  Menu,
  Package,
  Tags,
  Settings2,
  ShoppingBag,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings2 },
]

function NavLink({ href, label, icon: Icon, pathname, onClick }) {
  const isActive =
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition",
        isActive
          ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          : "text-stone-300 hover:bg-white/5 hover:text-white"
      )}
    >
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition",
          isActive && "border-transparent bg-[#f4e8dc] text-[#1c0d02]"
        )}
      >
        <Icon size={16} />
      </span>
      <span className="flex-1">{label}</span>
      <ArrowRight
        size={14}
        className={cn(
          "transition-transform",
          isActive ? "opacity-80" : "opacity-0 group-hover:translate-x-0.5 group-hover:opacity-80"
        )}
      />
    </Link>
  )
}

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    return children
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8f5f1_0%,#f2ece5_100%)] text-stone-900">
      <div className="min-h-screen md:grid md:grid-cols-[18rem_1fr]">
        <aside className="hidden border-r border-white/10 bg-[#1c0d02] text-white md:flex md:flex-col">
          <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
            <Image
              src="/logo_white.png"
              alt="HKAY"
              width={92}
              height={40}
              priority
              className="h-8 w-auto object-contain"
            />
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-stone-400">
                Admin
              </p>
              <p className="text-sm text-stone-200">Control panel</p>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                pathname={pathname}
                href={link.href}
                label={link.label}
                icon={link.icon}
              />
            ))}
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.25em] text-stone-400">
                Workspace
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-200">
                A clean, focused space for orders, inventory, and content.
              </p>
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/admin/login'
                }}
                className="mt-4 w-full rounded-xl border border-white/10 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20 hover:text-red-200"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/85 backdrop-blur md:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <Link href="/admin" className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1c0d02]">
                  <Image
                    src="/logo_white.png"
                    alt="HKAY"
                    width={54}
                    height={24}
                    className="h-4 w-auto object-contain"
                  />
                </span>
                <span className="text-sm font-medium text-stone-900">
                  Admin
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                className="rounded-xl p-2 text-stone-700 transition hover:bg-stone-100"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

            {menuOpen && (
              <div className="border-t border-stone-200 bg-white px-4 py-3">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.href}
                      pathname={pathname}
                      href={link.href}
                      label={link.label}
                      icon={link.icon}
                      onClick={() => setMenuOpen(false)}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = '/admin/login'
                    }}
                    className="mt-1 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-red-400 transition hover:bg-white/5"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </header>

          <main className="flex-1 px-4 py-4 md:px-6 md:py-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
