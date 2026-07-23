import "server-only";

import { supabase } from "@/lib/supabase";

const blogPostSelect =
  "id, title, slug, excerpt, content, cover_image, category, status, created_at, published_at";

function buildPublishedBlogQuery() {
  return supabase
    .from("blog_posts")
    .select(blogPostSelect)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });
}

export async function getPublishedBlogPosts() {
  const { data, error } = await buildPublishedBlogQuery();

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getPublishedBlogPostBySlug(slug) {
  if (!slug) {
    return null;
  }

  const { data, error } = await buildPublishedBlogQuery()
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data || null;
}
