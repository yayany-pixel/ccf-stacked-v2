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
  } catch { /* Use the verified catalog ID rather than an unsafe URL. */ }
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
  if (!src || failed) return <div className={styles.photoFallback}><Star /><span>Made by hand.<br />Entirely your own.</span></div>;
  // Acuity owns these image URLs. Use the original photo, not a stock or AI substitute.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={course?.title ?? "Color Cocktail Factory class project"} className={styles.photo} loading={hero ? "eager" : "lazy"} decoding="async" fetchPriority={hero ? "high" : "auto"} onError={() => setFailed(true)} />;
}
function ClassCard({ course, eyebrow }: { course: CatalogClass; eyebrow?: string }) {
  return <article className={styles.card}>
    <a className={styles.cardImage} href={classLink(course)} onClick={() => track("cauldron_booking_click", course)} aria-label={`Book ${course.title}`}><ClassPhoto course={course} /><span className={styles.imageArrow}><Arrow /></span></a>
    <div className={styles.cardBody}>
      <p className={styles.eyebrow}>{eyebrow ?? course.craft}</p>
      <h3>{course.title}</h3>
      {course.shortDescription && <p className={styles.description}>{course.shortDescription}</p>}
      <div className={styles.cardMeta}><span>{priceLabel(course)}</span>{course.durationMinutes != null && <span>{course.durationMinutes} min</span>}</div>
      <p className={styles.location}>{course.locationLabel}</p>
      <a className={styles.textLink} href={classLink(course)} onClick={() => track("cauldron_booking_click", course)}>See dates & book <Arrow /></a>
    </div>
  </article>;
}

/** Synthesized, low-volume fireplace texture. Never starts without a user gesture. */
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
    } catch { stop(); setMessage("Sound is unavailable in this browser. The page still works without it."); }
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
    setEffects(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  const publicClasses = useMemo(() => classes.filter(c => c.kind !== "service" && !c.isPrivateSession), [classes]);
  const local = publicClasses.filter(c => c.location === studio);
  const cauldrons = local.filter(isCauldron);
  const featured = cauldrons.find(c => safeImage(c.imageUrl)) ?? cauldrons[0];
  const chicagoCauldron = publicClasses.find(c => c.location === "chicago" && isCauldron(c));
  const heroClass = featured ?? chicagoCauldron;
  const heroCity = heroClass?.location === "eugene" ? "Eugene" : "Chicago";
  const dateWheel = local.find(c => isDate(c) && isWheel(c));
  const dateHand = local.find(c => isDate(c) && isHandbuilt(c));
  const handOption = dateHand ?? local.find(c => isHandbuilt(c) && !isCauldron(c));
  const wheel = local.filter(c => isWheel(c) && c.id !== dateWheel?.id);
  const alreadyShown = new Set([heroClass?.id, dateWheel?.id, handOption?.id, ...wheel.map(c => c.id)].filter(Boolean));
  const others = local.filter(c => !alreadyShown.has(c.id));
  const craftOptions = ["All", ...Array.from(new Set(others.map(c => c.craft))).sort()];
  const filtered = others.filter(c => (craft === "All" || c.craft === craft) && `${c.title} ${c.craft}`.toLowerCase().includes(query.toLowerCase().trim()));
  const online = publicClasses.filter(c => c.location === "online");
  const partyPhoto = classes.find(c => c.isPrivateSession && c.location === studio && safeImage(c.imageUrl)) ?? heroClass;
  const hasMissingLocation = publicClasses.some(c => c.location === "unknown");
  const changeStudio = (value: Studio) => { setStudio(value); setCraft("All"); setQuery(""); const url = new URL(window.location.href); url.searchParams.set("city", value); window.history.replaceState(null, "", url); };
  const empty = (label: string) => <div className={styles.empty}><h3>{label}</h3><p>Available sessions and current prices are shown in our booking calendar.</p><a className={styles.textLink} href={SCHEDULE}>Open the booking calendar <Arrow /></a></div>;

  return <main id="main-content" className={styles.page} data-effects={effects ? "on" : "off"}>
    <div className={styles.reviewBar}>HOMEPAGE REVIEW <span>The current homepage has not been replaced.</span><Link href="/">View current site <Arrow /></Link></div>
    <header className={styles.header}>
      <Link href="/cauldron" className={styles.wordmark}>THE CAULDRON<br /><span>FACTORY</span></Link>
      <nav className={styles.navigation} aria-label="Cauldron page"><a href="#cauldron">Cauldron</a><a href="#date-night">Date night</a><a href="#private-parties">Private parties</a><a href="#wheel-throwing">Wheel throwing</a><a href="#all-classes">All classes</a></nav>
      <div className={styles.citySwitch} role="group" aria-label="Choose a studio"><button type="button" aria-pressed={studio === "chicago"} onClick={() => changeStudio("chicago")}>Chicago</button><button type="button" aria-pressed={studio === "eugene"} onClick={() => changeStudio("eugene")}>Eugene</button></div>
    </header>

    <section id="cauldron" className={styles.hero} aria-labelledby="cauldron-heading">
      <div className={styles.firelight} aria-hidden="true" /><div className={styles.embers} aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}><Star /> A LITTLE CLAY. A LITTLE MAGIC.</p>
        <h1 id="cauldron-heading">THE<br />CAULDRON<br /><em>FACTORY</em></h1>
        <p className={styles.heroSubtitle}>Make your own clay cauldron.</p>
        <p className={styles.byline}>A pottery experience by <Link href="/">Color Cocktail Factory.</Link></p>
        <p className={styles.heroIntro}>A curious night out. Clay-covered hands. A cauldron with a character all its own. Bring a friend, bring a date, and make a little magic together.</p>
        <div className={styles.heroFacts}><span>{heroCity}{heroCity === "Chicago" ? " · Pilsen" : ""}</span>{heroClass && <><span>{priceLabel(heroClass)}</span>{heroClass.durationMinutes != null && <span>{heroClass.durationMinutes} minutes</span>}</>}</div>
        {studio === "eugene" && !featured && <p className={styles.notice}>This featured cauldron experience is in Chicago. Eugene classes are shown below.</p>}
        <div className={styles.actions}><a className={styles.primary} href={heroClass ? classLink(heroClass) : CAULDRON_LINK} onClick={() => track("cauldron_booking_click", heroClass)}>Book the cauldron class <Arrow /></a><a className={styles.secondary} href="#private-parties">Bring your group <Arrow /></a></div>
        <div className={styles.ambience}><button type="button" onClick={() => void ambience.toggle()} aria-pressed={ambience.on}>{ambience.on ? "Ⅱ Mute fire ambience" : "♪ Turn on fire ambience"}</button><button type="button" onClick={() => setEffects(!effects)} aria-pressed={effects}>{effects ? "Pause atmosphere" : "Enable atmosphere"}</button></div>
        {ambience.message && <p className={styles.notice} role="status">{ambience.message}</p>}
      </div>
      <figure className={styles.heroArt}><div className={styles.orbit} aria-hidden="true" /><div className={styles.heroImage}><ClassPhoto course={heroClass} hero /><div className={styles.imageGlow} aria-hidden="true" /></div><figcaption><span>SHAPED BY YOU</span><Star /><span>NOT QUITE LIKE ANY OTHER</span></figcaption></figure>
      <a className={styles.scrollHint} href="#date-night">There is more to make <span aria-hidden="true">↓</span></a>
    </section>
    <div className={styles.ribbon} aria-hidden="true"><span>CLAY</span><Star /><span>COMPANY</span><Star /><span>A LITTLE MISCHIEF</span><Star /><span>SOMETHING YOU MADE YOURSELF</span></div>
    {!catalogAvailable && <div className={styles.catalogNotice} role="status">The live class catalog could not be loaded. Prices and class cards are intentionally not invented. <a href={SCHEDULE}>Check the booking calendar.</a></div>}

    <section id="date-night" className={styles.section} aria-labelledby="date-heading"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>01 / MAKE SOMETHING TOGETHER</p><h2 id="date-heading">A date with<br /><em>a little more character.</em></h2></div><p>Choose the wheel or work by hand. The best part is making something side by side.</p></div>
      <div className={styles.twoGrid}>{dateWheel ? <ClassCard course={dateWheel} eyebrow="DATE NIGHT / WHEEL THROWING" /> : empty("Date night on the wheel")}{handOption ? <ClassCard course={handOption} eyebrow={dateHand ? "DATE NIGHT / HAND-BUILDING" : "HAND-BUILDING / ANOTHER WAY TO MAKE TOGETHER"} /> : empty("Hand-building pottery")}</div>
      {!dateHand && handOption && <p className={styles.finePrint}>This hand-building option is a public class, not a separate couple-priced package. Ticket coverage is shown on its card and in Acuity.</p>}
    </section>

    <section id="private-parties" className={styles.party} aria-labelledby="party-heading"><div className={styles.partyImage}><ClassPhoto course={partyPhoto} /></div><div className={styles.partyCopy}><p className={styles.eyebrow}>02 / GATHER YOUR PEOPLE</p><h2 id="party-heading">Your circle.<br /><em>Your kind of magic.</em></h2><p>Birthdays, bachelorettes, team outings, or simply a reason to get everyone together. Make your next gathering a hands-on creative experience.</p><p>Ask about a private cauldron party, wheel throwing, hand-building, and the other experiences at Color Cocktail Factory.</p><Link className={styles.primary} href="/private-events" onClick={() => track("cauldron_private_inquiry_click")}>Plan a private party <Arrow /></Link><span className={styles.partyNote}>Tell us your date, group size, and preferred studio.</span></div></section>

    <section id="wheel-throwing" className={styles.section} aria-labelledby="wheel-heading"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>03 / FIND YOUR SPIN</p><h2 id="wheel-heading">Meet the wheel.<br /><em>See what takes shape.</em></h2></div><p>Explore wheel-throwing sessions and choose the project that catches your eye.</p></div><div className={styles.threeGrid}>{wheel.length ? wheel.map(c => <ClassCard key={c.id} course={c} />) : empty("Wheel throwing")}</div></section>

    <section id="all-classes" className={`${styles.section} ${styles.otherSection}`} aria-labelledby="all-heading"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>04 / FOLLOW YOUR CURIOSITY</p><h2 id="all-heading">Not every spell<br /><em>starts with clay.</em></h2></div><p>The rest of our creative lineup, with prices and links straight to each class in Acuity.</p></div>
      <div className={styles.filters}><label>Find a class<input value={query} onChange={e => setQuery(e.target.value)} type="search" placeholder="Try mosaic, painting, bonsai…" /></label><label>Choose a craft<select value={craft} onChange={e => setCraft(e.target.value)}>{craftOptions.map(value => <option key={value}>{value}</option>)}</select></label><p aria-live="polite">{filtered.length} {filtered.length === 1 ? "class" : "classes"} · {studio === "chicago" ? "Chicago" : "Eugene"}</p></div>
      <div className={styles.threeGrid}>{filtered.length ? filtered.map(c => <ClassCard key={c.id} course={c} />) : empty(query || craft !== "All" ? "No classes match this filter" : "Explore the full calendar")}</div>
      <p className={styles.finePrint}>Prices come from the current class catalog and may change. Acuity confirms your chosen date, ticket coverage, any finishing options, and final total. {hasMissingLocation && <>Classes without a confirmed studio location remain in the booking calendar rather than being assigned to a city here. </>}<a href={SCHEDULE}>Open the complete calendar <Arrow /></a></p>
    </section>

    <section className={styles.atHome} aria-labelledby="home-heading"><div><p className={styles.eyebrow}>COLOR COCKTAIL FACTORY / BEYOND THE STUDIO</p><h2 id="home-heading">A little creativity.<br /><em>Wherever you are.</em></h2><p>Explore our live online classes, or get in touch about your next creative idea.</p><div className={styles.actions}><a className={styles.secondary} href="https://colorcocktailfactory.as.me/onlinewheelthrowing">Pottery at home <Arrow /></a><a className={styles.textLink} href="https://www.instagram.com/colorcocktailfactory">Contact us on Instagram <Arrow /></a></div></div>{online.length > 0 && <div className={styles.onlineList}>{online.map(c => <a key={c.id} href={classLink(c)} onClick={() => track("cauldron_booking_click", c)}><span>{c.title}<small>{priceLabel(c)}</small></span><Arrow /></a>)}</div>}</section>
    <section className={styles.practical} aria-labelledby="practical-heading"><p className={styles.eyebrow}>BEFORE YOU BOOK</p><h2 id="practical-heading">A few practical things.</h2><details><summary>What is included, and when can I pick up my piece?</summary><p>Check your chosen class listing for materials, finishing options, additional charges, and pickup timing. We do not promise same-day take-home or Halloween pickup unless your specific session says so.</p>{heroClass?.pickupNotes.slice(0, 4).map((note, i) => <p key={i}>{note}</p>)}</details><details><summary>Which studio am I booking?</summary><p>Each class card shows its location. Use the Chicago / Eugene controls above, and confirm the location and address in Acuity before paying. Online classes are listed separately.</p></details><details><summary>Can I ask a question before booking?</summary><p>Use the existing Ask CCF chat on this page, or <a href="https://www.instagram.com/colorcocktailfactory">message Color Cocktail Factory</a>. For groups, use the <Link href="/private-events">private-event inquiry</Link>.</p></details></section>
    <div className={styles.endNote}><Star /><span>CREATIVITY IS SHAREABLE.</span><Link href="/">Color Cocktail Factory <Arrow /></Link></div>
  </main>;
}
