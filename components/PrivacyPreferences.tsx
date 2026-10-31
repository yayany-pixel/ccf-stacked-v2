"use client";

import { useEffect, useRef, useState } from "react";
import { updateAnalyticsConsent } from "@/lib/analytics";
import {
  DENIED_PREFERENCES, OPEN_PRIVACY_EVENT, PRIVACY_EVENT,
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
  const [banner, setBanner] = useState(false);
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
    const initialPrefs = { ...DENIED_PREFERENCES };
    applyPreferences(initialPrefs);
    setChoices(initialPrefs);
    fetch("/api/privacy", { cache: "no-store", signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error("unavailable");
        const payload = await response.json();
        if (!active || choiceVersion.current !== 0) return;
        const saved = parsePrivacyPreferences(payload.preferences);
        if (saved) {
          const effective = privacySignalDenied() ? { ...DENIED_PREFERENCES } : saved;
          setChoices(effective);
          applyPreferences(effective);
        } else {
          setBanner(true);
        }
      })
      .catch(() => {
        if (active && choiceVersion.current === 0) {
          setBanner(true);
          setError("Your saved choices could not be loaded. Optional tracking stays off.");
        }
      })
      .finally(() => window.clearTimeout(timeout));
    return () => { active = false; controller.abort(); window.clearTimeout(timeout); };
  }, []);

  useEffect(() => {
    const open = () => {
      setError("");
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
      setBanner(false);
      dialog.current?.close();
    } catch {
      setError("Your choices could not be saved. No additional tracking was enabled. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {banner && <section className={styles.banner} aria-labelledby="privacy-banner-title">
        <h2 id="privacy-banner-title">Cookies</h2>
        <p>Essential cookies keep the site working. Optional cookies and analytics help us improve your visit and measure ads.</p>
        {signalDenied && <p>Your browser has asked us to keep optional tracking off.</p>}
        <div className={styles.actions}>
          <button type="button" disabled={saving} onClick={() => save(DENIED_PREFERENCES)}>Reject optional</button>
          <button type="button" disabled={saving || signalDenied} onClick={() => save({ analytics: true, marketing: true })}>Accept all</button>
          <button type="button" disabled={saving} onClick={() => { setChoices(currentPrivacyPreferences()); dialog.current?.showModal(); }}>Settings</button>
        </div>
        {error && !dialog.current?.open && <p role="alert" className={styles.error}>{error}</p>}
      </section>}
      <dialog ref={dialog} className={styles.dialog} aria-labelledby="privacy-dialog-title" aria-describedby="privacy-dialog-description" onCancel={event => { if (saving) event.preventDefault(); }}>
        <div className={styles.dialogHeader}>
          <h2 id="privacy-dialog-title">Cookie settings</h2>
          <button type="button" className={styles.close} disabled={saving} aria-label="Close cookie settings" onClick={() => dialog.current?.close()}>×</button>
        </div>
        <p id="privacy-dialog-description">Essential cookies are always on. You control the rest.</p>
        {signalDenied && <p>Your browser has asked us to keep optional tracking off.</p>}
        <fieldset disabled={saving || signalDenied} className={styles.options}>
          <legend className={styles.srOnly}>Optional cookies and analytics</legend>
          <label><input type="checkbox" checked={choices.analytics} onChange={event => setChoices(previous => ({ ...previous, analytics: event.target.checked }))} />
            <span><strong>Analytics</strong><span>Understand visits and improve the site.</span></span>
          </label>
          <label><input type="checkbox" checked={choices.marketing} onChange={event => setChoices(previous => ({ ...previous, marketing: event.target.checked }))} />
            <span><strong>Advertising</strong><span>Measure how our ads perform.</span></span>
          </label>
        </fieldset>
        <details className={styles.details}>
          <summary>Cookie details</summary>
          <p>Optional cookies and similar tools stay off until you allow them. Analytics includes Microsoft Clarity heatmaps and session replays of clicks and scrolling; form entries and studio chat are masked. Advertising lets Google Ads and Meta measure ad results.</p>
          <p>We remember your choice for 180 days. Change it anytime using Cookie settings in the footer. <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer">Microsoft Privacy Statement</a>.</p>
        </details>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <button type="button" disabled={saving} onClick={() => save(choices)}>{saving ? "Saving…" : "Save choices"}</button>
          <button type="button" disabled={saving} onClick={() => save(DENIED_PREFERENCES)}>Reject optional</button>
        </div>
      </dialog>
    </>
  );
}
