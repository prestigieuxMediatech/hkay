import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

import { DEFAULT_HERO_SLIDES } from "@/lib/hero-slides"
import { validateImageFileSize, validateImageFileType } from "@/lib/image-standards"
import { isFileLike } from "@/lib/product-images"
import { requireAdmin } from "@/lib/require-admin"
import { supabase } from "@/lib/supabase"

const HERO_IMAGE_BUCKET = "hero-images"
const MAX_HERO_IMAGE_BYTES = 10 * 1024 * 1024

function cleanText(value, maxLength) {
  return (value || "").toString().trim().slice(0, maxLength)
}

export async function GET(request) {
  const auth = await requireAdmin(request)
  if (auth.response) return auth.response

  const { data, error } = await supabase
    .from("hero_slides")
    .select("id, image_url, title, description, sort_order, is_active")
    .order("sort_order", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ slides: data?.length ? data : DEFAULT_HERO_SLIDES })
}

export async function PUT(request) {
  const auth = await requireAdmin(request)
  if (auth.response) return auth.response

  try {
    const formData = await request.formData()
    const rawSlides = JSON.parse(formData.get("slides") || "[]")

    if (!Array.isArray(rawSlides) || rawSlides.length === 0 || rawSlides.length > 6) {
      return NextResponse.json({ error: "Provide between 1 and 6 hero slides." }, { status: 400 })
    }

    const savedSlides = []
    for (let index = 0; index < rawSlides.length; index += 1) {
      const slide = rawSlides[index]
      const title = cleanText(slide.title, 120)
      const description = cleanText(slide.description, 500)
      let imageUrl = cleanText(slide.image_url, 2000)
      const image = formData.get(`image-${index}`)

      if (!title || !description) {
        return NextResponse.json({ error: `Slide ${index + 1} needs a title and description.` }, { status: 400 })
      }

      if (isFileLike(image) && image.size > 0) {
        const typeError = validateImageFileType(image, `Slide ${index + 1} image`)
        const sizeError = validateImageFileSize(image, MAX_HERO_IMAGE_BYTES, `Slide ${index + 1} image`)
        if (typeError || sizeError) {
          return NextResponse.json({ error: typeError || sizeError }, { status: 400 })
        }

        const ext = image.name?.split(".").pop() || "jpg"
        const path = `slides/hero-${Date.now()}-${index}.${ext}`
        const buffer = Buffer.from(await image.arrayBuffer())
        const { error: uploadError } = await supabase.storage
          .from(HERO_IMAGE_BUCKET)
          .upload(path, buffer, { contentType: image.type || "image/jpeg", upsert: false })

        if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })
        imageUrl = supabase.storage.from(HERO_IMAGE_BUCKET).getPublicUrl(path).data.publicUrl
      }

      if (!imageUrl) {
        return NextResponse.json({ error: `Slide ${index + 1} needs a background image.` }, { status: 400 })
      }

      savedSlides.push({
        id: slide.id || crypto.randomUUID(),
        image_url: imageUrl,
        title,
        description,
        sort_order: index,
        is_active: slide.is_active !== false,
      })
    }

    const { data, error } = await supabase
      .from("hero_slides")
      .upsert(savedSlides)
      .select("id, image_url, title, description, sort_order, is_active")

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    revalidatePath("/")
    return NextResponse.json({ slides: data }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to save hero slides." }, { status: 500 })
  }
}
