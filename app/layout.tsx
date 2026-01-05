import type { Metadata } from "next";
import "./globals.css";
import { generateOrganizationSchema } from "@/lib/enhancedStructuredData";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MetaPixel from "@/components/MetaPixel";
import Footer from "@/components/Footer";
import PrivatePartyCTA from "@/components/PrivatePartyCTA";

export const metadata: Metadata = {
  title: {
    default: "Color Cocktail Factory — Premium Creative Workshops in Chicago & Eugene | Pottery, Glass Art & More",
    template: "%s | Color Cocktail Factory"
  },
  description:
    "Book unique, hands-on creative workshops in Chicago & Eugene. Expert-led pottery classes, wheel throwing, Turkish lamp making, glass fusion, mosaics, bonsai, candle making & more. Perfect for date nights, team building, birthdays, and bachelorette parties. Same-day availability. Beginner-friendly.",
  keywords: [
    // Chicago-specific SEO
    "pottery classes Chicago",
    "pottery classes Pilsen Chicago",
    "art classes Chicago",
    "date night ideas Chicago",
    "things to do in Chicago",
    "pottery wheel Chicago",
    "creative workshops Chicago",
    "team building Chicago",
    "bachelorette party Chicago",
    "art studio Chicago",
    "pottery studio Pilsen",
    "glass art classes Chicago",
    "mosaic workshop Chicago",
    // Eugene-specific SEO
    "pottery classes Eugene Oregon",
    "art classes Eugene OR",
    "pottery classes Eugene",
    "things to do in Eugene",
    "date night Eugene",
    "creative workshops Eugene",
    "pottery wheel Eugene",
    "art studio Eugene",
    "downtown Eugene art classes",
    "Eugene pottery studio",
    // Activity-specific
    "pottery wheel workshop",
    "beginner pottery class",
    "wheel throwing class",
    "handbuilding pottery",
    "date night pottery",
    "couples pottery class",
    "Turkish lamp making",
    "glass fusion classes",
    "mosaic workshop",
    "bonsai class",
    "terrarium workshop",
    "candle making class",
    "watercolor painting class",
    // Intent-based keywords
    "creative workshops near me",
    "pottery classes near me",
    "art classes near me",
    "team building activities",
    "corporate team building",
    "private event venue",
    "bachelorette party ideas",
    "birthday party activities",
    "gift cards for experiences",
    "experience gifts",
    "art and craft classes",
    "same day pottery class",
    "walk-in pottery class"
  ],
  metadataBase: new URL("https://colorcocktailfactory.com"),
  openGraph: {
    title: "Color Cocktail Factory — Creative Workshops in Chicago & Eugene",
    description:
      "Join expert-led pottery, glass art, and creative workshops. Perfect for beginners, couples, and groups. Book your hands-on art experience today!",
    type: "website",
    siteName: "Color Cocktail Factory",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Color Cocktail Factory Creative Workshops"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Cocktail Factory — Creative Workshops",
    description: "Premium pottery, glass art & creative workshops in Chicago and Eugene",
    images: ["/og-image.jpg"]
  },
  robots: { 
    index: true, 
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  alternates: {
    canonical: "https://colorcocktailfactory.com"
  },
  verification: {
    google: "your-google-verification-code",
    // Add other verification codes as needed
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgSchema = generateOrganizationSchema();
  
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#1a1a2e" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body>
        <GoogleAnalytics />
        <MetaPixel />
        {/* Skip to main content link for keyboard navigation */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Skip to main content
        </a>
        {children}
        <Footer />
        <PrivatePartyCTA variant="sticky" />
      </body>
    </html>
  );
}
