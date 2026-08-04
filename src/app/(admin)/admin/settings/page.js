"use client"

import { useEffect, useState } from "react"
import { ImagePlus, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DEFAULT_HERO_SLIDES } from "@/lib/hero-slides"

export default function SettingsPage() {
  const [slides, setSlides] = useState([])
  const [files, setFiles] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetch("/api/admin/hero-slides", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Unable to load hero slides")
        setSlides(data.slides || DEFAULT_HERO_SLIDES)
      })
      .catch((err) => setError(err.message || "Unable to load hero slides"))
      .finally(() => setLoading(false))
  }, [])

  function updateSlide(index, field, value) {
    setSlides((current) =>
      current.map((slide, slideIndex) =>
        slideIndex === index ? { ...slide, [field]: value } : slide
      )
    )
    setSuccess("")
  }

  function selectImage(index, file) {
    if (!file) return
    setFiles((current) => ({ ...current, [index]: file }))
    setSuccess("")
  }

  async function saveSlides(event) {
    event.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const formData = new FormData()
      formData.append("slides", JSON.stringify(slides))
      Object.entries(files).forEach(([index, file]) => formData.append(`image-${index}`, file))

      const response = await fetch("/api/admin/hero-slides", {
        method: "PUT",
        body: formData,
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to save hero slides")

      setSlides(data.slides || slides)
      setFiles({})
      setSuccess("Hero slides saved. The homepage will use the new content immediately.")
    } catch (err) {
      setError(err.message || "Unable to save hero slides")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm md:p-8">
        <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">Storefront content</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900">Homepage hero</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
          Update the background image, heading, and supporting text for each homepage slide. The hero design and buttons stay the same.
        </p>
      </section>

      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {success && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

      {loading ? (
        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 text-sm text-stone-500 shadow-sm">Loading hero slides...</div>
      ) : (
        <form onSubmit={saveSlides} className="space-y-5">
          {slides.map((slide, index) => (
            <section key={slide.id || index} className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm">
              <div className="grid lg:grid-cols-[18rem_1fr]">
                <div className="min-h-56 bg-stone-900 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image_url})` }}>
                  <div className="flex h-full min-h-56 items-end bg-black/30 p-5">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-stone-900 transition hover:bg-stone-100">
                      <ImagePlus size={16} />
                      Change image
                      <input type="file" accept="image/*" className="sr-only" onChange={(event) => selectImage(index, event.target.files?.[0])} />
                    </label>
                  </div>
                </div>

                <div className="space-y-5 p-5 md:p-6">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-400">Slide {index + 1}</p>
                    <label className="mt-3 block text-sm font-medium text-stone-700">Heading</label>
                    <input value={slide.title || ""} maxLength={120} onChange={(event) => updateSlide(index, "title", event.target.value)} className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none transition focus:border-stone-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Supporting text</label>
                    <textarea value={slide.description || ""} maxLength={500} rows={4} onChange={(event) => updateSlide(index, "description", event.target.value)} className="mt-2 w-full resize-y rounded-xl border border-stone-200 px-3 py-2.5 text-sm leading-6 outline-none transition focus:border-stone-500" />
                    {files[index] && <p className="mt-2 text-xs text-stone-500">New image ready: {files[index].name}</p>}
                  </div>
                </div>
              </div>
            </section>
          ))}

          <div className="flex justify-end">
            <Button type="submit" disabled={saving || !slides.length} className="bg-[#1c0d02] text-white hover:bg-[#2a1506]">
              <Save className="mr-2 size-4" />
              {saving ? "Saving..." : "Save hero changes"}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
