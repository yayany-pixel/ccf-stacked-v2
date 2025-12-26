import type { City, SectionConfig } from "@/lib/config";
import { buildBookingLink } from "@/lib/links";

export function localBusinessJsonLd(city: City) {
  const isChicago = city.param === "chicago";

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ArtGallery", "TouristAttraction"],
    name: "Color Cocktail Factory",
    alternateName: "CCF Creative Workshops",
    description: "Premium creative workshops including pottery, glass art, Turkish lamp making, mosaics, and more. Perfect for date nights, team building, and private events.",
    url: `https://colorcocktailfactory.com/${city.param}`,
    sameAs: [
      "https://www.instagram.com/colorcocktailfactory",
      "https://www.facebook.com/colorcocktailfactory"
    ],
    slogan: "Creativity is shareable.",
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Credit Card, Debit Card",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Wednesday", "Thursday", "Friday"],
        opens: "17:00",
        closes: "21:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "10:00",
        closes: "21:00"
      }
    ],
    address: isChicago
      ? {
          "@type": "PostalAddress",
          streetAddress: "1142 W. 18th Street",
          addressLocality: "Chicago",
          addressRegion: "IL",
          postalCode: "60608",
          addressCountry: "US"
        }
      : {
          "@type": "PostalAddress",
          addressLocality: "Eugene",
          addressRegion: "OR",
          addressCountry: "US"
        },
    geo: isChicago
      ? {
          "@type": "GeoCoordinates",
          latitude: 41.8577,
          longitude: -87.6698
        }
      : {
          "@type": "GeoCoordinates",
          latitude: 44.0521,
          longitude: -123.0868
        },
    telephone: isChicago ? "+1-312-XXX-XXXX" : "+1-541-XXX-XXXX",
    email: "info@colorcocktailfactory.com",
    hasMap: isChicago
      ? "https://maps.google.com/?q=1142+W+18th+Street+Chicago+IL"
      : "https://maps.google.com/?q=Eugene+OR",
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Wheelchair Accessible",
        value: true
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Parking Available",
        value: true
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Beginner Friendly",
        value: true
      }
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1"
    }
  };
}

export function activityJsonLd(city: City, section: SectionConfig) {
  const bookingUrl = buildBookingLink(city, section);
  const isChicago = city.param === "chicago";
  
  return {
    "@context": "https://schema.org",
    "@type": ["Course", "Event"],
    name: `${section.heroTitle}`,
    description: section.heroDescription,
    keywords: section.tags.join(", "),
    image: "https://colorcocktailfactory.com/og-image.jpg",
    provider: {
      "@type": "Organization",
      name: "Color Cocktail Factory",
      url: `https://colorcocktailfactory.com/${city.param}`,
      logo: "https://colorcocktailfactory.com/logo.png",
      sameAs: ["https://www.instagram.com/colorcocktailfactory"]
    },
    url: `https://colorcocktailfactory.com/${city.param}/${section.slug}`,
    educationalLevel: "Beginner",
    coursePrerequisites: "None - all skill levels welcome",
    teaches: section.heroTitle,
    numberOfCredits: 0,
    timeRequired: "PT2H",
    inLanguage: "en-US",
    isAccessibleForFree: false,
    offers: {
      "@type": "Offer",
      category: "Workshop",
      availability: "https://schema.org/InStock",
      price: "50.00",
      priceCurrency: "USD",
      url: bookingUrl,
      validFrom: new Date().toISOString().split("T")[0]
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      courseWorkload: "PT2H",
      instructor: {
        "@type": "Person",
        name: "Expert Instructors",
        jobTitle: "Creative Workshop Instructor"
      },
      location: {
        "@type": "Place",
        name: city.locationName,
        address: isChicago
          ? {
              "@type": "PostalAddress",
              streetAddress: "1142 W. 18th Street",
              addressLocality: "Chicago",
              addressRegion: "IL",
              postalCode: "60608",
              addressCountry: "US"
            }
          : city.address
      },
      url: bookingUrl
    },
    audience: {
      "@type": "Audience",
      audienceType: "All ages and skill levels",
      suggestedMinAge: 16
    },
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    organizer: {
      "@type": "Organization",
      name: "Color Cocktail Factory",
      url: `https://colorcocktailfactory.com/${city.param}`
    }
  };
}

/**
 * Generate FAQ structured data for better search appearance
 */
export function faqJsonLd(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a
      }
    }))
  };
}

/**
 * Generate breadcrumb structured data for navigation
 */
export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}
