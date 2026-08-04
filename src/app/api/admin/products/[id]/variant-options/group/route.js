import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/require-admin";

function isValidId(id) {
  return typeof id === "string" && id.trim().length > 0 && id !== "undefined";
}

export async function DELETE(request, context) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const params = await context.params;
  const productId = params?.id;
  const { searchParams } = new URL(request.url);
  const groupName = searchParams.get("group_name");

  if (!isValidId(productId) || !groupName) {
    return NextResponse.json({ error: "Invalid product id or group_name" }, { status: 400 });
  }

  const { error } = await supabase
    .from("product_variant_options")
    .delete()
    .eq("product_id", productId)
    .eq("group_name", groupName);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}