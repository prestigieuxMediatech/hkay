import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/require-admin";
import {
  deleteProductImages,
  toBoolean,
} from "@/lib/product-images";

function normalizeStatus(value) {
  return value === "active" ? "active" : "draft";
}

function isValidProductId(id) {
  return typeof id === "string" && id.trim().length > 0 && id !== "undefined";
}

async function getProductId(context) {
  const params = await context.params;
  return params?.id;
}

function normalizeText(value) {
  return value == null ? "" : value.toString().trim();
}

function normalizeNullableText(value) {
  const text = normalizeText(value);
  return text || null;
}

function normalizeNullableNumber(value) {
  const text = normalizeText(value);

  if (!text) {
    return null;
  }

  const numberValue = Number(text);
  return Number.isNaN(numberValue) ? Number.NaN : numberValue;
}

function normalizeImageUrls(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((url) => (typeof url === "string" ? url.trim() : ""))
    .filter(Boolean);
}

async function readProductBody(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    return {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      price: formData.get("price"),
      originalPrice: formData.get("originalPrice"),
      categoryId: formData.get("categoryId"),
      isFeatured: formData.get("isFeatured"),
      isNewArrival: formData.get("isNewArrival"),
      isBestSeller: formData.get("isBestSeller"),
      status: formData.get("status"),
      images: formData.getAll("images"),
    };
  }

  return request.json();
}

export async function GET(request, context) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const productId = await getProductId(context);

  if (!isValidProductId(productId)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, description, price, original_price, category_id, images, is_featured, is_new_arrival, is_best_seller, status, created_at, category:categories(id, name, slug)"
    )
    .eq("id", productId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product: data }, { status: 200 });
}

export async function PATCH(request, context) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const productId = await getProductId(context);

  if (!isValidProductId(productId)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  try {
    const { data: existing, error: fetchError } = await supabase
      .from("products")
      .select("id, slug, images")
      .eq("id", productId)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const body = await readProductBody(request);
    const imagesProvided = Object.prototype.hasOwnProperty.call(body, "images");
    const imageUrls = normalizeImageUrls(body.images);

    const name = normalizeText(body.name);
    const slug = normalizeText(body.slug).toLowerCase();
    const description = normalizeNullableText(body.description);
    const priceRaw = normalizeText(body.price);
    const price = Number(priceRaw);
    const originalPrice = normalizeNullableNumber(body.originalPrice);
    const categoryId = normalizeNullableText(body.categoryId);
    const isFeatured = toBoolean(body.isFeatured);
    const isNewArrival = toBoolean(body.isNewArrival);
    const isBestSeller = toBoolean(body.isBestSeller);
    const status = normalizeStatus(normalizeText(body.status).toLowerCase());

    if (!name || !slug || !priceRaw || Number.isNaN(price)) {
      return NextResponse.json(
        { error: "Name, slug, and price are required" },
        { status: 400 }
      );
    }

    if (originalPrice !== null && Number.isNaN(originalPrice)) {
      return NextResponse.json(
        { error: "Original price must be a number" },
        { status: 400 }
      );
    }

    const updateData = {
      name,
      slug,
      description,
      price,
      original_price: originalPrice,
      category_id: categoryId,
      is_featured: isFeatured,
      is_new_arrival: isNewArrival,
      is_best_seller: isBestSeller,
      status,
    };

    if (imagesProvided) {
      updateData.images = imageUrls.length ? imageUrls : null;
    }

    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", productId)
      .select(
        "id, name, slug, description, price, original_price, category_id, images, is_featured, is_new_arrival, is_best_seller, status, created_at, category:categories(id, name, slug)"
      )
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 409 }
        );
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (imagesProvided && existing.images?.length) {
      try {
        await deleteProductImages(existing.images || []);
      } catch {
        // Best-effort cleanup only.
      }
    }

    return NextResponse.json({ product: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const productId = await getProductId(context);

  if (!isValidProductId(productId)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  try {
    const { data: existing, error: fetchError } = await supabase
      .from("products")
      .select("id, images")
      .eq("id", productId)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const { error } = await supabase.from("products").delete().eq("id", productId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    try {
      await deleteProductImages(existing.images || []);
    } catch {
      // Best-effort cleanup only.
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
