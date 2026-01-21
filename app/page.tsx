import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";
import { generateOrganizationSchema } from "@/lib/enhancedStructuredData";

export const metadata: Metadata = {
  title: "Color Cocktail Factory | Pottery & Creative Workshops in Chicago & Eugene",
  description: "Choose your location: Expert-guided pottery, glass fusion, mosaics & more in Chicago (Pilsen) and Eugene, Oregon. BYOB, beginner-friendly creative experiences.",
  keywords: [
    "pottery classes",
    "pottery classes chicago",
    "pottery classes eugene",
    "creative workshops",
    "art classes chicago",
    "art classes eugene",
    "date night pottery",
    "team building chicago",
    "team building eugene",
    "glass fusion",
    "mosaic classes",
    "pottery studio chicago",
    "pottery studio eugene"
  ],
  alternates: {
    canonical: "https://colorcocktailfactory.com/"
  },
  openGraph: {
    title: "Color Cocktail Factory | Pottery & Creative Workshops",
    description: "Expert-guided pottery, glass fusion, mosaics & more in Chicago & Eugene. BYOB, beginner-friendly.",
    url: "https://colorcocktailfactory.com/",
    type: "website",
    images: [
      {
        url: "https://colorcocktailfactory.com/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Color Cocktail Factory"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Cocktail Factory | Pottery & Creative Workshops",
    description: "Expert-guided pottery, glass fusion, mosaics & more in Chicago & Eugene."
  }
};

export default function HomePage() {
  // Organization schema with both locations
  const organizationSchema = generateOrganizationSchema();
  
  // Multi-location business schema
  const multiLocationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://colorcocktailfactory.com/#organization",
    "name": "Color Cocktail Factory",
    "alternateName": "CCF",
    "url": "https://colorcocktailfactory.com",
    "logo": "https://colorcocktailfactory.com/logo.png",
    "description": "Creative workshops and pottery classes in Chicago and Eugene. Expert-led hands-on experiences including pottery, glass art, mosaics, and more.",
    "slogan": "Creativity is shareable.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-312-881-9929",
      "contactType": "customer service",
      "email": "support@colorcocktailfactory.com",
      "availableLanguage": "English"
    },
    "location": [
      {
        "@type": "LocalBusiness",
        "@id": "https://colorcocktailfactory.com/chicago#localbusiness",
        "name": "Color Cocktail Factory - Chicago",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "1142 W. 18th Street",
          "addressLocality": "Chicago",
          "addressRegion": "IL",
          "postalCode": "60608",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 41.8577,
          "longitude": -87.6698
        },
        "telephone": "+1-312-881-9929",
        "url": "https://colorcocktailfactory.com/chicago",
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
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://colorcocktailfactory.com/eugene#localbusiness",
        "name": "Color Cocktail Factory - Eugene",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "123 Main St",
          "addressLocality": "Eugene",
          "addressRegion": "OR",
          "postalCode": "97401",
          "addressCountry": "US"
        },
        "telephone": "+1-312-881-9929",
        "url": "https://colorcocktailfactory.com/eugene"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(multiLocationSchema) }}
      />
      
      {/* Week 2: Use client component for A/B testing + analytics */}
      <HomePageClient />
    </>
  );
}

