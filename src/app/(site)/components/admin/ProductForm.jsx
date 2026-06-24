"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  buildImageAccept,
  validateImageFileType,
} from "@/lib/image-standards";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  originalPrice: "",
  categoryId: "",
  isFeatured: false,
  isNewArrival: false,
  isBestSeller: false,
  status: "draft",
};

function buildFormState(product) {
  if (!product) {
    return emptyForm;
  }

  return {
    name: product.name || "",
    slug: product.slug || "",
    description: product.description || "",
    price: product.price?.toString() || "",
    originalPrice: product.original_price?.toString() || "",
    categoryId: product.category_id || "",
    isFeatured: Boolean(product.is_featured),
    isNewArrival: Boolean(product.is_new_arrival),
    isBestSeller: Boolean(product.is_best_seller),
    status: product.status || "draft",
  };
}

function isFileLike(value) {
  return value && typeof value === "object" && typeof value.arrayBuffer === "function";
}

export default function ProductForm({
  product = null,
  title = "Product",
  backHref = "/admin/products",
  backLabel = "Products",
  submitLabel = "Save Product",
  actionUrl = "/api/admin/products",
  method = "POST",
}) {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(() => buildFormState(product));
  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageError, setImageError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentImages = Array.isArray(product?.images) ? product.images : [];

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/admin/categories", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load categories");
        }

        setCategories(data.categories || []);
      } catch (err) {
        setCategoryError(err.message || "Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleImageChange(event) {
    const files = Array.from(event.target.files || []).filter(isFileLike);
    setImageError("");

    if (!files.length) {
      return;
    }

    for (const file of files) {
      const typeError = validateImageFileType(file, "Product images");
      if (typeError) {
        clearImages();
        setImageError(typeError);
        return;
      }
    }

    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));

    setImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  }

  function clearImages() {
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setImageFiles([]);
    setImagePreviews([]);
    setImageError("");

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
      formData.append("name", form.name.trim());
      formData.append("slug", form.slug.trim());
      formData.append("description", form.description.trim());
      formData.append("price", form.price);
      formData.append("originalPrice", form.originalPrice);
      formData.append("categoryId", form.categoryId);
      formData.append("isFeatured", String(form.isFeatured));
      formData.append("isNewArrival", String(form.isNewArrival));
      formData.append("isBestSeller", String(form.isBestSeller));
      formData.append("status", form.status);

      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch(actionUrl, {
        method,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save product");
      }

      router.push(backHref);
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
        href={backHref}
        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground"
      >
        <ArrowLeft size={16} />
        {backLabel}
      </Link>

      <h1 className="mb-6 text-2xl font-semibold">{title}</h1>

      <Card className="mx-auto max-w-3xl">
        <CardContent className="p-6">
          {error ? (
            <div className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          ) : null}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
                Basic details
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">
                    Product Name
                  </label>
                  <Input
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="e.g. Slim Wallet"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">
                    Slug
                  </label>
                  <Input
                    value={form.slug}
                    onChange={(event) => updateField("slug", event.target.value)}
                    placeholder="e.g. slim-wallet"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Description
                </label>
                <Textarea
                  rows={5}
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Write a clear description of the product..."
                />
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
                Pricing and category
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">
                    Price
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(event) => updateField("price", event.target.value)}
                    placeholder="e.g. 1100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">
                    Original Price
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.originalPrice}
                    onChange={(event) =>
                      updateField("originalPrice", event.target.value)
                    }
                    placeholder="e.g. 1500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-stone-700">
                    Category
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(event) =>
                      updateField("categoryId", event.target.value)
                    }
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-stone-400"
                  >
                    <option value="">No category</option>
                    {loadingCategories ? (
                      <option value="" disabled>
                        Loading categories...
                      </option>
                    ) : null}
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {categoryError ? (
                    <p className="mt-2 text-xs text-rose-600">{categoryError}</p>
                  ) : null}
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
                Images
              </h2>

              <input
                ref={fileInputRef}
                type="file"
                accept={buildImageAccept()}
                multiple
                className="hidden"
                onChange={handleImageChange}
              />

              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                className="flex min-h-40 w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 px-6 py-8 text-left transition hover:bg-stone-100"
              >
                {imageFiles.length ? (
                  <div className="w-full space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-stone-800">
                          {imageFiles.length} image
                          {imageFiles.length > 1 ? "s" : ""} selected
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Any image type. These images will replace the current
                          ones when you save.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          clearImages();
                        }}
                        className="rounded-full border border-stone-200 bg-white p-2 text-stone-600 shadow-sm"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {imagePreviews.map((preview, index) => (
                        <div
                          key={preview}
                          className="aspect-square overflow-hidden rounded-xl border border-stone-200 bg-white"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preview}
                            alt={`Product preview ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : currentImages.length ? (
                  <div className="w-full space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-stone-800">
                          Current product images
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Any image type. Click here to replace them with new
                          files.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {currentImages.map((image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className="aspect-square overflow-hidden rounded-xl border border-stone-200 bg-white"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image}
                            alt={`Current product ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-stone-500">
                    <ImagePlus size={28} />
                    <p className="text-sm font-medium">Upload product images</p>
                    <p className="text-xs">Any image type</p>
                  </div>
                )}
              </div>
              {imageError ? (
                <p className="mt-2 text-xs text-rose-600">{imageError}</p>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">
                  Any image type
                </p>
              )}
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
                Product flags
              </h2>

              <div className="grid gap-3 md:grid-cols-3">
                <label className="flex items-center gap-3 rounded-xl border border-stone-200 p-4">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(event) =>
                      updateField("isFeatured", event.target.checked)
                    }
                    className="h-4 w-4 rounded border-stone-300"
                  />
                  <span className="text-sm font-medium text-stone-700">
                    Featured
                  </span>
                </label>

                <label className="flex items-center gap-3 rounded-xl border border-stone-200 p-4">
                  <input
                    type="checkbox"
                    checked={form.isNewArrival}
                    onChange={(event) =>
                      updateField("isNewArrival", event.target.checked)
                    }
                    className="h-4 w-4 rounded border-stone-300"
                  />
                  <span className="text-sm font-medium text-stone-700">
                    New arrival
                  </span>
                </label>

                <label className="flex items-center gap-3 rounded-xl border border-stone-200 p-4">
                  <input
                    type="checkbox"
                    checked={form.isBestSeller}
                    onChange={(event) =>
                      updateField("isBestSeller", event.target.checked)
                    }
                    className="h-4 w-4 rounded border-stone-300"
                  />
                  <span className="text-sm font-medium text-stone-700">
                    Best seller
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">
                Status
              </label>
              <select
                value={form.status}
                onChange={(event) => updateField("status", event.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-stone-400"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
              <p className="mt-2 text-xs text-muted-foreground">
                Draft products stay hidden until you switch them to active.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1c0d02] text-white hover:bg-[#2a1506]"
              disabled={loading}
            >
              <Plus className="mr-2 size-4" />
              {loading ? "Saving..." : submitLabel}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
