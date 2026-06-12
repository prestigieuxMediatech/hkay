"use client"
import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Heart, ShoppingCart, User, Menu, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
    SheetHeader,
    SheetTitle,
} from "./ui/sheet"

export default function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

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

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                isLight ? "bg-white shadow-md py-3 md:py-4" : "bg-transparent py-4 md:py-7"
            }`}
        >
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10">
                <Link href="/">
                    <Image
                        src={isLight ? "/logo_black.png" : "/logo_white.png"}
                        alt="Logo"
                        width={70}
                        height={50}
                        className="h-9 w-auto sm:h-11 cursor-pointer object-contain transition-all duration-300"
                        data-aos="fade-right"
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex gap-6 xl:gap-10" data-aos="fade-down">
                    {menu.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={navLinkClass}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Icons + Mobile Menu */}
                <div className="flex items-center gap-1 sm:gap-2" data-aos="fade-left">
                    {[User, Heart, ShoppingCart].map((Icon, index) => (
                        <Button
                            key={index}
                            variant="ghost"
                            size="icon"
                            className={iconBtnClass}
                        >
                            <Icon size={22} strokeWidth={1.5} className="size-5" />
                        </Button>
                    ))}

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
                                            className="flex items-center justify-between rounded-lg px-3 py-4 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50 hover:text-gray-600"
                                        >
                                            {item.label}
                                            <ChevronRight
                                                size={18}
                                                className="text-gray-400"
                                            />
                                        </Link>
                                    </SheetClose>
                                ))}
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
    )
}
