"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase-client"
import AddToCartButton from "../AddToCartButton"

export default function RelatedProducts({ categoryId, excludeProductId }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const trackRef = useRef(null)

  useEffect(() => {
    if (!categoryId) {
      setLoading(false)
      return
    }

    let isCancelled = false

    async function fetchRelated() {
      setLoading(true)

      const { data, error } = await supabase
        .from("products")
        .select("id,name,slug,price,images,category_id")
        .eq("category_id", categoryId)
        .eq("status", "active")
        .neq("id", excludeProductId)
        .order("created_at", { ascending: false })
        .limit(12)

      if (!isCancelled) {
        if (!error) setProducts(data || [])
        setLoading(false)
      }
    }

    fetchRelated()

    return () => {
      isCancelled = true
    }
  }, [categoryId, excludeProductId])

  const updateScrollState = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setCanScrollPrev(el.scrollLeft > 4)
    setCanScrollNext(el.scrollLeft < maxScroll - 4)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el || loading) return

    updateScrollState()
    el.addEventListener("scroll", updateScrollState, { passive: true })
    window.addEventListener("resize", updateScrollState)

    return () => {
      el.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
    }
  }, [loading, products, updateScrollState])

  function scrollByPage(direction) {
    const el = trackRef.current
    if (!el) return
    const amount = el.clientWidth * 0.92 * direction
    el.scrollBy({ left: amount, behavior: "smooth" })
  }

  if (!loading && products.length === 0) return null

  return (
    <section className="px-6 py-10 md:px-10 md:py-14 lg:px-20 border-t border-stone-200">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
          You May Also Like
        </h2>

        {/* Desktop/tablet nav arrows */}
        {!loading && products.length > 0 && (
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByPage(-1)}
              disabled={!canScrollPrev}
              aria-label="Previous products"
              className="flex h-9 w-9 items-center justify-center rounded-full border
                border-stone-200 bg-white text-stone-800 shadow-sm transition-all
                hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed
                disabled:hover:bg-white cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByPage(1)}
              disabled={!canScrollNext}
              aria-label="Next products"
              className="flex h-9 w-9 items-center justify-center rounded-full border
                border-stone-200 bg-white text-stone-800 shadow-sm transition-all
                hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed
                disabled:hover:bg-white cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        {loading ? (
          <div className="flex gap-3 sm:gap-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 w-[75%] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)]
                  lg:w-[calc(25%-18px)] rounded-xl sm:rounded-2xl border bg-white
                  overflow-hidden animate-pulse"
              >
                <div className="aspect-4/5 w-full bg-stone-100" />
                <div className="p-3 sm:p-5 space-y-2">
                  <div className="h-4 bg-stone-100 rounded w-3/4" />
                  <div className="h-5 bg-stone-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Right-edge fade hint on mobile when more content is scrollable */}
            <div
              className={`sm:hidden pointer-events-none absolute right-0 top-0 bottom-0 w-10
                bg-gradient-to-l from-white to-transparent z-10 transition-opacity duration-300
                ${canScrollNext ? "opacity-100" : "opacity-0"}`}
            />

            <div
              ref={trackRef}
              className="flex gap-3 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory
                pb-2 [scrollbar-none] [-ms-overflow-style:none]
                [&::-webkit-scrollbar]:hidden"
            >
              {products.map((item) => (
                <Card
                  key={item.id}
                  className="group shrink-0 snap-start w-[75%] sm:w-[calc(50%-12px)]
                    md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)]
                    overflow-hidden rounded-xl sm:rounded-2xl border 
                    bg-white p-0 py-0 gap-0 shadow-sm transition-all 
                    duration-300 hover:-translate-y-1 hover:shadow-lg 
                    flex flex-col"
                >
                  <CardContent className="p-0 flex flex-col flex-1">

                    <Link href={`/shop/${item.slug}`}>
                      <div className="relative aspect-4/5 w-full 
                        overflow-hidden bg-stone-100">
                        {item.images?.[0] ? (
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            fill
                            sizes="(max-width: 640px) 75vw, 
                              (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transition-transform 
                              duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center 
                            justify-center bg-stone-200">
                            <span className="text-xs sm:text-sm font-medium 
                              text-stone-500">No image</span>
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <Link href={`/shop/${item.slug}`}>
                          <h3 className="text-sm sm:text-xl font-semibold 
                            text-gray-900 hover:underline line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="mt-1 sm:mt-2 text-base sm:text-2xl font-bold text-black">
                          {"\u20B9"}{item.price.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div className="mt-3 sm:mt-5">
                        <AddToCartButton product={item} />
                      </div>
                    </div>

                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}