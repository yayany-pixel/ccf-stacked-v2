"use client";

import * as React from "react";
import { trackBeginCheckout, trackEvent } from "@/lib/analytics";
import type { ClassCard } from "./types";

/**
 * Booking cards for classes the assistant recommended. Every value here comes
 * from the live booking system via the chat API — the model never supplies
 * prices, links or images.
 */
export default function ClassCards({ cards }: { cards: ClassCard[] }) {
  if (cards.length === 0) return null;

  return (
    <ul className="mt-3 space-y-3" aria-label="Recommended classes">
      {cards.map((card) => (
        <li
          key={card.id}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-glass backdrop-blur-xl"
        >
          {card.imageUrl && /^https:\/\//.test(card.imageUrl) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={card.imageUrl}
              alt={card.title}
              loading="lazy"
              className="h-28 w-full object-cover"
            />
          ) : null}
          <div className="p-3">
            <div className="text-sm font-semibold leading-snug text-white">{card.title}</div>
            <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-white/60">
              <span>{card.locationLabel}</span>
              {card.durationMinutes ? <span>• {card.durationMinutes} min{card.isSeries ? " total across the course" : ""}</span> : null}
              {card.nextLocaleTime ? <span>• {card.isSeries ? "Next lesson" : "Next class"}: {card.nextLocaleTime}</span> : null}
            </div>
            <div className="mt-2 text-xs text-white/80">{card.pricingSummary}</div>
            {card.enrollmentNotes?.map((note, i) => <p key={i} className="mt-2 text-xs text-amber-200">{note}</p>)}
            <a
              href={card.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent("ask_ccf_recommendation_click", {
                  class_id: card.id,
                  city: card.location,
                });
                trackBeginCheckout({
                  city: card.location,
                  class_category: card.craft ?? "workshop",
                  class_name: card.title,
                  class_id: card.id,
                  link_url: card.bookingUrl,
                });
              }}
              className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Check dates &amp; book
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
