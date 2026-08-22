import type { EventbriteEvent } from "@/lib/eventbrite";

/**
 * Generate Event Schema (schema.org/Event) for Google Event Rich Results
 * This enables events to appear in Google Search with dates, times, and booking links
 * 
 * Documentation: https://developers.google.com/search/docs/appearance/structured-data/event
 */
export function eventSchemaJsonLd(event: EventbriteEvent, city: "chicago" | "eugene") {
  const startDate = new Date(event.start.local);
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Assume 2-hour duration
  
  const cityData = city === "chicago" 
    ? {
        name: "Color Cocktail Factory - Chicago",
        address: {
          "@type": "PostalAddress",
          streetAddress: "1142 W. 18th Street",
          addressLocality: "Chicago",
          addressRegion: "IL",
          postalCode: "60608",
          addressCountry: "US"
        }
      }
    : {
        name: "Color Cocktail Factory - Eugene",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Eugene",
          addressRegion: "OR",
          addressCountry: "US"
        }
      };

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name.text,
    description: `Join us for ${event.name.text} at Color Cocktail Factory. Hands-on creative workshop with expert guidance. Perfect for all skill levels.`,
    
    // Event timing
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    
    // Event status
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    
    // Location
    location: {
      "@type": "Place",
      ...cityData
    },
    
    // Image
    image: event.logo?.url ? [event.logo.url] : [
      "https://colorcocktailfactory.com/og-image.jpg"
    ],
    
    // Organizer
    organizer: {
      "@type": "Organization",
      name: "Color Cocktail Factory",
      url: "https://colorcocktailfactory.com"
    },
    
    // Offers (booking info)
    offers: {
      "@type": "Offer",
      url: event.url,
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString()
    },
    
    // Performer/instructor
    performer: {
      "@type": "Organization",
      name: "Color Cocktail Factory"
    }
  };
}

/**
 * Generate ItemList schema for events page
 * Helps Google understand the page structure
 */
export function eventsListSchemaJsonLd(events: EventbriteEvent[], city?: "chicago" | "eugene") {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Event",
        name: event.name.text,
        url: event.url,
        startDate: new Date(event.start.local).toISOString()
      }
    }))
  };
}
