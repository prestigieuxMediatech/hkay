import "server-only";

import { supabase } from "@/lib/supabase";

export const BLOG_IMAGE_BUCKET = "blog-images";

export function toBoolean(value) {
  return value === true || value === "true" || value === 1 || value === "1";
}

export function isFileLike(value) {
  return value && typeof value === "object" && typeof value.arrayBuffer === "function";
}

export async function uploadBlogCoverImage(file, slug) {
  const ext = file.name?.split(".").pop() || "jpg";
  const fileName = `${slug}-${Date.now()}.${ext}`;
  const filePath = `blog-posts/${fileName}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(BLOG_IMAGE_BUCKET).upload(filePath, buffer, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(BLOG_IMAGE_BUCKET).getPublicUrl(filePath);

  return data.publicUrl;
}

export function publicUrlToStoragePath(url) {
  if (!url || typeof url !== "string") return null;

  try {
    const parsed = new URL(url);
    const marker = `/storage/v1/object/public/${BLOG_IMAGE_BUCKET}/`;
    const index = parsed.pathname.indexOf(marker);

    if (index === -1) return null;

    return decodeURIComponent(parsed.pathname.slice(index + marker.length));
  } catch {
    return null;
  }
}

export async function deleteBlogImages(imageUrls = []) {
  const paths = (Array.isArray(imageUrls) ? imageUrls : [imageUrls])
    .map(publicUrlToStoragePath)
    .filter(Boolean);

  if (!paths.length) return;

  const { error } = await supabase.storage.from(BLOG_IMAGE_BUCKET).remove(paths);

  if (error) {
    throw new Error(error.message);
  }
}
