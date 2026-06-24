import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(request) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, image, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ categories: data }, { status: 200 });
}

export async function POST(request) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  try {
    const formData = await request.formData();

    const name = formData.get("name")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim().toLowerCase();
    const status = formData.get("status")?.toString().trim() === "draft" ? "draft" : "active";
    const imageFile = formData.get("image");

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    let imageUrl = null;

    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
      const ext = imageFile.name?.split(".").pop() || "jpg";
      const fileName = `${slug}-${Date.now()}.${ext}`;
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
      .insert({
        name,
        slug,
        image: imageUrl,
        status,
      })
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

    return NextResponse.json({ category: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
