/** Shared validation; opaque attribution values are never rewritten. */
export type OpenAIAttribution = { oppref?: string; obref?: string };
export function openAIAttribution(value: unknown): OpenAIAttribution | undefined {
  if (!value || typeof value !== "object") return undefined;
  const data = value as Record<string, unknown>;
  const valid = (v: unknown, max: number): v is string =>
    typeof v === "string" && v.length > 0 && v.length <= max && !/[\s\x00-\x1f\x7f]/.test(v);
  const result = {
    ...(valid(data.oppref, 2048) ? { oppref: data.oppref } : {}),
    ...(valid(data.obref, 128) ? { obref: data.obref } : {}),
  };
  return result.oppref || result.obref ? result : undefined;
}
