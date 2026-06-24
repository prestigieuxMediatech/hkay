import "server-only";
import { supabase } from "@/lib/supabase";

export const PRODUCT_IMAGE_BUCKET = "product-images";

export function toBoolean(value) {
  return value === true || value === "true" || value === 1 || value === "1";
}

export function isFileLike(value) {
  return value && typeof value === "object" && typeof value.arrayBuffer === "function";
}

function getContentTypeFromExtension(fileName = "") {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "avif":
      return "image/avif";
    case "bmp":
      return "image/bmp";
    case "svg":
      return "image/svg+xml";
    case "ico":
      return "image/x-icon";
    case "tif":
    case "tiff":
      return "image/tiff";
    case "heic":
      return "image/heic";
    case "heif":
      return "image/heif";
    default:
      return "application/octet-stream";
  }
}

export async function uploadProductImage(file, slug, index) {
  const ext = file.name?.split(".").pop() || "jpg";
  const fileName = `${slug}-${Date.now()}-${index}.${ext}`;
  const filePath = `products/${fileName}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType =
    file.type || getContentTypeFromExtension(file.name || "") || "application/octet-stream";

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(filePath, buffer, {
      contentType,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export function publicUrlToStoragePath(url) {
  if (!url || typeof url !== "string") return null;

  try {
    const parsed = new URL(url);
    const marker = `/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/`;
    const index = parsed.pathname.indexOf(marker);

    if (index === -1) return null;

    return decodeURIComponent(parsed.pathname.slice(index + marker.length));
  } catch {
    return null;
  }
}

export async function deleteProductImages(imageUrls = []) {
  const paths = imageUrls.map(publicUrlToStoragePath).filter(Boolean);

  if (!paths.length) return;

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .remove(paths);

  if (error) {
    throw new Error(error.message);
  }
}
