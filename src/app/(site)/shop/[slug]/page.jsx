// src/app/(site)/shop/[slug]/page.js
"use client"
import { useState, useEffect, useMemo, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase-client"
import { notFound } from "next/navigation"
import { use } from "react"
import AddToCartButton from "../../components/AddToCartButton"

export default function ProductPage({ params }) {

  const { slug } = use(params)

  const [product, setProduct] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [variants, setVariants] = useState([])
  const [selectedVariantId, setSelectedVariantId] = useState(null)
  const [variantError, setVariantError] = useState("")

  // Variant OPTIONS (Foil Color, Buckle Type, etc.) — separate from size variants
  const [optionGroups, setOptionGroups] = useState([]) // [{ group_name, values: [{id,value,price}] }]
  const [selectedOptions, setSelectedOptions] = useState({}) // { "Foil Color": {id, value, price} }

  const touchStartX = useRef(null)
  const touchDeltaX = useRef(0)

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,slug,description,price,original_price,images,is_best_seller,is_new_arrival,has_variants")
        .eq("slug", slug)
        .single()

      if (error || !data) return notFound()

      setProduct(data)
      setCurrentIndex(0)

      if (data.has_variants) {
        const { data: variantData, error: variantErr } = await supabase
          .from("product_variants")
          .select("id,variant_label,variant_type,price")
          .eq("product_id", data.id)
          .eq("is_active", true)
          .order("sort_order", { ascending: true })

        if (!variantErr) {
          setVariants(variantData || [])
        }
      }

      // Fetch variant OPTIONS (Foil Color, Buckle Type, etc.) — independent of has_variants
      const { data: optionRows, error: optionErr } = await supabase
        .from("product_variant_options")
        .select("id,group_name,value,price")
        .eq("product_id", data.id)
        .eq("is_active", true)
        .order("group_name", { ascending: true })
        .order("sort_order", { ascending: true })

      if (!optionErr && optionRows?.length) {
        const grouped = []
        const map = new Map()
        for (const row of optionRows) {
          if (!map.has(row.group_name)) {
            const group = { group_name: row.group_name, values: [] }
            map.set(row.group_name, group)
            grouped.push(group)
          }
          map.get(row.group_name).values.push(row)
        }
        setOptionGroups(grouped)
      }
    }

    fetchProduct()
  }, [slug])

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariantId) || null,
    [variants, selectedVariantId]
  )

  const straightSizes = variants.filter((v) => v.variant_type === "straight")
  const taperedSizes = variants.filter((v) => v.variant_type === "tapered")

  const optionsAdjustment = Object.values(selectedOptions).reduce(
    (sum, opt) => sum + (opt.price || 0),
    0
  )
  const displayPrice = (selectedVariant?.price ?? product?.price ?? 0) + optionsAdjustment
  const requiresVariant = product?.has_variants && variants.length > 0

  const images = product?.images || []
  const mainImage = images[currentIndex] || null

  function goToNext() {
    if (images.length < 2) return
    setCurrentIndex((i) => (i + 1) % images.length)
  }

  function goToPrev() {
    if (images.length < 2) return
    setCurrentIndex((i) => (i - 1 + images.length) % images.length)
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
    touchDeltaX.current = 0
  }

  function handleTouchMove(e) {
    if (touchStartX.current === null) return
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current
  }

  function handleTouchEnd() {
    const SWIPE_THRESHOLD = 40
    if (touchDeltaX.current > SWIPE_THRESHOLD) {
      goToPrev()
    } else if (touchDeltaX.current < -SWIPE_THRESHOLD) {
      goToNext()
    }
    touchStartX.current = null
    touchDeltaX.current = 0
  }

  function handleAddToCartClick() {
    if (requiresVariant && !selectedVariantId) {
      setVariantError("Please select a size")
      return false
    }
    setVariantError("")
  }

  function selectOption(groupName, opt) {
    setSelectedOptions((prev) => ({ ...prev, [groupName]: opt }))
  }

  if (!product) return (
    <div className="flex h-screen items-center justify-center text-gray-400">
      Loading...
    </div>
  )

  return (
    <>
      <div className="bg-stone-900 h-55 md:h-65 flex items-end px-6 pb-8 md:px-10 lg:px-20">
        <div className="mt-16">
          <p className="text-stone-400 text-sm mb-2">Shop / {product.name}</p>
          <h1 className="text-2xl font-bold text-white md:text-4xl leading-tight">{product.name}</h1>
        </div>
      </div>

      {/* Product Content */}
      <section className="px-6 py-10 pb-28 md:px-10 md:py-16 md:pb-16 lg:px-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-14 lg:items-start">

          {/* Left — Images */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">

            {/* Main Image */}
            <div
              className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-stone-100 shadow-sm select-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {mainImage ? (
                <Image
                  key={mainImage}
                  src={mainImage}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover animate-[fadeIn_0.25s_ease-out]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-stone-400">No Image</div>
              )}

              {images.length > 1 && (
                <>
                  {/* Desktop hover arrows */}
                  <button
                    type="button"
                    onClick={goToPrev}
                    aria-label="Previous image"
                    className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center
                      justify-center rounded-full bg-white/90 text-stone-800 opacity-0 shadow-md
                      transition-opacity duration-200 group-hover:opacity-100 hover:bg-white cursor-pointer"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    aria-label="Next image"
                    className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center
                      justify-center rounded-full bg-white/90 text-stone-800 opacity-0 shadow-md
                      transition-opacity duration-200 group-hover:opacity-100 hover:bg-white cursor-pointer"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Image counter */}
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1
                    text-xs font-medium text-white">
                    {currentIndex + 1} / {images.length}
                  </span>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 cursor-pointer
                      ${currentIndex === i ? "border-black" : "border-transparent hover:border-stone-300"}`}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Details */}
          <div
            className="flex flex-col lg:sticky lg:top-24 lg:self-start
              lg:max-h-[calc(100vh-7rem)]"
          >

            {/* Scrollable content */}
            <div
              className="flex flex-col gap-6 lg:py-2 lg:overflow-y-auto lg:pr-2 lg:min-h-0
                [scrollbar-width:thin] [scrollbar-color:theme(colors.stone.300)_transparent]
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-thumb]:bg-stone-300
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-track]:bg-transparent"
            >

              {/* Badges */}
              {(product.is_best_seller || product.is_new_arrival) && (
                <div className="flex gap-2">
                  {product.is_best_seller && (
                    <span className="rounded-full bg-black text-white text-xs px-4 py-1.5">Best Seller</span>
                  )}
                  {product.is_new_arrival && (
                    <span className="rounded-full border border-black text-xs px-4 py-1.5">New Arrival</span>
                  )}
                </div>
              )}

              {/* Name */}
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl leading-snug">
                {product.name}
              </h2>

              <hr className="border-stone-200" />

              {/* Price */}
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-3xl font-bold text-black">
                  ₹{displayPrice.toLocaleString("en-IN")}
                </p>
                {product.original_price && (
                  <p className="text-lg text-stone-400 line-through">
                    ₹{product.original_price.toLocaleString("en-IN")}
                  </p>
                )}
                {product.original_price && (
                  <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                    {Math.round((1 - displayPrice / product.original_price) * 100)}% off
                  </span>
                )}
              </div>

              <hr className="border-stone-200" />

              {/* Size Variants */}
              {requiresVariant && (
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Select Size
                  </p>

                  {straightSizes.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-stone-400 mb-2">Straight</p>
                      <div className="flex flex-wrap gap-2">
                        {straightSizes.map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => {
                              setSelectedVariantId(v.id)
                              setVariantError("")
                            }}
                            className={`rounded-lg border px-4 py-2 text-sm transition-all
                              ${selectedVariantId === v.id
                                ? "border-black bg-black text-white"
                                : "border-stone-200 text-stone-700 hover:border-stone-400"}`}
                          >
                            {v.variant_label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {taperedSizes.length > 0 && (
                    <div>
                      <p className="text-xs text-stone-400 mb-2">Tapered</p>
                      <div className="flex flex-wrap gap-2">
                        {taperedSizes.map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => {
                              setSelectedVariantId(v.id)
                              setVariantError("")
                            }}
                            className={`rounded-lg border px-4 py-2 text-sm transition-all
                              ${selectedVariantId === v.id
                                ? "border-black bg-black text-white"
                                : "border-stone-200 text-stone-700 hover:border-stone-400"}`}
                          >
                            {v.variant_label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {variantError && (
                    <p className="mt-2 text-xs text-rose-600">{variantError}</p>
                  )}
                </div>
              )}

              {requiresVariant && <hr className="border-stone-200" />}

              {/* Variant Options — Foil Color, Buckle Type, etc. (optional, no validation) */}
              {optionGroups.length > 0 && (
                <>
                  {optionGroups.map((group) => (
                    <div key={group.group_name}>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        {group.group_name}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {group.values.map((opt) => {
                          const isSelected = selectedOptions[group.group_name]?.id === opt.id
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => selectOption(group.group_name, opt)}
                              className={`rounded-lg border px-4 py-2 text-sm transition-all
                                ${isSelected
                                  ? "border-black bg-black text-white"
                                  : "border-stone-200 text-stone-700 hover:border-stone-400"}`}
                            >
                              {opt.value}
                              {opt.price ? ` (+₹${opt.price})` : ""}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                  <hr className="border-stone-200" />
                </>
              )}

              {/* Description */}
              {product.description && (
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    About this product
                  </p>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

            </div>

            {/* Desktop / tablet add to cart — always pinned at bottom of right column, hidden on mobile (replaced by sticky bar) */}
            <div className="hidden md:block shrink-0 pt-4 lg:pr-2">
              <AddToCartButton
                product={product}
                variant={selectedVariant}
                selectedOptions={selectedOptions}
                onClick={handleAddToCartClick}
                className="w-full py-3.5 text-base rounded-xl bg-black text-white hover:bg-gray-800 cursor-pointer"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Sticky mobile add-to-cart bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200 bg-white/95
        backdrop-blur px-4 py-3 flex items-center gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-bold text-black">
            ₹{displayPrice.toLocaleString("en-IN")}
          </span>
          {variantError && (
            <span className="text-[11px] text-rose-600">{variantError}</span>
          )}
        </div>
        <AddToCartButton
          product={product}
          variant={selectedVariant}
          selectedOptions={selectedOptions}
          onClick={handleAddToCartClick}
          className="flex-1 py-5 text-sm rounded-xl bg-black text-white hover:bg-gray-800 cursor-pointer"
        />
      </div>
    </>
  )
}