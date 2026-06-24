"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function formatPrice(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return value ? String(value) : "—";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(number);
}

function formatDate(value) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusBadgeClass(status) {
  return status === "active"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-stone-100 text-stone-600";
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/products", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load products");
      }

      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete product");
      }

      await loadProducts();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm">
        <p className="text-sm text-stone-500">Loading products...</p>
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
              Products
            </h1>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Manage product name, slug, price, images, and status.
            </p>
          </div>

          <Button
            asChild
            className="bg-[#1c0d02] text-white hover:bg-[#2a1506]"
          >
            <Link href="/admin/products/new">
              <Plus className="mr-2 size-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      ) : null}

      {!products.length ? (
        <Card className="border-stone-200/80 bg-white shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-stone-500">No products found.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="hidden border-stone-200/80 bg-white shadow-sm md:block">
            <CardHeader className="border-b border-stone-200/70 pb-4">
              <CardTitle>Current Products</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-hidden">
                <div className="grid grid-cols-[0.9fr_1.2fr_1fr_0.8fr_0.8fr_1fr_0.9fr] border-b border-stone-100 bg-stone-50 px-6 py-3 text-sm font-medium text-stone-600">
                  <div>Image</div>
                  <div>Product</div>
                  <div>Category</div>
                  <div>Price</div>
                  <div>Status</div>
                  <div>Flags</div>
                  <div>Actions</div>
                </div>

                {products.map((product) => {
                  const image = Array.isArray(product.images)
                    ? product.images[0]
                    : "";

                  return (
                    <div
                      key={product.id}
                      className="grid grid-cols-[0.9fr_1.2fr_1fr_0.8fr_0.8fr_1fr_0.9fr] items-center border-b border-stone-100 px-6 py-4 last:border-b-0"
                    >
                      <div>
                        <div className="h-12 w-12 overflow-hidden rounded-xl bg-stone-100">
                          {image ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            </>
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-stone-500">
                              IMG
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="font-medium text-stone-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-stone-500">{product.slug}</p>
                      </div>

                      <p className="text-sm text-stone-600">
                        {product.category?.name || "No category"}
                      </p>

                      <div>
                        <p className="font-medium text-stone-900">
                          {formatPrice(product.price)}
                        </p>
                        {product.original_price ? (
                          <p className="text-xs text-stone-400 line-through">
                            {formatPrice(product.original_price)}
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <Badge className={getStatusBadgeClass(product.status)}>
                          {product.status === "active" ? "Active" : "Draft"}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {product.is_featured ? (
                          <Badge className="bg-amber-100 text-amber-700">
                            Featured
                          </Badge>
                        ) : null}
                        {product.is_new_arrival ? (
                          <Badge className="bg-sky-100 text-sky-700">
                            New
                          </Badge>
                        ) : null}
                        {product.is_best_seller ? (
                          <Badge className="bg-rose-100 text-rose-700">
                            Best
                          </Badge>
                        ) : null}
                        {!product.is_featured &&
                        !product.is_new_arrival &&
                        !product.is_best_seller ? (
                          <span className="text-sm text-stone-400">—</span>
                        ) : null}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/products/${product.id}`}>
                            <Pencil className="mr-2 size-4" />
                            Edit
                          </Link>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-500"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3 md:hidden">
            {products.map((product) => {
              const image = Array.isArray(product.images)
                ? product.images[0]
                : "";

              return (
                <Card
                  key={product.id}
                  className="border-stone-200/80 bg-white shadow-sm"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-xl bg-stone-100">
                        {image ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </>
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-stone-500">
                            IMG
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="font-medium text-stone-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-stone-500">
                          {product.category?.name || "No category"}
                        </p>
                        <p className="mt-1 text-xs text-stone-400">
                          {formatPrice(product.price)}{" "}
                          {product.original_price
                            ? `• ${formatPrice(product.original_price)}`
                            : ""}
                        </p>
                      </div>

                      <Badge className={getStatusBadgeClass(product.status)}>
                        {product.status === "active" ? "Active" : "Draft"}
                      </Badge>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.is_featured ? (
                        <Badge className="bg-amber-100 text-amber-700">
                          Featured
                        </Badge>
                      ) : null}
                      {product.is_new_arrival ? (
                        <Badge className="bg-sky-100 text-sky-700">
                          New
                        </Badge>
                      ) : null}
                      {product.is_best_seller ? (
                        <Badge className="bg-rose-100 text-rose-700">
                          Best
                        </Badge>
                      ) : null}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <Link href={`/admin/products/${product.id}`}>
                          <Pencil className="mr-2 size-4" />
                          Edit
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-red-200 text-red-500"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
