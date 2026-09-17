/** Shapes exchanged between the Ask CCF widget and its API routes. */

export type ChatRole = "user" | "assistant";

export type ClassCard = {
  id: string;
  title: string;
  location: "chicago" | "eugene" | "online" | "unknown";
  locationLabel: string;
  craft: string | null;
  priceUsd: number | null;
  priceUnit: "per_couple" | "per_ticket";
  ticketCovers: number | null;
  pricingSummary: string;
  durationMinutes: number | null;
  nextLocaleTime: string | null;
  imageUrl: string | null;
  bookingUrl: string;
  enrollmentNotes?: string[];
  isSeries?: boolean;
};

export type InquiryDraft = {
  name: string;
  email: string;
  phone: string | null;
  city: string;
  preferredDate: string | null;
  groupSize: string | null;
  activity: string | null;
  budget: string | null;
  notes: string | null;
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  cards?: ClassCard[];
  draft?: InquiryDraft | null;
  /** Set once a draft has been acted on, so the card cannot be re-sent. */
  draftState?: "pending" | "sending" | "sent" | "duplicate" | "failed";
  draftMessage?: string;
  /** A failed send the customer can retry. */
  failed?: boolean;
};

export type ChatResponse = {
  state: "ok" | "unavailable" | "rate_limited" | "timeout" | "error";
  reply?: string;
  reason?: string;
  cards?: ClassCard[];
  draft?: InquiryDraft | null;
  retryable?: boolean;
};

export type InquiryResponse = {
  status: "received" | "duplicate" | "notify_failed" | "rate_limited" | "invalid" | "error" | "pending";
  message?: string;
  persisted?: boolean;
};
