import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/require-admin";
import { isFileLike, toBoolean, uploadProductImage } from "@/lib/product-images";
import { validateImageFileType } from "@/lib/image-standards";

function normalizeStatus(value) {
  return value === "active" ? "active" : "draft";
}

export async function GET(request) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, description, price, original_price, category_id, images, is_featured, is_new_arrival, is_best_seller, status, created_at, category:categories(id, name, slug)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data }, { status: 200 });
}

export async function POST(request) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  try {
    const formData = await request.formData();

    const name = formData.get("name")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim().toLowerCase();
    const description = formData.get("description")?.toString().trim() || null;
    const priceRaw = formData.get("price")?.toString().trim();
    const price = Number(priceRaw);
    const originalPriceRaw = formData.get("originalPrice")?.toString().trim();
    const originalPrice =
      originalPriceRaw === "" || originalPriceRaw == null
        ? null
        : Number(originalPriceRaw);

    const categoryId = formData.get("categoryId")?.toString().trim() || null;
    const imageFiles = formData.getAll("images").filter(isFileLike);
    const isFeatured = toBoolean(formData.get("isFeatured"));
    const isNewArrival = toBoolean(formData.get("isNewArrival"));
    const isBestSeller = toBoolean(formData.get("isBestSeller"));
    const status = normalizeStatus(
      formData.get("status")?.toString().trim().toLowerCase()
    );

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

    for (const imageFile of imageFiles) {
      const imageTypeError = validateImageFileType(imageFile, "Product images");
      if (imageTypeError) {
        return NextResponse.json({ error: imageTypeError }, { status: 400 });
      }
    }

    const imageUrls = [];
    for (let index = 0; index < imageFiles.length; index += 1) {
      const imageUrl = await uploadProductImage(imageFiles[index], slug, index);
      imageUrls.push(imageUrl);
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        description,
        price,
        original_price: originalPrice,
        category_id: categoryId,
        images: imageUrls.length ? imageUrls : null,
        is_featured: isFeatured,
        is_new_arrival: isNewArrival,
        is_best_seller: isBestSeller,
        status,
      })
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

    return NextResponse.json({ product: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
