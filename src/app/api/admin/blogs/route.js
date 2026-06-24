import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/require-admin";
import { isFileLike, uploadBlogCoverImage } from "@/lib/blog-images";

const blogPostSelect =
  "id, title, slug, excerpt, content, cover_image, category, status, created_at, published_at";

function normalizeStatus(value) {
  return value === "published" ? "published" : "draft";
}

export async function GET(request) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const { data, error } = await supabase
    .from("blog_posts")
    .select(blogPostSelect)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ blogPosts: data }, { status: 200 });
}

export async function POST(request) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  try {
    const formData = await request.formData();

    const title = formData.get("title")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim().toLowerCase();
    const excerpt = formData.get("excerpt")?.toString().trim() || null;
    const content = formData.get("content")?.toString().trim() || null;
    const category = formData.get("category")?.toString().trim() || null;
    const status = normalizeStatus(formData.get("status")?.toString().trim().toLowerCase());
    const coverImageFile = formData.get("coverImage");

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    let coverImageUrl = null;

    if (isFileLike(coverImageFile) && coverImageFile.size > 0) {
      coverImageUrl = await uploadBlogCoverImage(coverImageFile, slug);
    }

    const publishedAt = status === "published" ? new Date().toISOString() : null;

    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        title,
        slug,
        excerpt,
        content,
        cover_image: coverImageUrl,
        category,
        status,
        published_at: publishedAt,
      })
      .select(blogPostSelect)
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

    return NextResponse.json({ blogPost: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
