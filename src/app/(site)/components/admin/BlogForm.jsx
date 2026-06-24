"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  status: "draft",
};

function buildFormState(blogPost) {
  if (!blogPost) {
    return emptyForm;
  }

  return {
    title: blogPost.title || "",
    slug: blogPost.slug || "",
    excerpt: blogPost.excerpt || "",
    content: blogPost.content || "",
    category: blogPost.category || "",
    status: blogPost.status || "draft",
  };
}

function isFileLike(value) {
  return value && typeof value === "object" && typeof value.arrayBuffer === "function";
}

export default function BlogForm({
  blogPost = null,
  title = "Blog Post",
  backHref = "/admin/blog",
  backLabel = "Blog Posts",
  submitLabel = "Save Post",
  actionUrl = "/api/admin/blogs",
  method = "POST",
}) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef("");
  const previewIsObjectUrlRef = useRef(false);

  const [form, setForm] = useState(() => buildFormState(blogPost));
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(
    blogPost?.cover_image || ""
  );
  const [coverImageRemoved, setCoverImageRemoved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (previewIsObjectUrlRef.current && previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleImageChange(event) {
    const file = Array.from(event.target.files || []).find(isFileLike);
    if (!file) return;

    if (previewIsObjectUrlRef.current && previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const nextPreview = URL.createObjectURL(file);

    previewUrlRef.current = nextPreview;
    previewIsObjectUrlRef.current = true;
    setCoverImageFile(file);
    setCoverImagePreview(nextPreview);
    setCoverImageRemoved(false);
  }

  function clearImage() {
    if (previewIsObjectUrlRef.current && previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    previewUrlRef.current = "";
    previewIsObjectUrlRef.current = false;
    setCoverImageFile(null);
    setCoverImagePreview("");
    setCoverImageRemoved(true);

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
      formData.append("title", form.title.trim());
      formData.append("slug", form.slug.trim());
      formData.append("excerpt", form.excerpt.trim());
      formData.append("content", form.content.trim());
      formData.append("category", form.category.trim());
      formData.append("status", form.status);
      formData.append("removeCoverImage", String(coverImageRemoved));

      if (coverImageFile) {
        formData.append("coverImage", coverImageFile);
      }

      const response = await fetch(actionUrl, {
        method,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save blog post");
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
                Cover image
              </h2>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
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
                className="flex min-h-44 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 px-6 py-8 text-left transition hover:bg-stone-100"
              >
                {coverImagePreview ? (
                  <div className="w-full space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-stone-800">
                          Current cover image
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Click here to replace it with a new file
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          clearImage();
                        }}
                        className="rounded-full border border-stone-200 bg-white p-2 text-stone-600 shadow-sm"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverImagePreview}
                      alt="Blog cover preview"
                      className="h-56 w-full rounded-xl object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-stone-500">
                    <ImagePlus size={28} />
                    <p className="text-sm font-medium">Upload cover image</p>
                    <p className="text-xs">PNG, JPG, JPEG, WEBP</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
                Basic details
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">
                    Title
                  </label>
                  <Input
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    placeholder="e.g. How full-grain leather ages"
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
                    placeholder="e.g. how-full-grain-leather-ages"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Excerpt
                </label>
                <Textarea
                  rows={3}
                  value={form.excerpt}
                  onChange={(event) => updateField("excerpt", event.target.value)}
                  placeholder="Short summary for cards and previews..."
                />
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
                Content
              </h2>

              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Category
                </label>
                <Input
                  value={form.category}
                  onChange={(event) => updateField("category", event.target.value)}
                  placeholder="e.g. Care & Craft"
                />
              </div>

              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Body
                </label>
                <Textarea
                  rows={10}
                  value={form.content}
                  onChange={(event) => updateField("content", event.target.value)}
                  placeholder="Write the blog post content here..."
                />
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
                <option value="published">Published</option>
              </select>
              <p className="mt-2 text-xs text-muted-foreground">
                Published posts are marked live and get a published date.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1c0d02] text-white hover:bg-[#2a1506]"
              disabled={loading}
            >
              <Save className="mr-2 size-4" />
              {loading ? "Saving..." : submitLabel}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
