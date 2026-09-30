"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CatalogClass } from "@/lib/askccf/catalog";
import styles from "./CauldronExperience.module.css";

type Studio = "chicago" | "eugene";
type Props = { classes: CatalogClass[]; catalogAvailable: boolean };
const SCHEDULE = "https://colorcocktailfactory.as.me/";
const CAULDRON_LINK = "https://colorcocktailfactory.as.me/spinaspell";
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const isCauldron = (c: CatalogClass) => /cauldron|caldron|spin[ -]a[ -]spell/i.test(c.title);
const isHandbuilt = (c: CatalogClass) => /hand[ -]?build|kurinuki/i.test(`${c.title} ${c.craft}`);
const isWheel = (c: CatalogClass) => /wheel|throwing/i.test(c.title) && !isHandbuilt(c) && !isCauldron(c);
const isDate = (c: CatalogClass) => /date[ -]?night|for two|couple/i.test(c.title);

function safeImage(value: string | null | undefined): string | undefined {
  if (!value || typeof value !== "string") return undefined;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try { return new URL(value).protocol === "https:" ? value : undefined; } catch { return undefined; }
}
function classLink(c: CatalogClass): string {
  try {
    const url = new URL(c.bookingUrl);
    if (url.protocol === "https:" && ["colorcocktailfactory.as.me", "acuityscheduling.com", "app.acuityscheduling.com"].includes(url.hostname)) return url.href;
  } catch { /* Retain a direct appointment link using the verified catalog ID. */ }
  return /^\d+$/.test(c.id) ? `${SCHEDULE}?appointmentType=${c.id}` : SCHEDULE;
}
function priceLabel(c: CatalogClass): string {
  if (c.pricing.price == null || !Number.isFinite(c.pricing.price)) return "Price shown at booking";
  const unit = c.pricing.covers === 2 ? " / two people" : c.pricing.covers === 1 ? " / person" : " / ticket";
  return `${money.format(c.pricing.price)}${unit}`;
}
function track(event: "cauldron_booking_click" | "cauldron_private_inquiry_click", c?: CatalogClass) {
  const analytics = window as unknown as { gtag?: (...args: unknown[]) => void };
  analytics.gtag?.("event", event, { class_id: c?.id ?? "", location: c?.location ?? "", campaign: "cauldron_factory" });
}
function Arrow() { return <span aria-hidden="true">↗</span>; }
function Star() { return <span aria-hidden="true" className={styles.star}>✦</span>; }

function ClassPhoto({ course, hero = false }: { course?: CatalogClass; hero?: boolean }) {
  const [failed, setFailed] = useState(false);
  const src = safeImage(course?.imageUrl);
  useEffect(() => setFailed(false), [src]);
  if (!src || failed) return <div className={styles.photoFallback} aria-label="Class photograph unavailable"><Star /><span>Made by hand.</span></div>;
  // Preserve the actual Acuity class image; never substitute fabricated work.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={course?.title ?? "Color Cocktail Factory class project"} className={styles.photo} loading={hero ? "eager" : "lazy"} decoding="async" fetchPriority={hero ? "high" : "auto"} onError={() => setFailed(true)} />;
}

/** Open editorial feature: image and text sit directly on the page, not in a card. */
function ClassFeature({ course, label, reverse = false }: { course: CatalogClass; label: string; reverse?: boolean }) {
  return <article className={styles.feature} data-reverse={reverse}>
    <a className={styles.featureImage} href={classLink(course)} aria-label={`View ${course.title}`} onClick={() => track("cauldron_booking_click", course)}><ClassPhoto course={course} /></a>
    <div className={styles.featureCopy}>
      <p className={styles.eyebrow}>{label}</p>
      <h3>{course.title}</h3>
      {course.shortDescription && <p className={styles.description}>{course.shortDescription}</p>}
      <p className={styles.price}>{priceLabel(course)}</p>
      <p className={styles.details}>{course.locationLabel}{course.durationMinutes != null && <> · {course.durationMinutes} minutes</>}</p>
      <a className={styles.bookLink} href={classLink(course)} aria-label={`See dates and book ${course.title}`} onClick={() => track("cauldron_booking_click", course)}>See dates & book <Arrow /></a>
    </div>
  </article>;
}

/** Compact, aligned catalog row. Prices and booking are visible without hover. */
function ClassRow({ course }: { course: CatalogClass }) {
  return <article className={styles.classRow}>
    <a className={styles.rowImage} href={classLink(course)} aria-label={`View ${course.title}`} onClick={() => track("cauldron_booking_click", course)}><ClassPhoto course={course} /></a>
    <div className={styles.rowTitle}><h3><a href={classLink(course)} onClick={() => track("cauldron_booking_click", course)}>{course.title}</a></h3><p>{course.craft} · {course.locationLabel}{course.durationMinutes != null && <> · {course.durationMinutes} min</>}</p></div>
    <p className={styles.rowPrice}>{priceLabel(course)}</p>
    <a className={styles.rowBook} href={classLink(course)} aria-label={`Book ${course.title}`} onClick={() => track("cauldron_booking_click", course)}>Book <Arrow /></a>
  </article>;
}

/** Synthesized, low-volume fire texture, off until a user explicitly enables it. */
function useFireAmbience() {
  const context = useRef<AudioContext | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const generation = useRef(0);
  const [on, setOn] = useState(false);
  const [message, setMessage] = useState("");
  const stop = useCallback(() => {
    generation.current += 1;
    if (timer.current != null) clearInterval(timer.current);
    timer.current = null;
    const previous = context.current;
    context.current = null;
    if (previous && previous.state !== "closed") void previous.close().catch(() => {});
    setOn(false);
  }, []);
  useEffect(() => {
    const hide = () => { if (document.hidden) stop(); };
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("pagehide", stop);
    return () => { document.removeEventListener("visibilitychange", hide); window.removeEventListener("pagehide", stop); stop(); };
  }, [stop]);
  const toggle = async () => {
    if (context.current) { stop(); return; }
    setMessage("");
    const token = ++generation.current;
    try {
      const Audio = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Audio) throw new Error("unsupported");
      const ctx = new Audio();
      context.current = ctx;
      await ctx.resume();
      if (generation.current !== token || document.hidden) { if (ctx.state !== "closed") await ctx.close(); return; }
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
      const samples = buffer.getChannelData(0);
      let previous = 0;
      for (let i = 0; i < samples.length; i++) { previous = (previous + (Math.random() * 2 - 1) * 0.02) / 1.02; samples[i] = previous * 3.5; }
      const source = ctx.createBufferSource(); source.buffer = buffer; source.loop = true;
      const low = ctx.createBiquadFilter(); low.type = "lowpass"; low.frequency.value = 750;
      const gain = ctx.createGain(); gain.gain.setValueAtTime(0, ctx.currentTime); gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 1.2);
      source.connect(low); low.connect(gain); gain.connect(ctx.destination); source.start();
      timer.current = setInterval(() => {
        if (ctx.state !== "running") return;
        const crackle = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.045), ctx.sampleRate);
        const data = crackle.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.005));
        const pop = ctx.createBufferSource(); pop.buffer = crackle;
        const volume = ctx.createGain(); volume.gain.value = 0.008 + Math.random() * 0.015;
        pop.connect(volume); volume.connect(ctx.destination); pop.onended = () => { pop.disconnect(); volume.disconnect(); }; pop.start();
      }, 700);
      setOn(true);
    } catch { stop(); setMessage("Sound is unavailable in this browser. You can still explore and book classes."); }
  };
  return { on, toggle, message };
}

export default function CauldronExperience({ classes, catalogAvailable }: Props) {
  const [studio, setStudio] = useState<Studio>("chicago");
  const [query, setQuery] = useState("");
  const [craft, setCraft] = useState("All");
  const [effects, setEffects] = useState(true);
  const ambience = useFireAmbience();
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("city") === "eugene") setStudio("eugene");
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setEffects(!media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);
    return () => media.removeEventListener("change", updateMotion);
  }, []);
  const publicClasses = useMemo(() => classes.filter(c => c.kind !== "service" && !c.isPrivateSession), [classes]);
  const local = publicClasses.filter(c => c.location === studio);
  const cauldrons = local.filter(isCauldron);
  const featured = cauldrons.find(c => safeImage(c.imageUrl)) ?? cauldrons[0];
  const heroClass = featured ?? publicClasses.find(c => c.location === "chicago" && isCauldron(c));
  const heroCity = heroClass?.location === "eugene" ? "Eugene" : "Chicago";
  const dateWheel = local.find(c => isDate(c) && isWheel(c));
  const dateHand = local.find(c => isDate(c) && isHandbuilt(c));
  const handOption = dateHand ?? local.find(c => isHandbuilt(c) && !isCauldron(c));
  const wheel = local.filter(c => isWheel(c) && c.id !== dateWheel?.id);
  const wheelFeature = wheel.find(c => /beginner/i.test(c.title)) ?? wheel[0];
  const wheelRest = wheel.filter(c => c.id !== wheelFeature?.id);
  const alreadyShown = new Set([heroClass?.id, dateWheel?.id, handOption?.id, ...wheel.map(c => c.id)].filter(Boolean));
  const others = local.filter(c => !alreadyShown.has(c.id));
  const craftOptions = ["All", ...Array.from(new Set(others.map(c => c.craft))).sort()];
  const filtered = others.filter(c => (craft === "All" || c.craft === craft) && `${c.title} ${c.craft}`.toLowerCase().includes(query.toLowerCase().trim()));
  const online = publicClasses.filter(c => c.location === "online");
  const partyPhoto = classes.find(c => c.isPrivateSession && c.location === studio && safeImage(c.imageUrl)) ?? heroClass;
  const hasMissingLocation = publicClasses.some(c => c.location === "unknown");
  const changeStudio = (value: Studio) => {
    setStudio(value); setCraft("All"); setQuery("");
    const url = new URL(window.location.href); url.searchParams.set("city", value);
    window.history.replaceState(window.history.state, "", url);
  };
  const empty = (label: string) => <div className={styles.empty}><h3>{label}</h3><p>See available sessions and current prices in our booking calendar.</p><a className={styles.bookLink} href={SCHEDULE}>Open the calendar <Arrow /></a></div>;

  return <main id="main-content" className={styles.page} data-effects={effects ? "on" : "off"} data-design="seamless-v2">
    <div className={styles.reviewBar}>DESIGN PREVIEW · 02 <span>Your current homepage is unchanged.</span><Link href="/">Current site <Arrow /></Link></div>
    <header className={styles.header}>
      <Link href="/cauldron" className={styles.wordmark}>THE CAULDRON<br /><span>FACTORY</span></Link>
      <nav className={styles.navigation} aria-label="Cauldron page"><a href="#cauldron">Cauldron</a><a href="#date-night">Date night</a><a href="#private-parties">Private parties</a><a href="#wheel-throwing">Wheel throwing</a><a href="#all-classes">All classes</a></nav>
      <div className={styles.citySwitch} role="group" aria-label="Choose a studio"><button type="button" aria-pressed={studio === "chicago"} onClick={() => changeStudio("chicago")}>Chicago</button><button type="button" aria-pressed={studio === "eugene"} onClick={() => changeStudio("eugene")}>Eugene</button></div>
    </header>

    <section id="cauldron" className={styles.hero} aria-labelledby="cauldron-heading">
      <div className={styles.firelight} aria-hidden="true" /><div className={styles.embers} aria-hidden="true"><i /><i /><i /><i /></div>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}><Star /> A LITTLE CLAY. A LITTLE MAGIC.</p>
        <h1 id="cauldron-heading"><small>THE</small>CAULDRON<br /><em>FACTORY</em></h1>
        <p className={styles.heroSubtitle}>Make your own clay cauldron.</p>
        <p className={styles.byline}>A pottery experience by <Link href="/">Color Cocktail Factory.</Link></p>
        <p className={styles.heroIntro}>Shape a cauldron of your own. Bring a date, gather your friends, or come for a little creative escape.</p>
        <div className={styles.heroFacts}>{heroClass && <strong>{priceLabel(heroClass)}</strong>}<span>{heroCity}{heroCity === "Chicago" ? " · Pilsen" : ""}</span>{heroClass?.durationMinutes != null && <span>{heroClass.durationMinutes} minutes</span>}</div>
        {studio === "eugene" && !featured && <p className={styles.notice}>This cauldron experience is in Chicago. Eugene classes are listed below.</p>}
        <div className={styles.actions}><a className={styles.primary} href={heroClass ? classLink(heroClass) : CAULDRON_LINK} onClick={() => track("cauldron_booking_click", heroClass)}>Book the cauldron class <Arrow /></a><a className={styles.textLink} href="#all-classes">Explore all classes <Arrow /></a></div>
        <div className={styles.ambience}><button type="button" onClick={() => void ambience.toggle()} aria-pressed={ambience.on}>{ambience.on ? "Mute fire ambience" : "Turn on fire ambience"}</button><button type="button" onClick={() => setEffects(!effects)} aria-pressed={effects}>{effects ? "Pause atmosphere" : "Enable atmosphere"}</button></div>
        {ambience.message && <p className={styles.notice} role="status">{ambience.message}</p>}
      </div>
      <figure className={styles.heroArt}><div className={styles.heroImage}><ClassPhoto course={heroClass} hero /><div className={styles.imageGlow} aria-hidden="true" /></div><figcaption>SHAPED BY YOU. ENTIRELY YOUR OWN.</figcaption></figure>
    </section>

    {!catalogAvailable && <div className={styles.catalogNotice} role="status">Class details are temporarily unavailable here. <a href={SCHEDULE}>See current prices and sessions in Acuity.</a></div>}
    <section id="date-night" className={styles.section} aria-labelledby="date-heading">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>01 / TOGETHER, BY HAND</p><h2 id="date-heading">Date Night Pottery</h2></div><p>Two ways to make something together.<br />Choose the wheel or hand-building.</p></div>
      {dateWheel ? <ClassFeature course={dateWheel} label="ON THE WHEEL" /> : empty("Date night on the wheel")}
      {handOption ? <ClassFeature course={handOption} label={dateHand ? "BY HAND" : "HAND-BUILDING · PUBLIC CLASS"} reverse /> : empty("Hand-building pottery")}
      {!dateHand && handOption && <p className={styles.finePrint}>The hand-building option is a public class, not a separate two-person package. Check ticket coverage when booking.</p>}
    </section>

    <section id="private-parties" className={styles.party} aria-labelledby="party-heading">
      <div className={styles.partyImage}><ClassPhoto course={partyPhoto} /></div>
      <div className={styles.partyCopy}><p className={styles.eyebrow}>02 / GATHER YOUR PEOPLE</p><h2 id="party-heading">Private Parties</h2><p className={styles.partyLead}>Your people.<br />A little shared magic.</p><p>Birthdays, bachelorettes, team outings, and celebrations. Ask about a private cauldron party, wheel throwing, hand-building, or another creative experience.</p><Link className={styles.primary} href="/private-events" onClick={() => track("cauldron_private_inquiry_click")}>Plan your private party <Arrow /></Link><span className={styles.partyNote}>Start with your date, group size, and preferred studio.</span></div>
    </section>

    <section id="wheel-throwing" className={styles.section} aria-labelledby="wheel-heading">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>03 / FIND YOUR SPIN</p><h2 id="wheel-heading">Wheel Throwing</h2></div><p>Choose a project.<br />See what takes shape.</p></div>
      {wheelFeature ? <ClassFeature course={wheelFeature} label="AT THE POTTERY WHEEL" /> : empty("Wheel throwing sessions")}
      {wheelRest.length > 0 && <div className={styles.classList} aria-label="More wheel-throwing classes">{wheelRest.map(c => <ClassRow key={c.id} course={c} />)}</div>}
    </section>

    <section id="all-classes" className={styles.section} aria-labelledby="all-heading">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>04 / KEEP CREATING</p><h2 id="all-heading">All Other Classes</h2></div><p>Explore the rest of the studio.<br />Every booking link goes to its specific class.</p></div>
      <div className={styles.filters}><label>Search classes<input value={query} onChange={e => setQuery(e.target.value)} type="search" placeholder="Mosaic, painting, bonsai…" /></label><label>Activity<select value={craft} onChange={e => setCraft(e.target.value)}>{craftOptions.map(value => <option key={value}>{value}</option>)}</select></label><p aria-live="polite">{filtered.length} {filtered.length === 1 ? "class" : "classes"} · {studio === "chicago" ? "Chicago" : "Eugene"}</p></div>
      <div className={styles.listHeader} aria-hidden="true"><span>CLASS</span><span>PRICE</span><span>RESERVE</span></div>
      <div className={styles.classList}>{filtered.length ? filtered.map(c => <ClassRow key={c.id} course={c} />) : empty(query || craft !== "All" ? "No matching classes" : "Explore the full calendar")}</div>
      <p className={styles.finePrint}>Acuity confirms the final price, ticket coverage, and any finishing options. {hasMissingLocation && <>Listings without a confirmed studio are available in the complete calendar. </>}<a href={SCHEDULE}>View the complete calendar <Arrow /></a></p>
    </section>

    <section className={`${styles.section} ${styles.atHome}`} aria-labelledby="home-heading"><div><p className={styles.eyebrow}>BEYOND THE STUDIO</p><h2 id="home-heading">Pottery at Home</h2><p>Explore live online classes, or get in touch about your next creative idea.</p><div className={styles.actions}><a className={styles.bookLink} href="https://colorcocktailfactory.as.me/onlinewheelthrowing">Explore online pottery <Arrow /></a><a className={styles.textLink} href="https://www.instagram.com/colorcocktailfactory">Contact us <Arrow /></a></div></div>{online.length > 0 && <div className={styles.onlineList}>{online.map(c => <a key={c.id} href={classLink(c)} onClick={() => track("cauldron_booking_click", c)}><span>{c.title}<small>{priceLabel(c)}</small></span><Arrow /></a>)}</div>}</section>
    <section className={`${styles.section} ${styles.practical}`} aria-labelledby="practical-heading"><div><p className={styles.eyebrow}>THE PRACTICAL DETAILS</p><h2 id="practical-heading">Before You Book</h2></div><div><details><summary>What is included, and when is pickup?</summary><p>Your class listing explains materials, finishing options, additional charges, and pickup timing. Same-day take-home or Halloween pickup is not guaranteed unless your session explicitly says so.</p>{heroClass?.pickupNotes.slice(0, 4).map((note, i) => <p key={i}>{note}</p>)}</details><details><summary>Which studio am I booking?</summary><p>Each class shows its studio. Use the Chicago / Eugene controls above, and confirm the address in Acuity. Online classes are listed separately.</p></details><details><summary>Can I ask a question first?</summary><p>Use Ask CCF on this page, <a href="https://www.instagram.com/colorcocktailfactory">message us</a>, or use the <Link href="/private-events">private-party inquiry</Link> for a group.</p></details></div></section>
    <div className={styles.endNote}><Star /><span>CREATIVITY IS SHAREABLE.</span><Link href="/">Color Cocktail Factory <Arrow /></Link></div>
  </main>;
}
