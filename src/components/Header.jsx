"use client"
import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Heart, ShoppingCart, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
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

    return (
        <div className={`fixed top-0 left-0 w-full flex items-center justify-between px-10 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md py-4" : "bg-transparent py-7"}`}>
            
            {/* Logo */}
            {/* Logo */}
        <Link href="/">
            <Image
                src={scrolled ? "/logo_black.png" : "/logo_white.png"}
                alt="Logo"
                width={70}
                height={50}
                className="cursor-pointer object-contain transition-all duration-300"
                data-aos="fade-right"
            />
        </Link>

            {/* Nav Menu */}
            <div className="flex gap-10" data-aos="fade-down">
                {menu.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`text-xl cursor-pointer transition-colors duration-300 ${scrolled ? "text-black hover:text-gray-500" : "text-white hover:text-gray-300"}`}
                    >
                        {item.label}
                    </Link>
                ))}
            </div>

            {/* Icons */}
            <div className="flex gap-3" data-aos="fade-left">
                {[User, Heart, ShoppingCart].map((Icon, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        size="icon"
                        className={`cursor-pointer transition-colors duration-300 ${scrolled ? "text-black hover:text-gray-500 hover:bg-gray-100" : "text-white hover:text-gray-300 hover:bg-white/10"}`}
                    >
                        <Icon size={26} strokeWidth={1.5} className="size-5" />
                    </Button>
                ))}
            </div>
        </div>
    )
}
