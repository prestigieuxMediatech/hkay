import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/require-admin";

function isValidId(id) {
  return typeof id === "string" && id.trim().length > 0 && id !== "undefined";
}

async function getIds(context) {
  const params = await context.params;
  return { productId: params?.id, variantId: params?.variantId };
}

export async function PATCH(request, context) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const { productId, variantId } = await getIds(context);
  if (!isValidId(productId) || !isValidId(variantId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const updateData = {};

    if (body.variant_label !== undefined) {
      const label = body.variant_label?.toString().trim();
      if (!label) {
        return NextResponse.json(
          { error: "variant_label cannot be empty" },
          { status: 400 }
        );
      }
      updateData.variant_label = label;
    }
    if (body.variant_type !== undefined) {
      updateData.variant_type = body.variant_type === "tapered" ? "tapered" : "straight";
    }
    if (body.price !== undefined) {
      const price = body.price === null || body.price === "" ? null : Number(body.price);
      updateData.price = Number.isNaN(price) ? null : price;
    }
    if (body.is_active !== undefined) {
      updateData.is_active = Boolean(body.is_active);
    }
    if (body.sort_order !== undefined) {
      updateData.sort_order = Number(body.sort_order);
    }

    const { data, error } = await supabase
      .from("product_variants")
      .update(updateData)
      .eq("id", variantId)
      .eq("product_id", productId)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "This size already exists for this product" },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ variant: data }, { status: 200 });
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

  const { productId, variantId } = await getIds(context);
  if (!isValidId(productId) || !isValidId(variantId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const { error } = await supabase
    .from("product_variants")
    .delete()
    .eq("id", variantId)
    .eq("product_id", productId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If no variants remain, unset has_variants so the storefront stops expecting a selector
  const { count } = await supabase
    .from("product_variants")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  if (!count) {
    await supabase
      .from("products")
      .update({ has_variants: false })
      .eq("id", productId);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}