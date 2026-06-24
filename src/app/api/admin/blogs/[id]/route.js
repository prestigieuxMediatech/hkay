import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/require-admin";
import {
  deleteBlogImages,
  isFileLike,
  toBoolean,
  uploadBlogCoverImage,
} from "@/lib/blog-images";

const blogPostSelect =
  "id, title, slug, excerpt, content, cover_image, category, status, created_at, published_at";

function normalizeStatus(value) {
  return value === "published" ? "published" : "draft";
}

function isValidBlogPostId(id) {
  return typeof id === "string" && id.trim().length > 0 && id !== "undefined";
}

async function getBlogPostId(context) {
  const params = await context.params;
  return params?.id;
}

export async function GET(request, context) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const blogPostId = await getBlogPostId(context);

  if (!isValidBlogPostId(blogPostId)) {
    return NextResponse.json({ error: "Invalid blog post id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select(blogPostSelect)
    .eq("id", blogPostId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  }

  return NextResponse.json({ blogPost: data }, { status: 200 });
}

export async function PATCH(request, context) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const blogPostId = await getBlogPostId(context);

  if (!isValidBlogPostId(blogPostId)) {
    return NextResponse.json({ error: "Invalid blog post id" }, { status: 400 });
  }

  try {
    const { data: existing, error: fetchError } = await supabase
      .from("blog_posts")
      .select("id, slug, cover_image, published_at")
      .eq("id", blogPostId)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!existing) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    const formData = await request.formData();

    const title = formData.get("title")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim().toLowerCase();
    const excerpt = formData.get("excerpt")?.toString().trim() || null;
    const content = formData.get("content")?.toString().trim() || null;
    const category = formData.get("category")?.toString().trim() || null;
    const status = normalizeStatus(formData.get("status")?.toString().trim().toLowerCase());
    const removeCoverImage = toBoolean(formData.get("removeCoverImage"));
    const coverImageFile = formData.get("coverImage");

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    let coverImageUrl = existing.cover_image;
    let uploadedCoverImageUrl = null;

    if (isFileLike(coverImageFile) && coverImageFile.size > 0) {
      uploadedCoverImageUrl = await uploadBlogCoverImage(coverImageFile, slug || existing.slug);
      coverImageUrl = uploadedCoverImageUrl;
    } else if (removeCoverImage) {
      coverImageUrl = null;
    }

    const publishedAt = status === "published" ? existing.published_at || new Date().toISOString() : null;

    const { data, error } = await supabase
      .from("blog_posts")
      .update({
        title,
        slug,
        excerpt,
        content,
        cover_image: coverImageUrl,
        category,
        status,
        published_at: publishedAt,
      })
      .eq("id", blogPostId)
      .select(blogPostSelect)
      .single();

    if (error) {
      if (uploadedCoverImageUrl) {
        try {
          await deleteBlogImages([uploadedCoverImageUrl]);
        } catch {
          // Best-effort cleanup only.
        }
      }

      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 409 }
        );
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if ((uploadedCoverImageUrl && existing.cover_image) || (removeCoverImage && existing.cover_image)) {
      try {
        await deleteBlogImages([existing.cover_image]);
      } catch {
        // Best-effort cleanup only.
      }
    }

    return NextResponse.json({ blogPost: data }, { status: 200 });
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

  const blogPostId = await getBlogPostId(context);

  if (!isValidBlogPostId(blogPostId)) {
    return NextResponse.json({ error: "Invalid blog post id" }, { status: 400 });
  }

  try {
    const { data: existing, error: fetchError } = await supabase
      .from("blog_posts")
      .select("id, cover_image")
      .eq("id", blogPostId)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!existing) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    const { error } = await supabase.from("blog_posts").delete().eq("id", blogPostId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (existing.cover_image) {
      try {
        await deleteBlogImages([existing.cover_image]);
      } catch {
        // Best-effort cleanup only.
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
