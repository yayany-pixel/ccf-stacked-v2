"use client";

import { useEffect, useRef, useState } from "react";
import { updateAnalyticsConsent } from "@/lib/analytics";
import {
  DEFAULT_PREFERENCES, DENIED_PREFERENCES, OPEN_PRIVACY_EVENT, PRIVACY_EVENT,
  currentPrivacyPreferences, googleConsentState, parsePrivacyPreferences, privacySignalDenied,
  type PrivacyPreferences as Preferences,
} from "@/lib/privacy";
import styles from "./PrivacyPreferences.module.css";

function applyPreferences(preferences: Preferences) {
  const effective = privacySignalDenied() ? { ...DENIED_PREFERENCES } : preferences;
  window.ccfPrivacyPreferences = effective;
  updateAnalyticsConsent(googleConsentState(effective));
  window.dispatchEvent(new Event(PRIVACY_EVENT));
}

export default function PrivacyPreferences() {
  const [choices, setChoices] = useState<Preferences>({ ...DENIED_PREFERENCES });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [signalDenied, setSignalDenied] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const choiceVersion = useRef(0);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    setSignalDenied(privacySignalDenied());
    applyPreferences(DENIED_PREFERENCES);
    fetch("/api/privacy", { cache: "no-store", signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error("unavailable");
        const payload = await response.json();
        if (!active || choiceVersion.current !== 0) return;
        const saved = parsePrivacyPreferences(payload.preferences) ?? (payload.preferences === null ? DEFAULT_PREFERENCES : null);
        if (!saved) throw new Error("invalid_preferences");
        const effective = privacySignalDenied() ? { ...DENIED_PREFERENCES } : saved;
        setChoices(effective);
        applyPreferences(effective);
      })
      .catch(() => {
        if (active && choiceVersion.current === 0) {
          setError("Your saved choices could not be loaded. Optional tracking stays off.");
        }
      })
      .finally(() => window.clearTimeout(timeout));
    return () => { active = false; controller.abort(); window.clearTimeout(timeout); };
  }, []);

  useEffect(() => {
    const open = () => {
      setChoices(currentPrivacyPreferences());
      if (!dialog.current?.open) dialog.current?.showModal();
    };
    window.addEventListener(OPEN_PRIVACY_EVENT, open);
    return () => window.removeEventListener(OPEN_PRIVACY_EVENT, open);
  }, []);

  async function save(preferences: Preferences) {
    if (saving) return;
    choiceVersion.current += 1;
    const next = privacySignalDenied() ? { ...DENIED_PREFERENCES } : preferences;
    const current = window.ccfPrivacyPreferences ?? DENIED_PREFERENCES;
    applyPreferences({ analytics: current.analytics && next.analytics, marketing: current.marketing && next.marketing });
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/privacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error("unavailable");
      const saved = parsePrivacyPreferences((await response.json()).preferences);
      if (!saved) throw new Error("invalid_preferences");
      applyPreferences(saved);
      setChoices(saved);
      dialog.current?.close();
    } catch {
      setError("Your choices could not be saved. No additional tracking was enabled. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const explanation = "Essential features stay on. Google Analytics measures visits by default. You can turn analytics off below. Google Ads and Meta advertising tracking stays off unless you enable it. Your choices are saved for 180 days using an essential preference cookie and an anonymous record.";

  return (
    <>
      <dialog ref={dialog} className={styles.dialog} aria-labelledby="privacy-dialog-title" aria-describedby="privacy-dialog-description" onCancel={event => { if (saving) event.preventDefault(); }}>
        <p className={styles.eyebrow}>Your visit. Your choice.</p>
        <h2 id="privacy-dialog-title">Privacy preferences</h2>
        <p id="privacy-dialog-description">{explanation} You can change your choices anytime using the footer’s Privacy preferences button.</p>
        {signalDenied && <p>We respect your browser’s privacy signal. Optional tracking stays off.</p>}
        <fieldset disabled={saving || signalDenied} className={styles.options}>
          <legend>Optional tracking</legend>
          <label><input type="checkbox" checked={choices.analytics} onChange={event => setChoices(previous => ({ ...previous, analytics: event.target.checked }))} />
            <span><strong>Analytics</strong><span>Help us understand which workshops and pages visitors find useful.</span></span>
          </label>
          <label><input type="checkbox" checked={choices.marketing} onChange={event => setChoices(previous => ({ ...previous, marketing: event.target.checked }))} />
            <span><strong>Advertising</strong><span>Allow Google Ads and Meta to measure advertising and conversions.</span></span>
          </label>
        </fieldset>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <button type="button" disabled={saving} onClick={() => save(choices)}>{saving ? "Saving…" : "Save choices"}</button>
          <button type="button" disabled={saving} onClick={() => save(DENIED_PREFERENCES)}>Reject optional</button>
          <button type="button" disabled={saving} onClick={() => dialog.current?.close()}>Close</button>
        </div>
      </dialog>
    </>
  );
}
