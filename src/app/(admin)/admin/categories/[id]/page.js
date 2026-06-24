"use client";

import Link from "next/link";
import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function EditCategoryPage({ params }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const resolvedParams = use(params);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("active");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const categoryId = resolvedParams?.id;

  async function loadCategory() {
    if (!categoryId || categoryId === "undefined") {
      setError("Category id is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Category not found. It may have been deleted.");
        }

        throw new Error(data.error || "Failed to load category");
      }

      const category = data.category;

      setName(category.name || "");
      setSlug(category.slug || "");
      setStatus(category.status || "active");
      setImagePreview(category.image || "");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (categoryId) {
      loadCategory();
    }
  }, [categoryId]);

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
    setSaving(true);
    setError("");

    if (!categoryId || categoryId === "undefined") {
      setError("Category id is missing.");
      setSaving(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("status", status);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "PATCH",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update category");
      }

      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm">
        <p className="text-sm text-stone-500">Loading category...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm">
        <p className="text-sm text-rose-600">{error}</p>
        <Link
          href="/admin/categories"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-900"
        >
          <ArrowLeft size={16} />
          Back to categories
        </Link>
      </div>
    );
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

      <h1 className="mb-6 text-2xl font-semibold">Edit Category</h1>

      <Card className="mx-auto max-w-2xl">
        <CardContent className="p-6">
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
                    <div className="absolute right-3 top-3 flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearImage();
                        }}
                        className="rounded-full bg-white/90 p-2 text-stone-700 shadow"
                      >
                        <X size={16} />
                      </button>
                    </div>
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
              disabled={saving}
            >
              <Save className="mr-2 size-4" />
              {saving ? "Saving..." : "Update Category"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
