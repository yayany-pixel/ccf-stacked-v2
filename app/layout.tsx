import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Color Cocktail Factory — Premium Creative Workshops | Pottery, Glass Art & More",
    template: "%s | Color Cocktail Factory"
  },
  description:
    "Book unique, hands-on creative workshops in Chicago and Eugene. Expert-led pottery classes, Turkish lamp making, glass fusion, mosaics, bonsai, candle making, watercolor painting & more. Perfect for date nights, team building, and gifts. Same-day availability.",
  keywords: [
    "pottery classes Chicago",
    "pottery classes Eugene",
    "pottery wheel workshop",
    "date night pottery",
    "Turkish lamp making",
    "glass fusion classes",
    "mosaic workshop",
    "creative workshops near me",
    "art classes Chicago",
    "art classes Eugene",
    "team building activities",
    "bachelorette party ideas",
    "candle making class",
    "watercolor painting class",
    "gift cards for experiences",
    "handbuilding pottery",
    "bonsai class",
    "terrarium workshop",
    "private event venue",
    "corporate team building"
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
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#1a1a2e" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
