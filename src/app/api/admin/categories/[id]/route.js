import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/require-admin";

function isValidCategoryId(id) {
  return typeof id === "string" && id.trim().length > 0 && id !== "undefined";
}

async function getCategoryId(context) {
  const params = await context.params;
  return params?.id;
}

export async function GET(request, context) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const categoryId = await getCategoryId(context);

  if (!isValidCategoryId(categoryId)) {
    return NextResponse.json({ error: "Invalid category id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, image, status, created_at")
    .eq("id", categoryId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json({ category: data }, { status: 200 });
}

export async function PATCH(request, context) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const categoryId = await getCategoryId(context);

  if (!isValidCategoryId(categoryId)) {
    return NextResponse.json({ error: "Invalid category id" }, { status: 400 });
  }

  try {
    const formData = await request.formData();

    const name = formData.get("name")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim().toLowerCase();
    const status = formData.get("status")?.toString().trim() === "draft" ? "draft" : "active";
    const imageFile = formData.get("image");

    const { data: existing, error: fetchError } = await supabase
      .from("categories")
      .select("id, image")
      .eq("id", categoryId)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!existing) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    let imageUrl = existing.image;

    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
      const ext = imageFile.name?.split(".").pop() || "jpg";
      const fileName = `${slug || "category"}-${Date.now()}.${ext}`;
      const filePath = `categories/${fileName}`;

      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from("category-images")
        .upload(filePath, buffer, {
          contentType: imageFile.type || "image/jpeg",
          upsert: false,
        });

      if (uploadError) {
        return NextResponse.json(
          { error: uploadError.message },
          { status: 500 }
        );
      }

      const { data: publicData } = supabase.storage
        .from("category-images")
        .getPublicUrl(filePath);

      imageUrl = publicData.publicUrl;
    }

    const { data, error } = await supabase
      .from("categories")
      .update({
        name,
        slug,
        image: imageUrl,
        status,
      })
      .eq("id", categoryId)
      .select("id, name, slug, image, status, created_at")
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

    return NextResponse.json({ category: data }, { status: 200 });
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

  const categoryId = await getCategoryId(context);

  if (!isValidCategoryId(categoryId)) {
    return NextResponse.json({ error: "Invalid category id" }, { status: 400 });
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
