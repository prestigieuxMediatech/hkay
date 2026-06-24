"use client";

import ProductForm from "@/app/(site)/components/admin/ProductForm";

export default function AddProductPage() {
  return (
    <ProductForm
      key="new-product"
      title="Add Product"
      backHref="/admin/products"
      backLabel="Products"
      submitLabel="Save Product"
      actionUrl="/api/admin/products"
      method="POST"
    />
  );
}
