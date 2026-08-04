import { NextResponse } from "next/server"

import { DEFAULT_HERO_SLIDES } from "@/lib/hero-slides"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET() {
  const { data, error } = await supabase
    .from("hero_slides")
    .select("id, image_url, title, description, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  // The fallback keeps the existing homepage live until the SQL migration is applied.
  const slides = error || !data?.length ? DEFAULT_HERO_SLIDES : data

  return NextResponse.json(
    { slides },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  )
}
