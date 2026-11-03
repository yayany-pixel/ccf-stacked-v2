"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { appendPartyAttribution, capturePartyAttribution } from "@/lib/partyFormAttribution";
import type { CityParam } from "@/lib/config";
import { trackEvent, trackPrivatePartyLead, groupSizeRange } from "@/lib/analytics";
import { metaMatchContext, newMetaEventId } from "@/lib/metaPixel";
import { KIDS_SCHEDULE } from "@/lib/kids";
import { STUDIO_LOCATIONS } from "@/lib/locations";
import styles from "./Kids.module.css";

export default function KidsInquiryForm({ city, birthday }: { city: CityParam; birthday: boolean }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [submitted, setSubmitted] = useState({ date: "", time: "" });
  const started = useRef(false);
  const sending = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const label = STUDIO_LOCATIONS[city].label;
  const formName = birthday ? "private-party" : "kids-class-interest";
  useEffect(() => { capturePartyAttribution(); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true;
    setStatus("sending");
    const data = new FormData(event.currentTarget);
    // Keep attribution separate from family details; never send form values to analytics.
    appendPartyAttribution(data);
    const metaEventId = birthday ? newMetaEventId() : undefined;
    const match = birthday ? metaMatchContext() : null;
    if (metaEventId && match) {
      data.set("meta_form_name", formName);
      data.set("meta_event_id", metaEventId);
      data.set("meta_context", JSON.stringify(match));
    }
    const body = new URLSearchParams();
    data.forEach((value, key) => { if (typeof value === "string") body.set(key, value); });
    try {
      const response = await fetch("/netlify-forms.html", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
      if (!response.ok) throw new Error("Submission failed");
      setSubmitted({ date: String(data.get("date") ?? ""), time: String(data.get("preferredTime") ?? "") });
      setStatus("success");
      if (!data.get("bot-field")) {
        trackEvent(birthday ? "kids_birthday_inquiry_submitted" : "kids_class_interest_submitted", { city, form_name: formName, placement: "kids_campaign" });
        if (birthday) trackPrivatePartyLead({ city, form_name: formName, lead_type: "kids_birthday", placement: "kids_campaign", group_size_range: groupSizeRange(String(data.get("groupSize") ?? "")) }, metaEventId);
      }
      requestAnimationFrame(() => resultRef.current?.focus());
    } catch {
      setStatus("error");
      sending.current = false;
    }
  }
  if (status === "success") return <div ref={resultRef} tabIndex={-1} role="status" className={styles.success}>
    <h3>{birthday ? "Thanks for your birthday request." : "Thanks for your interest."}</h3>
    <p>{birthday ? `Your request is for ${label}${submitted.date ? ` on ${submitted.date}` : ""}${submitted.time ? ` at ${submitted.time} ${KIDS_SCHEDULE[city].zone}` : ""}. Your date is not reserved yet. Our team will review your group details and follow up with availability and a quote.` : `You’ve requested ${label} kids class announcements. We’ll share dates and booking details when sessions are ready. This is not a class reservation.`}</p>
    <p>Questions? <a href="mailto:support@colorcocktailfactory.com">Email our studio team</a>.</p>
  </div>;
  return <form name={formName} method="POST" action="/netlify-forms.html" data-netlify="true" data-netlify-honeypot="bot-field" data-clarity-mask="true" onSubmit={submit} className={styles.form} onFocusCapture={() => {
    if (!started.current) { started.current = true; trackEvent("kids_inquiry_started", { city, form_name: formName, placement: "kids_campaign" }); }
  }}>
    <input type="hidden" name="form-name" value={formName} />
    <input type="hidden" name="city" value={label} />
    <input type="hidden" name="source" value="direct" /><input type="hidden" name="campaign" value="kids_launch" />
    <p hidden><label>Leave this blank<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
    {birthday && <input type="hidden" name="occasion" value="Kids birthday party" />}
    <p className={styles.formCity}>For the <strong>{label}</strong> studio · Times are {KIDS_SCHEDULE[city].zone}</p>
    <fieldset disabled={status === "sending"}>
      <legend className={styles.srOnly}>{birthday ? "Birthday inquiry" : "Class announcements"}</legend>
      <label>Parent or guardian name<input name="name" autoComplete="name" maxLength={120} required /></label>
      <label>Email<input type="email" name="email" autoComplete="email" maxLength={200} required /></label>
      {birthday && <>
        <label>Phone <span>(optional)</span><input name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
        <label className="min-w-0">Preferred date<input className="min-w-0 w-full" name="date" type="date" required /></label>
        <label className="min-w-0">Alternate date <span>(optional)</span><input className="min-w-0 w-full" name="alternateDate" type="date" /></label>
        <label className="min-w-0">Preferred time <span>(optional, {KIDS_SCHEDULE[city].zone})</span><input className="min-w-0 w-full" name="preferredTime" type="time" /></label>
        <label>Number of children<input name="groupSize" type="number" min="1" max="50" required /></label>
        <label>Number of adults attending<input name="adultCount" type="number" min="1" max="50" required /></label>
      </>}
      <label>Children’s age range{birthday ? "" : " (optional)"}<input name="ageRange" placeholder="For example, ages 8 to 10" maxLength={60} required={birthday} /></label>
      <label>{birthday ? "Preferred project" : "I’m interested in"}<select name={birthday ? "preferredProject" : "interest"} required defaultValue="">
        <option value="" disabled>Choose an option</option>
        <option value="Kids pottery wheel">Kids pottery wheel</option>
        <option value="Clay Creatures handbuilding">Clay Creatures handbuilding</option>
        <option value="Help me choose">Help me choose</option>
      </select></label>
      {birthday && <>
        <label>Birthday package<select name="budget" required defaultValue=""><option value="" disabled>Choose a package</option><option value="$350 regular — up to 10 children, pieces go home unfired">$350 regular — take home unfired</option><option value="$450 with firing — up to 10 children, 10 pieces total max">$450 with firing — 10 pieces total max</option><option value="Custom quote — larger group or extra pieces">Larger group / extra pieces — request quote</option></select></label>
        <label>How did you hear about us? <span>(optional)</span><input name="referral" maxLength={120} /></label>
      </>}
      <label className={styles.full}>Anything else? <span>(optional)</span><textarea name="details" maxLength={2000} rows={3} placeholder={birthday ? "Share date flexibility, cake plans or questions. Please leave out children’s full names and sensitive personal details." : "Tell us which times or projects you’re interested in. Please leave out children’s full names and sensitive personal details."} /></label>
      {!birthday && <label className={`${styles.full} ${styles.check}`}><input type="checkbox" name="consent" value="Kids class announcements requested" required /><span>I’m a parent or guardian and would like emails about {label} kids classes. I can ask to stop these updates at any time.</span></label>}
      <p className={`${styles.full} ${styles.note}`}>{birthday ? "This sends an inquiry, not a reservation. Packages cover up to 10 children: $350 with pieces taken home unfired, or $450 with firing for up to 10 pieces total. We’ll confirm your date, project, duration, supervision and any requested extras before booking." : "The schedule is proposed. Dates, prices and booking details will be confirmed before enrollment opens."}</p>
      <button className={`${styles.button} ${styles.full}`} type="submit">{status === "sending" ? "Sending…" : birthday ? "Request a Birthday Date" : `Get ${label} Class Updates`}</button>
    </fieldset>
    {status === "error" && <p role="alert" className={styles.error}>Your request could not be sent. Please try again or email <a href="mailto:support@colorcocktailfactory.com">support@colorcocktailfactory.com</a>.</p>}
  </form>;
}
