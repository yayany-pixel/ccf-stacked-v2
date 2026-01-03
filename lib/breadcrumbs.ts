/**
 * Generate BreadcrumbList structured data for improved SEO
 * https://schema.org/BreadcrumbList
 */

type BreadcrumbItem = {
  name: string;
  url: string;
};

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  const base = "https://colorcocktailfactory.com";
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${base}${item.url}`
    }))
  };
}

/**
 * Common breadcrumb patterns
 */

export function cityPageBreadcrumbs(cityName: string, cityParam: string) {
  return generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: cityName, url: `/${cityParam}` }
  ]);
}

export function activityBreadcrumbs(
  activityName: string,
  activitySlug: string
) {
  return generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Activities", url: "/activities" },
    { name: activityName, url: `/activities/${activitySlug}` }
  ]);
}

export function cityActivityBreadcrumbs(
  cityName: string,
  cityParam: string,
  activityName: string,
  activitySlug: string
) {
  return generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: cityName, url: `/${cityParam}` },
    { name: activityName, url: `/${cityParam}/${activitySlug}` }
  ]);
}

export function blogPostBreadcrumbs(
  postTitle: string,
  postSlug: string
) {
  return generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: postTitle, url: `/blog/${postSlug}` }
  ]);
}

export function audiencePageBreadcrumbs(
  audienceType: string,
  audienceSlug: string
) {
  return generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: audienceType, url: `/${audienceSlug}` }
  ]);
}
