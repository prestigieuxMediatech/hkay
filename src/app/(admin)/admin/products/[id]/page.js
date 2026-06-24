"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import ProductForm from "@/app/(site)/components/admin/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const productId = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!productId) return;

    async function loadProduct() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load product");
        }

        setProduct(data.product || null);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <Card className="border-stone-200/80 bg-white shadow-sm">
        <CardContent className="p-6">
          <p className="text-sm text-stone-500">Loading product...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <Card className="border-stone-200/80 bg-white shadow-sm">
        <CardContent className="p-6">
          <p className="text-sm text-stone-500">Product not found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ProductForm
      key={productId || "product"}
      product={product}
      title="Edit Product"
      backHref="/admin/products"
      backLabel="Products"
      submitLabel="Update Product"
      actionUrl={`/api/admin/products/${productId}`}
      method="PATCH"
    />
  );
}
