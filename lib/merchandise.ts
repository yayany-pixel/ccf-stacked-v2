// Shopify remains the only merchandise catalog and checkout.
export const MERCHANDISE = {
  id: 15447657480235,
  title: "Good With My Hands — Vintage Pottery Tee",
  path: "/shop/good-with-my-hands-vintage-pottery-tee",
  url: "https://date-night-chicago.myshopify.com/products/good-with-my-hands-vintage-pottery-tee",
  store: "https://date-night-chicago.myshopify.com",
} as const;

// Enable only after the production artwork, policies and public checkout pass review.
export const merchandiseEnabled = process.env.NEXT_PUBLIC_MERCHANDISE_ENABLED === "true";
export function merchandiseUrl(source: "shop" | "product" | "class" | "post-class") {
  const url = new URL(MERCHANDISE.url);
  url.searchParams.set("utm_source", "colorcocktailfactory");
  url.searchParams.set("utm_medium", source === "post-class" ? "email" : "website");
  url.searchParams.set("utm_campaign", "good-with-my-hands");
  url.searchParams.set("utm_content", source);
  return url.toString();
}
export type MerchandiseProduct = {
  id: number; title: string; images: string[];
  variants: { id: number; available: boolean; price: number; option1: string; option2: string }[];
};
export function validMerchandiseProduct(value: unknown): value is MerchandiseProduct {
  const p = value as MerchandiseProduct;
  const colors = ["Pepper", "Espresso", "Moss"];
  const sizes = ["S", "M", "L", "XL", "2XL", "3XL"];
  return !!p && p.id === MERCHANDISE.id && typeof p.title === "string" &&
    Array.isArray(p.images) && p.images.length > 0 && p.images.every(src => typeof src === "string" && /^(https:)?\/\/cdn\.shopify\.com\//.test(src)) &&
    Array.isArray(p.variants) && p.variants.length === 18 &&
    colors.every(color => sizes.every(size => p.variants.filter(v =>
      v.option1 === color && v.option2 === size && Number.isSafeInteger(v.id) &&
      typeof v.available === "boolean" && v.price === (size === "3XL" ? 4000 : size === "2XL" ? 3800 : 3600)
    ).length === 1));
}
