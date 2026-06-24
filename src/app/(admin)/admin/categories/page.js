"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCategories() {
    setLoading(true);
    setError("");

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
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      await loadCategories();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm">
        <p className="text-sm text-stone-500">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Admin content
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900">
              Categories
            </h1>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Manage category name, slug, image, and status.
            </p>
          </div>

          <Button
            asChild
            className="bg-[#1c0d02] text-white hover:bg-[#2a1506]"
          >
            <Link href="/admin/categories/new">
              <Plus className="mr-2 size-4" />
              Add Category
            </Link>
          </Button>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      ) : null}

      {!categories.length ? (
        <Card className="border-stone-200/80 bg-white shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-stone-500">No categories found.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="hidden border-stone-200/80 bg-white shadow-sm md:block">
            <CardHeader className="border-b border-stone-200/70 pb-4">
              <CardTitle>Current Categories</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-hidden">
                <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.9fr_0.8fr] border-b border-stone-100 bg-stone-50 px-6 py-3 text-sm font-medium text-stone-600">
                  <div>Category</div>
                  <div>Slug</div>
                  <div>Status</div>
                  <div>Created</div>
                  <div>Actions</div>
                </div>

                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="grid grid-cols-[1.2fr_1fr_0.8fr_0.9fr_0.8fr] items-center border-b border-stone-100 px-6 py-4 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-xl bg-stone-100">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-stone-500">
                            IMG
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="font-medium text-stone-900">
                          {category.name}
                        </p>
                        <p className="text-sm text-stone-500">ID #{category.id}</p>
                      </div>
                    </div>

                    <p className="text-sm text-stone-600">{category.slug}</p>

                    <div>
                      {category.status === "active" ? (
                        <Badge className="bg-emerald-100 text-emerald-700">
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-stone-100 text-stone-600">
                          Draft
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-stone-600">
                      {new Date(category.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/categories/${category.id}`}>
                          <Pencil className="mr-2 size-4" />
                          Edit
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-500"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3 md:hidden">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="border-stone-200/80 bg-white shadow-sm"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-xl bg-stone-100">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-stone-500">
                          IMG
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-stone-900">
                        {category.name}
                      </p>
                      <p className="text-sm text-stone-500">{category.slug}</p>
                      <p className="mt-1 text-xs text-stone-400">
                        {new Date(category.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    {category.status === "active" ? (
                      <Badge className="bg-emerald-100 text-emerald-700">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-stone-100 text-stone-600">
                        Draft
                      </Badge>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link href={`/admin/categories/${category.id}`}>
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-red-200 text-red-500"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
