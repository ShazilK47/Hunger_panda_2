/**
 * Utility functions for handling images in the application
 */

// Cache the most commonly used images
const CACHED_IMAGES = {
  restaurantDefault: "/images/fallback-food-image.jpg",
  menuItemDefault: "/images/fallback-food-image.jpg",
  userAvatar: "/images/default-avatar.jpg",
};

/**
 * Gets an image URL, falling back to a local image if the URL is invalid or null
 * @param url - The original image URL
 * @param fallbackType - The type of fallback image to use
 * @returns A valid image URL
 */
export function getImageUrl(
  url: string | null | undefined,
  fallbackType: keyof typeof CACHED_IMAGES = "restaurantDefault"
): string {
  if (!url) {
    return CACHED_IMAGES[fallbackType];
  }

  // Check if the URL is valid
  try {
    new URL(url);
    return url;
  } catch {
    return CACHED_IMAGES[fallbackType];
  }
}

/**
 * Optimizes Unsplash image URLs for better performance
 * @param url - The original Unsplash image URL
 * @param width - The desired width of the image
 * @returns An optimized Unsplash image URL
 */
export function optimizeUnsplashUrl(url: string, width = 640): string {
  if (!url || !url.includes("unsplash.com")) {
    return url;
  }

  // Strip any existing query parameters
  const baseUrl = url.split("?")[0];

  // Add optimized parameters
  return `${baseUrl}?q=80&w=${width}&auto=format&fit=crop`;
}

/**
 * Get blur data URL for placeholder images
 * @returns A data URL for a blur placeholder
 */
export function getBlurDataUrl(): string {
  return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg==";
}

/**
 * Image component props with sensible defaults for most use cases
 */
export const defaultImageProps = {
  loading: "lazy" as const,
  placeholder: "blur" as const,
  blurDataURL: getBlurDataUrl(),
  onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    const fallbackType =
      (target.dataset.fallbackType as keyof typeof CACHED_IMAGES) ||
      "restaurantDefault";
    target.src = CACHED_IMAGES[fallbackType];
  },
};
