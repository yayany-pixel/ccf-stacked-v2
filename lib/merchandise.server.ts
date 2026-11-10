import "server-only";
import { MERCHANDISE, merchandiseEnabled, validMerchandiseProduct } from "./merchandise";

export async function getMerchandiseProduct() {
  if (!merchandiseEnabled) return null;
  try {
    const response = await fetch(`${MERCHANDISE.url}.js`, { redirect: "error", next: { revalidate: 60 }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) return null;
    const product: unknown = await response.json();
    return validMerchandiseProduct(product) ? product : null;
  } catch { return null; }
}
