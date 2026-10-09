import { NextResponse } from "next/server";
import { getVisitorComparisonData } from "@/lib/analyticsVisitorMetrics";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tzParam = url.searchParams.get("tz");
  const timezone = tzParam === "UTC" ? "UTC" : "America/Chicago";

  try {
    const data = await getVisitorComparisonData(timezone);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[API visitor-comparison] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch visitor comparison metrics" },
      { status: 500 }
    );
  }
}
