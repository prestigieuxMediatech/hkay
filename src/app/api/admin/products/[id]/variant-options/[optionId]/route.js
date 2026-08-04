import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/require-admin";

function isValidId(id) {
  return typeof id === "string" && id.trim().length > 0 && id !== "undefined";
}

async function getIds(context) {
  const params = await context.params;
  return { productId: params?.id, optionId: params?.optionId };
}

export async function PATCH(request, context) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const { productId, optionId } = await getIds(context);
  if (!isValidId(productId) || !isValidId(optionId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const updateData = {};

    if (body.value !== undefined) {
      const value = body.value?.toString().trim();
      if (!value) {
        return NextResponse.json({ error: "value cannot be empty" }, { status: 400 });
      }
      updateData.value = value;
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
      .from("product_variant_options")
      .update(updateData)
      .eq("id", optionId)
      .eq("product_id", productId)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "This value already exists under this variant group" },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ option: data }, { status: 200 });
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

  const { productId, optionId } = await getIds(context);
  if (!isValidId(productId) || !isValidId(optionId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const { error } = await supabase
    .from("product_variant_options")
    .delete()
    .eq("id", optionId)
    .eq("product_id", productId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}