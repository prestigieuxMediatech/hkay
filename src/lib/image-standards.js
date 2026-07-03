export const ALLOWED_IMAGE_MIME_PREFIX = "image/";
export const ALLOWED_IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
  ".bmp",
  ".svg",
  ".ico",
  ".tif",
  ".tiff",
  ".heic",
  ".heif",
];

export const PRODUCT_IMAGE_REQUIREMENT = {
  label: "Product image",
  width: 800,
  height: 800,
};

export const MAX_PRODUCT_IMAGE_BYTES = 10 * 1024 * 1024;

export const CATEGORY_IMAGE_REQUIREMENT = {
  label: "Category image",
  width: 600,
  height: 700,
};

export function buildImageAccept() {
  return "image/*";
}

export function imageRequirementText(requirement) {
  return `${requirement.width} x ${requirement.height}px, any image type`;
}

function getFileExtension(name = "") {
  const dotIndex = name.lastIndexOf(".");
  if (dotIndex === -1) return "";

  return name.slice(dotIndex).toLowerCase();
}

export function isAllowedImageFile(file) {
  if (!file || typeof file !== "object") return false;

  const mimeType = typeof file.type === "string" ? file.type.toLowerCase() : "";
  if (mimeType.startsWith(ALLOWED_IMAGE_MIME_PREFIX)) {
    return true;
  }

  const extension = getFileExtension(file.name || "");
  return ALLOWED_IMAGE_EXTENSIONS.includes(extension);
}

export function validateImageFileType(file, label = "Image") {
  if (!isAllowedImageFile(file)) {
    return `${label} must be an image file.`;
  }

  return null;
}

export function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function validateImageFileSize(file, maxBytes = MAX_PRODUCT_IMAGE_BYTES, label = "Image") {
  if (!file || typeof file !== "object" || typeof file.size !== "number") {
    return `${label} is invalid.`;
  }

  if (file.size > maxBytes) {
    return `${label} must be ${formatFileSize(maxBytes)} or smaller.`;
  }

  return null;
}

export function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || typeof URL === "undefined") {
      reject(new Error("Image previews are only available in the browser."));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to read image dimensions."));
    };

    image.src = objectUrl;
  });
}

export async function validateExactImageDimensions(file, requirement) {
  const dimensions = await getImageDimensions(file);

  if (
    dimensions.width !== requirement.width ||
    dimensions.height !== requirement.height
  ) {
    return `${requirement.label} must be exactly ${requirement.width} x ${requirement.height}px.`;
  }

  return null;
}
