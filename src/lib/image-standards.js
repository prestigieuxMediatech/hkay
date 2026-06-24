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
