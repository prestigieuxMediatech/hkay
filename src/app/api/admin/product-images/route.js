import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/require-admin";
import {
  deleteProductImages,
  isFileLike,
  uploadProductImage,
} from "@/lib/product-images";
import {
  MAX_PRODUCT_IMAGE_BYTES,
  validateImageFileSize,
  validateImageFileType,
} from "@/lib/image-standards";

function normalizeText(value) {
  return value == null ? "" : value.toString().trim();
}

export async function POST(request) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  try {
    const formData = await request.formData();
    const image = formData.get("image");
    const slug = normalizeText(formData.get("slug")).toLowerCase() || "product";
    const indexValue = Number(normalizeText(formData.get("index")));
    const index = Number.isNaN(indexValue) ? 0 : indexValue;

    if (!isFileLike(image) || image.size <= 0) {
      return NextResponse.json({ error: "Product image is required" }, { status: 400 });
    }

    const typeError = validateImageFileType(image, "Product image");
    if (typeError) {
      return NextResponse.json({ error: typeError }, { status: 400 });
    }

    const sizeError = validateImageFileSize(
      image,
      MAX_PRODUCT_IMAGE_BYTES,
      "Product image"
    );
    if (sizeError) {
      return NextResponse.json({ error: sizeError }, { status: 400 });
    }

    const imageUrl = await uploadProductImage(image, slug, index);

    return NextResponse.json({ imageUrl }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  try {
    const body = await request.json().catch(() => ({}));
    const urls = Array.isArray(body.urls)
      ? body.urls.filter((url) => typeof url === "string" && url.trim())
      : [];

    if (urls.length) {
      await deleteProductImages(urls);
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}