"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AddCategoryPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("active");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("status", status);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch("/api/admin/categories", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create category");
      }

      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Link
        href="/admin/categories"
        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground"
      >
        <ArrowLeft size={16} />
        Categories
      </Link>

      <h1 className="mb-6 text-2xl font-semibold">Add Category</h1>

      <Card className="mx-auto max-w-2xl">
        <CardContent className="p-6">
          {error ? (
            <div className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">
                Category Image
              </label>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 transition hover:bg-stone-100"
              >
                {imagePreview ? (
                  <div className="relative aspect-[6/7] w-full max-w-sm">
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearImage();
                      }}
                      className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-stone-700 shadow"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex aspect-[6/7] w-full max-w-sm flex-col items-center justify-center gap-2 text-stone-500">
                    <ImagePlus size={28} />
                    <p className="text-sm">Click to upload category image</p>
                    <p className="text-xs">Any image type</p>
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Any image type
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">
                Category Name
              </label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Bags"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">
                Slug
              </label>
              <Input
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="e.g. bags"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">
                Status
              </label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-stone-400"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1c0d02] text-white hover:bg-[#2a1506]"
              disabled={loading}
            >
              <Plus className="mr-2 size-4" />
              {loading ? "Saving..." : "Save Category"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
