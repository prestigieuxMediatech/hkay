// src/app/(site)/shop/[slug]/page.js
"use client"
import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase-client"
import { notFound } from "next/navigation"
import { use } from "react"
import AddToCartButton from "../../components/AddToCartButton"

export default function ProductPage({ params }) {

  const { slug } = use(params)

  const [product, setProduct] = useState(null)
  const [mainImage, setMainImage] = useState(null)
  const [variants, setVariants] = useState([])
  const [selectedVariantId, setSelectedVariantId] = useState(null)
  const [variantError, setVariantError] = useState("")

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,slug,description,price,original_price,images,is_best_seller,is_new_arrival,has_variants")
        .eq("slug", slug)
        .single()

      if (error || !data) return notFound()

      setProduct(data)
      setMainImage(data.images?.[0] || null)

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
    }

    fetchProduct()
  }, [slug])

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariantId) || null,
    [variants, selectedVariantId]
  )

  const straightSizes = variants.filter((v) => v.variant_type === "straight")
  const taperedSizes = variants.filter((v) => v.variant_type === "tapered")

  const displayPrice = selectedVariant?.price ?? product?.price
  const requiresVariant = product?.has_variants && variants.length > 0

  function handleAddToCartClick(event) {
    if (requiresVariant && !selectedVariantId) {
      event.preventDefault()
      setVariantError("Please select a size")
      return false
    }
    setVariantError("")
  }

  if (!product) return (
    <div className="flex h-screen items-center justify-center text-gray-400">
      Loading...
    </div>
  )

  return (
    <>
      <div className="bg-stone-900 h-[260px] flex items-end px-6 pb-8 md:px-10 lg:px-20">
        <div className="mt-16">
          <p className="text-stone-400 text-sm mb-2">Shop / {product.name}</p>
          <h1 className="text-3xl font-bold text-white md:text-4xl">{product.name}</h1>
        </div>
      </div>

      {/* Product Content */}
      <section className="px-6 py-12 md:px-10 md:py-16 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left — Images */}
          <div className="flex flex-col gap-4">

            {/* Main Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-stone-100">
              {mainImage ? (
                <Image src={mainImage} alt={product.name} fill className="object-cover transition-all duration-300" />
              ) : (
                <div className="flex h-full items-center justify-center text-stone-400">No Image</div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-all duration-200 cursor-pointer
                      ${mainImage === img ? "border-black" : "border-transparent hover:border-stone-300"}`}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Details */}
          <div className="flex flex-col gap-6 lg:py-4">

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
            <div className="flex items-center gap-4">
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

            <AddToCartButton
              product={product}
              variant={selectedVariant}
              onClick={handleAddToCartClick}
              className="w-full py-6 text-base rounded-xl bg-black text-white hover:bg-gray-800 cursor-pointer mt-2"
            />

          </div>
        </div>
      </section>
    </>
  )
}