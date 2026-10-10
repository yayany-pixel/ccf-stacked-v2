import MetaActivityView from "@/components/MetaActivityView";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ActivityDetailView from "@/components/ActivityDetailView";
import {
  getActivityDetailBySlug,
  getAllActivitySlugs,
  getAllActivityDetails,
  type ActivityDetail
} from "@/lib/activityRegistry";
import { STUDIO_LOCATIONS } from "@/lib/locations";

export async function generateStaticParams() {
  const slugs = getAllActivitySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const activity = getActivityDetailBySlug(params.slug);

  if (!activity) {
    return {
      title: { absolute: "Activity Not Found | Color Cocktail Factory" },
      description: "This activity could not be found."
    };
  }

  const fullTitle = `${activity.heroTitle} | Color Cocktail Factory`;
  const description = activity.heroDescription;
  const url = `https://colorcocktailfactory.com/activities/${activity.slug}`;

  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      type: "website",
      images: [activity.image.path || "/og-image.jpg"]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [activity.image.path || "/og-image.jpg"]
    }
  };
}

export default function ActivityPage({ params }: { params: { slug: string } }) {
  const activity = getActivityDetailBySlug(params.slug);

  if (!activity) {
    notFound();
  }

  // Get related activities from same or other categories, protecting general audience
  const allActivities = getAllActivityDetails();
  const relatedActivities = allActivities
    .filter((a) => a.slug !== activity.slug)
    .filter((a) => {
      // General audience activities should prioritize general audience workshops
      if (!activity.adultThemed && a.adultThemed) return false;
      return true;
    })
    .sort((a, b) => {
      // Prioritize same category, then beginner-friendly
      if (a.category === activity.category && b.category !== activity.category) return -1;
      if (b.category === activity.category && a.category !== activity.category) return 1;
      if (a.beginnerFriendly && !b.beginnerFriendly) return -1;
      if (b.beginnerFriendly && !a.beginnerFriendly) return 1;
      return 0;
    })
    .slice(0, 5);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "name": activity.title,
        "description": activity.heroDescription,
        "provider": {
          "@type": "LocalBusiness",
          "name": "Color Cocktail Factory",
          "image": "https://colorcocktailfactory.com/apple-touch-icon.png",
          "address": [
            {
              "@type": "PostalAddress",
              "streetAddress": STUDIO_LOCATIONS.chicago.streetAddress,
              "addressLocality": STUDIO_LOCATIONS.chicago.addressLocality,
              "addressRegion": STUDIO_LOCATIONS.chicago.addressRegion,
              "postalCode": STUDIO_LOCATIONS.chicago.postalCode,
              "addressCountry": "US"
            },
            {
              "@type": "PostalAddress",
              "streetAddress": STUDIO_LOCATIONS.eugene.streetAddress,
              "addressLocality": STUDIO_LOCATIONS.eugene.addressLocality,
              "addressRegion": STUDIO_LOCATIONS.eugene.addressRegion,
              "postalCode": STUDIO_LOCATIONS.eugene.postalCode,
              "addressCountry": "US"
            }
          ],
          "telephone": "+1-312-881-9929"
        },
        "category": activity.categoryLabel,
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": activity.faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://colorcocktailfactory.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Activities",
            "item": "https://colorcocktailfactory.com/activities"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": activity.title,
            "item": `https://colorcocktailfactory.com/activities/${activity.slug}`
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main-content" tabIndex={-1} className="min-h-screen">
        <MetaActivityView id={`activity:${activity.slug}`} name={activity.title} />
        <ActivityDetailView
          activity={activity}
          relatedActivities={relatedActivities}
        />
      </main>
    </>
  );
}
