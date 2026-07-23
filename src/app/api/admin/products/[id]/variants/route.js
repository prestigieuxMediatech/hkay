import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/require-admin";

function isValidId(id) {
  return typeof id === "string" && id.trim().length > 0 && id !== "undefined";
}

async function getProductId(context) {
  const params = await context.params;
  return params?.id;
}

function normalizeText(value) {
  return value == null ? "" : value.toString().trim();
}

function normalizeVariantRow(raw, productId, fallbackSortOrder) {
  const variant_label = normalizeText(raw.variant_label);
  const variant_type = raw.variant_type === "tapered" ? "tapered" : "straight";
  const priceText = normalizeText(raw.price);
  const price = priceText ? Number(priceText) : null;
  const is_active = raw.is_active === undefined ? true : Boolean(raw.is_active);
  const sort_order =
    raw.sort_order === undefined || raw.sort_order === null
      ? fallbackSortOrder
      : Number(raw.sort_order);

  return {
    product_id: productId,
    variant_label,
    variant_type,
    price: Number.isNaN(price) ? null : price,
    is_active,
    sort_order,
  };
}

export async function GET(request, context) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const productId = await getProductId(context);
  if (!isValidId(productId)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ variants: data }, { status: 200 });
}

export async function POST(request, context) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const productId = await getProductId(context);
  if (!isValidId(productId)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  try {
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("id", productId)
      .maybeSingle();

    if (productError) {
      return NextResponse.json({ error: productError.message }, { status: 500 });
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const body = await request.json();
    const rawList = Array.isArray(body.variants) ? body.variants : [body];

    const { count } = await supabase
      .from("product_variants")
      .select("id", { count: "exact", head: true })
      .eq("product_id", productId);

    const startingOrder = count || 0;

    const rows = rawList.map((raw, i) =>
      normalizeVariantRow(raw, productId, startingOrder + i)
    );

    const invalid = rows.find((r) => !r.variant_label);
    if (invalid) {
      return NextResponse.json(
        { error: "variant_label is required for every variant" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("product_variants")
      .insert(rows)
      .select();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "One or more of these sizes already exist for this product" },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase
      .from("products")
      .update({ has_variants: true })
      .eq("id", productId);

    return NextResponse.json({ variants: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}