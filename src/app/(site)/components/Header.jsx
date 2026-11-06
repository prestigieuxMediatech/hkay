"use client"
import { useState, useEffect } from "react"
import { useUser, SignInButton, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, User, Menu, ChevronRight, Package , ArrowUpRight, CalendarDays, Sparkles} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCart } from './CartContext'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"

export default function Header() {
       const messages = [
        "PROJECT BOOKINGS OPEN FROM 1 DECEMBER 2026",
        "NEW PROJECTS · NEW POSSIBILITIES",
        "LET'S BUILD SOMETHING EXCEPTIONAL",
      ];
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const { cartCount } = useCart()
    const { isLoaded, isSignedIn } = useUser()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        handleScroll()
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const menu = [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Shop", href: "/shop" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
    ]

    const isLight = scrolled || menuOpen

    const iconBtnClass = `cursor-pointer transition-colors duration-300 ${
        isLight
            ? "text-black hover:text-gray-500 hover:bg-gray-100"
            : "text-white hover:text-gray-300 hover:bg-white/10"
    }`

    const navLinkClass = `text-base xl:text-lg cursor-pointer transition-colors duration-300 ${
        isLight ? "text-black hover:text-gray-500" : "text-white hover:text-gray-300"
    }`

    const isActiveRoute = (href) => {
        if (href === "/") {
            return pathname === "/"
        }

        return pathname === href || pathname.startsWith(`${href}/`)
    }

    const getNavLinkClass = (href) => {
        const isActive = isActiveRoute(href)

        return `${navLinkClass} ${
            isActive
                ? isLight
                    ? "font-semibold text-[#3b1f0f] underline decoration-[#3b1f0f] underline-offset-8"
                    : "font-semibold text-white underline decoration-white underline-offset-8"
                : ""
        }`
    }

    return (

        <>
   <div className="w-full overflow-hidden bg-[#071B2C] py-4">
  <style>
    {`
      @keyframes marquee {
        from {
          transform: translateX(-50%);
        }
        to {
          transform: translateX(0);
        }
      }

      .animate-marquee {
        animation: marquee 35s linear infinite;
        will-change: transform;
      }

      .animate-marquee:hover {
        animation-play-state: paused;
      }
    `}
  </style>

  <div className="flex w-max animate-marquee">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="flex shrink-0 items-center">
        {[
          "IMPORTANT NOTICE FOR COUSTOMER",
          "LEATHER CRAFTING & ORDER PROCESSING WILL RESUME FROM 1ST DECEMBER 2026",
          "THANK YOU FOR YOUR PATIENCE",
        ].map((message, i) => (
          <div
            key={i}
            className="mx-8 flex items-center gap-5 whitespace-nowrap"
          >
            <Sparkles className="h-5 w-5 text-[#B9F56A]" />

            <span className="text-sm font-bold tracking-[0.12em] text-white md:text-base">
              {message}
            </span>

            {i === 1 && (
              <span className="rounded-full bg-[#B9F56A] px-5 py-2 text-xs font-black tracking-wider text-[#071B2C]">
                DEC 01, 2026
              </span>
            )}

            <ArrowUpRight className="h-5 w-5 text-[#B9F56A]" />

            <div className="mx-4 h-2 w-2 rounded-full bg-[#B9F56A]" />
          </div>
        ))}
      </div>
    ))}
  </div>
</div>
        <header
            className={`fixed top-10 left-0 w-full z-50 transition-all duration-300 ${
                isLight ? "bg-white shadow-md py-3 md:py-4" : "bg-transparent py-4 md:py-7"
            }`}
        >
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10">
                <Link href="/">
                    <Image
                        src={isLight ? "/logo_black.png" : "/logo_white.png"}
                        alt="Logo"
                        width={90}
                        height={70}
                        className="h-10 w-auto sm:h-18 cursor-pointer object-contain transition-all duration-300"
                        data-aos="fade-right"
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex gap-6 xl:gap-10" data-aos="fade-down">
                    {menu.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            aria-current={isActiveRoute(item.href) ? "page" : undefined}
                            className={getNavLinkClass(item.href)}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Icons + Mobile Menu */}
                <div className="flex items-center gap-1 sm:gap-2" data-aos="fade-left">
                    {isLoaded && !isSignedIn ? (
                        <SignInButton mode="modal">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={iconBtnClass}
                            >
                                <User size={22} strokeWidth={1.5} className="size-5" />
                            </Button>
                        </SignInButton>
                    ) : null}

                    {isLoaded && isSignedIn ? (
                        <div className="scale-90">
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "w-9 h-9",
                                    },
                                }}
                            >
                                <UserButton.MenuItems>
                                    <UserButton.Action
                                        label="My Orders"
                                        labelIcon={<Package size={16} />}
                                        onClick={() => router.push('/orders')}
                                    />
                                </UserButton.MenuItems>
                            </UserButton>
                        </div>
                    ) : null}


                    <Link href="/cart">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`${iconBtnClass} relative`}
                        >
                            <ShoppingCart size={22} strokeWidth={1.5} className="size-5" />
                            {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 
                                bg-[#1c0d02] text-white text-[10px] 
                                font-bold rounded-full w-4 h-4 
                                flex items-center justify-center">
                                {cartCount}
                            </span>
                            )}
                        </Button>
                    </Link>

                    <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`lg:hidden ${iconBtnClass}`}
                                aria-label="Open menu"
                            >
                                <Menu size={24} strokeWidth={1.5} />
                            </Button>
                        </SheetTrigger>

                        <SheetContent
                            side="right"
                            className="flex h-full w-[min(100%,300px)] flex-col gap-0 border-l border-gray-200 bg-white p-0 font-sans sm:max-w-[320px]"
                        >
                            <SheetHeader className="border-b border-gray-100 px-6 py-5 text-left">
                                <SheetTitle className="sr-only">
                                    Navigation Menu
                                </SheetTitle>

                                <SheetClose asChild>
                                    <Link href="/" className="inline-block">
                                        <Image
                                            src="/logo_black.png"
                                            alt="HKAY"
                                            width={70}
                                            height={50}
                                            className="h-9 w-auto object-contain"
                                        />
                                    </Link>
                                </SheetClose>

                                <p className="mt-2 text-sm text-gray-500">
                                    Browse our collection
                                </p>
                            </SheetHeader>

                            <nav className="flex flex-1 flex-col px-4 py-3">
                                {menu.map((item) => (
                                    <SheetClose asChild key={item.label}>
                                    <Link
                                        href={item.href}
                                        aria-current={isActiveRoute(item.href) ? "page" : undefined}
                                        className={`flex items-center justify-between rounded-lg px-3 py-4 text-base font-medium transition-colors hover:bg-gray-50 hover:text-gray-600 ${
                                            isActiveRoute(item.href)
                                                ? "bg-gray-50 text-[#3b1f0f]"
                                                : "text-gray-900"
                                        }`}
                                        >
                                            {item.label}
                                            <ChevronRight
                                                size={18}
                                                className={
                                                    isActiveRoute(item.href)
                                                        ? "text-[#3b1f0f]"
                                                        : "text-gray-400"
                                                }
                                            />
                                        </Link>
                                    </SheetClose>
                                ))}
                                {isSignedIn && (
                                    <SheetClose asChild>
                                        <Link
                                            href="/orders"
                                            className="flex items-center justify-between rounded-lg px-3 py-4 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50 hover:text-gray-600"
                                        >
                                            My Orders
                                            <ChevronRight
                                                size={18}
                                                className="text-gray-400"
                                            />
                                        </Link>
                                    </SheetClose>
                                )}
                            </nav>

                            <div className="border-t border-gray-100 px-6 py-5">
                                <SheetClose asChild>
                                    <Link href="/shop">
                                        <Button className="w-full rounded-xl bg-black py-5 text-white hover:bg-gray-900">
                                            Shop Now
                                        </Button>
                                    </Link>
                                </SheetClose>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
        </>
    )
}
