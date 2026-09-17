"use client";

import * as React from "react";
import type { ChatMessage, InquiryDraft } from "./types";

const ROWS: Array<{ key: keyof InquiryDraft; label: string }> = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "city", label: "Location" },
  { key: "preferredDate", label: "Preferred date" },
  { key: "groupSize", label: "Group size" },
  { key: "activity", label: "Activity" },
  { key: "budget", label: "Budget" },
  { key: "notes", label: "Notes" },
];

/**
 * Private-party summary. Nothing is submitted until the customer presses Send,
 * and the confirmation text comes from the server's actual result.
 */
export default function InquiryCard({
  draft,
  state,
  message,
  onSubmit,
}: {
  draft: InquiryDraft;
  state: NonNullable<ChatMessage["draftState"]>;
  message?: string;
  onSubmit: () => void;
}) {
  const rows = ROWS.filter((row) => {
    const value = draft[row.key];
    return typeof value === "string" && value.trim().length > 0;
  });

  return (
    <div className="mt-3 rounded-2xl border border-purple-400/30 bg-purple-500/10 p-3 shadow-glass backdrop-blur-xl">
      <div className="text-xs font-semibold uppercase tracking-wide text-purple-200">
        Private party inquiry
      </div>
      <dl className="mt-2 space-y-1 text-xs">
        {rows.map((row) => (
          <div key={row.key} className="flex gap-2">
            <dt className="w-28 shrink-0 text-white/55">{row.label}</dt>
            <dd className="min-w-0 break-words text-white/90">{draft[row.key]}</dd>
          </div>
        ))}
      </dl>

      {state === "sent" || state === "duplicate" ? (
        <p className="mt-3 text-xs text-emerald-300" role="status">
          {message ?? "Sent — the team has your details."}
        </p>
      ) : (
        <>
          <button
            type="button"
            onClick={onSubmit}
            disabled={state === "sending"}
            className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {state === "sending" ? "Sending…" : state === "failed" ? "Try sending again" : "Send to the team"}
          </button>
          {state === "failed" && message ? (
            <p className="mt-2 text-xs text-amber-300" role="status">
              {message}
            </p>
          ) : (
            <p className="mt-2 text-center text-[11px] text-white/50">
              Nothing is sent until you press Send.
            </p>
          )}
        </>
      )}
    </div>
  );
}
