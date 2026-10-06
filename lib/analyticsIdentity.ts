/** Exact appointment IDs take precedence over legacy slugs. Groups stay distinct. */
export function contentIdentity(
  id: string,
  url?: string,
): {
  id: string;
  type: "product" | "product_group";
  appointmentTypeId?: string;
} {
  let exact: string | undefined;
  try {
    const u = new URL(url || "", "https://colorcocktailfactory.com");
    if (/(^|\.)eventbrite\.com$/.test(u.hostname)) {
      const eventId =
        u.pathname.match(/(?:tickets-|\/e\/)(\d+)(?:\/|$)/)?.[1] ||
        id.match(/^(?:eventbrite[:-])?(\d+)$/)?.[1];
      if (eventId) return { id: `eventbrite:${eventId}`, type: "product" };
    }
    exact =
      u.searchParams.get("appointmentType") ||
      u.searchParams.get("appointmentTypeIds[]") ||
      u.pathname.match(/\/appointment\/(\d+)\//)?.[1];
    if (exact && !/^\d+$/.test(exact)) exact = undefined;
    if (!exact && u.pathname.startsWith("/book/"))
      id = `activity:${u.pathname.split("/").at(-1)}`;
  } catch {}
  exact ||= /^\d+$/.test(id) ? id : undefined;
  return exact
    ? { id: exact, type: "product", appointmentTypeId: exact }
    : {
        id: id.startsWith("activity:") ? id : `activity:${id}`,
        type: "product_group",
      };
}
export function classCategory(title: string): string {
  if (/pottery|wheel|ceramic|clay|handbuild/i.test(title)) return "pottery";
  if (/glass|mosaic|lamp/i.test(title)) return "glass";
  if (/bonsai|terrarium/i.test(title)) return "plants";
  if (/candle/i.test(title)) return "candles";
  if (/paint|watercolor/i.test(title)) return "painting";
  return "workshop";
}
