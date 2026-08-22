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
  metadataBase: new URL("https://colorcocktailfactory.com"),
  openGraph: {
    title: "Color Cocktail Factory — Creative Workshops in Chicago & Eugene",
    description:
      "Join expert-led pottery, glass art, and creative workshops. Perfect for beginners, couples, and groups. Book your hands-on art experience today!",
    type: "website",
    siteName: "Color Cocktail Factory",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Cocktail Factory — Creative Workshops",
    description: "Premium pottery, glass art & creative workshops in Chicago and Eugene"
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
