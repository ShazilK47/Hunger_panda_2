// Format price from number to currency string
export function formatPrice(price: number | string): string {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("ur-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 2,
  }).format(numericPrice);
}

// Alias for formatPrice to maintain consistency with menu item component
export const formatCurrency = formatPrice;

// Format date to readable string
export function formatDate(date: Date | string): string {
  const dateObject = typeof date === "string" ? new Date(date) : date;

  return dateObject.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Format date with time
export function formatDateTime(date: Date | string): string {
  const dateObject = typeof date === "string" ? new Date(date) : date;

  return dateObject.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
