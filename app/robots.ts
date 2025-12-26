import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/private/"]
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        crawlDelay: 0
      }
    ],
    sitemap: "https://colorcocktailfactory.com/sitemap.xml"
  };
}
