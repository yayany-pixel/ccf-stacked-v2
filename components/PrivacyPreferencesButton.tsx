"use client";

import { OPEN_PRIVACY_EVENT } from "@/lib/privacy";

export default function PrivacyPreferencesButton() {
  return <button type="button" className="rounded hover:text-purple-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" onClick={() => window.dispatchEvent(new Event(OPEN_PRIVACY_EVENT))}>Privacy preferences</button>;
}
