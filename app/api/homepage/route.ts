import { getHomepageData } from "@/lib/homepage/server";

export const revalidate = 120;

export async function GET() {
  return Response.json(await getHomepageData(), {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=120" },
  });
}
