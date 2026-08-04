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

function normalizeOptionRow(raw, productId, fallbackSortOrder) {
  const group_name = normalizeText(raw.group_name);
  const value = normalizeText(raw.value);
  const priceText = normalizeText(raw.price);
  const price = priceText ? Number(priceText) : null;
  const is_active = raw.is_active === undefined ? true : Boolean(raw.is_active);
  const sort_order =
    raw.sort_order === undefined || raw.sort_order === null
      ? fallbackSortOrder
      : Number(raw.sort_order);

  return {
    product_id: productId,
    group_name,
    value,
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
    .from("product_variant_options")
    .select("*")
    .eq("product_id", productId)
    .order("group_name", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ options: data }, { status: 200 });
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
    const rawList = Array.isArray(body.options) ? body.options : [body];

    const groupName = normalizeText(rawList[0]?.group_name);

    const { count } = await supabase
      .from("product_variant_options")
      .select("id", { count: "exact", head: true })
      .eq("product_id", productId)
      .eq("group_name", groupName);

    const startingOrder = count || 0;

    const rows = rawList.map((raw, i) =>
      normalizeOptionRow(raw, productId, startingOrder + i)
    );

    const invalid = rows.find((r) => !r.group_name || !r.value);
    if (invalid) {
      return NextResponse.json(
        { error: "group_name and value are required for every option" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("product_variant_options")
      .insert(rows)
      .select();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "This value already exists under this variant group" },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ options: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}