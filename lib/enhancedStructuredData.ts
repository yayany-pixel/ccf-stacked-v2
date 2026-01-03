/**
 * Enhanced JSON-LD Structured Data for SEO
 * Includes LocalBusiness, Organization, FAQPage, and Event schemas
 */

import type { City, SectionConfig } from "./config";

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Color Cocktail Factory",
    "alternateName": "CCF",
    "url": "https://colorcocktailfactory.com",
    "logo": "https://colorcocktailfactory.com/logo.png",
    "description": "Premium creative workshops and pottery classes in Chicago and Eugene. Expert-led hands-on experiences including pottery, glass art, mosaics, and more.",
    "sameAs": [
      "https://www.instagram.com/colorcocktailfactory",
      "https://www.facebook.com/colorcocktailfactory",
      // Add other social media URLs
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-312-881-9929",
      "contactType": "customer service",
      "email": "support@colorcocktailfactory.com",
      "availableLanguage": "English"
    }
  };
}

/**
 * Generate LocalBusiness schema for city location
 */
export function generateLocalBusinessSchema(city: City) {
  const isChicago = city.param === "chicago";
  
  const chicagoData = {
    streetAddress: "1000 W 35th St",
    addressLocality: "Chicago",
    addressRegion: "IL",
    postalCode: "60609",
    latitude: 41.8307,
    longitude: -87.6567,
    telephone: "+1-312-881-9929",
  };
  
  // Eugene data omitted where not verified - only include known accurate information
  const eugeneData = {
    addressLocality: "Eugene",
    addressRegion: "OR",
    streetAddress: undefined,
    postalCode: undefined,
    latitude: undefined,
    longitude: undefined,
    telephone: undefined,
  };
  
  const locationData = isChicago ? chicagoData : eugeneData;
  
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://colorcocktailfactory.com/${city.param}`,
    "name": `Color Cocktail Factory - ${city.label}`,
    "image": "https://colorcocktailfactory.com/og-image.jpg",
    "description": `Creative workshops and pottery classes in ${city.label}. Expert-led pottery, glass fusion, mosaics, and more. Perfect for date nights and team building.`,
    "address": {
      "@type": "PostalAddress",
      ...(locationData.streetAddress && { "streetAddress": locationData.streetAddress }),
      "addressLocality": locationData.addressLocality,
      "addressRegion": locationData.addressRegion,
      ...(locationData.postalCode && { "postalCode": locationData.postalCode }),
      "addressCountry": "US"
    },
    ...(locationData.latitude && locationData.longitude && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": locationData.latitude,
        "longitude": locationData.longitude
      }
    }),
    "url": `https://colorcocktailfactory.com/${city.param}`,
    ...(locationData.telephone && { "telephone": locationData.telephone }),
    "email": "support@colorcocktailfactory.com",
    "priceRange": "$$",
    // Only include opening hours for Chicago (verified data)
    ...(isChicago && {
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Wednesday", "Thursday", "Friday"],
          "opens": "17:30",
          "closes": "21:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Saturday",
          "opens": "12:00",
          "closes": "21:30"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Sunday",
          "opens": "14:30",
          "closes": "18:30"
        }
      ]
    }),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "paymentAccepted": "Cash, Credit Card, Debit Card",
    "currenciesAccepted": "USD",
    "areaServed": {
      "@type": "City",
      "name": city.label
    }
  };
}

/**
 * Generate FAQPage schema for activity pages
 */
export function generateFAQSchema(section: SectionConfig) {
  if (!section.faqs || section.faqs.length === 0) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": section.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };
}

/**
 * Generate Event schema for workshops
 */
export function generateWorkshopEventSchema(
  city: City, 
  section: SectionConfig,
  date?: string,
  price?: number
) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": section.heroTitle,
    "description": section.heroDescription,
    "image": "https://colorcocktailfactory.com/og-image.jpg",
    "startDate": date || new Date().toISOString(),
    "endDate": date || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": `Color Cocktail Factory - ${city.label}`,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": city.label,
        "addressCountry": "US"
      }
    },
    "offers": {
      "@type": "Offer",
      "url": `https://colorcocktailfactory.com/${city.param}/${section.slug}`,
      "price": price || "50",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString()
    },
    "performer": {
      "@type": "Organization",
      "name": "Color Cocktail Factory"
    },
    "organizer": {
      "@type": "Organization",
      "name": "Color Cocktail Factory",
      "url": "https://colorcocktailfactory.com"
    }
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

/**
 * Generate Course schema for workshop pages
 */
export function generateCourseSchema(city: City, section: SectionConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": section.heroTitle,
    "description": section.heroDescription,
    "provider": {
      "@type": "Organization",
      "name": "Color Cocktail Factory",
      "sameAs": "https://colorcocktailfactory.com"
    },
    "educationalLevel": "Beginner",
    "teaches": section.tags.join(", "),
    "courseCode": section.slug,
    "coursePrerequisites": "None - beginner friendly",
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "onsite",
      "location": {
        "@type": "Place",
        "name": `Color Cocktail Factory - ${city.label}`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city.label,
          "addressCountry": "US"
        }
      }
    }
  };
}
