"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, Check, ChevronLeft, Clock3, Heart, Leaf, MapPin, Palette, RotateCcw, Share2, Sparkles, UserRound, Users } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { dateBounds, isMatchKey, LOCATIONS, MATCHES, resolveMatch, type MatchKey, type PlayClass, type PlayFilters } from "@/lib/play";
import s from "./CuriosityStudio.module.css";

const BOOKING = "https://colorcocktailfactory.as.me/";
const QUESTIONS = [
  { title: "What’s calling your name?", note: "Go with your first little spark.", options: [
    { value: "clay", title: "A handful of clay", note: "Earthy, squishy possibilities", Icon: Heart },
    { value: "color", title: "A riot of color", note: "Little pieces, big personality", Icon: Palette },
    { value: "green", title: "A tiny green world", note: "Something to grow with", Icon: Leaf },
  ] },
  { title: "How do you like to make?", note: "There’s no right way to be creative.", options: [
    { value: "playful", title: "Let’s get a little messy", note: "Try it. Laugh. Try it again.", Icon: Sparkles },
    { value: "slow", title: "One lovely little detail", note: "Take a breath. Take my time.", Icon: Heart },
  ] },
  { title: "Who’s coming along?", note: "Good company includes yourself.", options: [
    { value: "1", title: "Me, myself & mud", note: "A little creative me-time", Icon: UserRound },
    { value: "2", title: "My favorite person", note: "Something to make together", Icon: Heart },
    { value: "4", title: "The creative crew", note: "A small group, a good story", Icon: Users },
  ] },
];
const GALLERY = [
  { title: "The pleasantly off-center mug", category: "A study in character", note: "Perfectly straight is overrated. That little lean is what makes it yours.", position: "0%", activity: "handbuilding" as MatchKey },
  { title: "The bowl that went its own way", category: "An ode to the wobble", note: "A wavy edge catches the light differently. Sometimes a surprise is the best part.", position: "50%", activity: "wheel" as MatchKey },
  { title: "The very odd little forest", category: "Permission to play", note: "Your imagination doesn’t need a permission slip. Start small. Get wonderfully weird.", position: "100%", activity: "handbuilding" as MatchKey },
];

function Star({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 60 64" fill="none" aria-hidden="true"><path d="m29 4 3 21L52 12 38 31l19 6-23 3 7 20-14-17-17 12 10-21L3 25l22 3L29 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function Wheel({ spinning }: { spinning: boolean }) {
  return <div className={`${s.wheel} ${spinning ? s.spinning : ""}`} aria-hidden="true"><svg viewBox="0 0 320 320" fill="none"><circle cx="160" cy="160" r="148"/><ellipse cx="160" cy="160" rx="139" ry="144" transform="rotate(-18 160 160)"/><circle cx="160" cy="160" r="118"/><ellipse cx="160" cy="160" rx="83" ry="89" transform="rotate(28 160 160)"/><circle cx="160" cy="160" r="54"/><path d="M159 132c42-5 41 55-1 53-31-1-29-44 2-38 17 4 13 27-1 24"/><path d="m158 8 4 26m149 122-24 3M161 310l-2-23M8 160l24-1"/></svg><span>let curiosity<br/>take a turn</span></div>;
}

export default function CuriosityStudio() {
  const [filters, setFilters] = useState<PlayFilters>({ location: "chicago", when: "month", groupSize: 2, budget: null, activity: "any" });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<PlayClass | null>(null);
  const [notice, setNotice] = useState("");
  const [searched, setSearched] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [match, setMatch] = useState<MatchKey | null>(null);
  const [shared, setShared] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [openArtwork, setOpenArtwork] = useState<number | null>(null);
  const request = useRef<AbortController | null>(null);
  const requestNumber = useRef(0);
  const previousClass = useRef<string | null>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const quizHeading = useRef<HTMLHeadingElement>(null);
  const firstQuizRender = useRef(true);
  const bounds = dateBounds(filters.location);

  useEffect(() => {
    const initial = new URL(window.location.href).searchParams.get("match");
    if (isMatchKey(initial)) setMatch(initial);
    return () => { request.current?.abort(); };
  }, []);
  useEffect(() => { if (result) resultHeading.current?.focus({ preventScroll: true }); }, [result]);
  useEffect(() => {
    if (firstQuizRender.current) { firstQuizRender.current = false; return; }
    quizHeading.current?.focus({ preventScroll: true });
  }, [step, match]);

  function changeFilters(patch: Partial<PlayFilters>) {
    request.current?.abort();
    requestNumber.current += 1;
    setBusy(false); setResult(null); setNotice(""); setSearched(false);
    setFilters((current) => ({ ...current, ...patch }));
  }

  async function spin(event: FormEvent) {
    event.preventDefault();
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    const id = ++requestNumber.current;
    setBusy(true); setResult(null); setNotice(""); setSearched(false);
    trackEvent("play_spin", { city: filters.location, activity: filters.activity, group_size: filters.groupSize });
    const timeout = setTimeout(() => controller.abort(), 45_000);
    try {
      const response = await fetch("/api/play/classes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(filters), signal: controller.signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The wheel needs a moment. Please try again.");
      if (id !== requestNumber.current) return;
      const classes = data.classes as PlayClass[];
      if (!classes.length) {
        setNotice("No confirmed match for those choices just yet. Try more dates, another activity, or Any budget. You can also explore the full calendar.");
      } else {
        const different = classes.filter((item) => item.id !== previousClass.current);
        const pool = different.length ? different : classes;
        const selected = pool[Math.floor(Math.random() * pool.length)];
        previousClass.current = selected.id;
        setResult(selected);
        trackEvent("play_match_shown", { city: filters.location, class_id: selected.id });
      }
      setSearched(true);
    } catch (error) {
      if (id !== requestNumber.current) return;
      setNotice(controller.signal.aborted ? "That took a little too long. Please spin again, or open the booking calendar." : (error as Error).message);
      setSearched(true);
    } finally {
      clearTimeout(timeout);
      if (id === requestNumber.current) setBusy(false);
    }
  }

  function applyMatch(value: MatchKey) {
    changeFilters({ activity: value, ...(answers[2] ? { groupSize: Number(answers[2]) } : {}) });
    document.getElementById("find-your-class")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    document.getElementById("activity")?.focus({ preventScroll: true });
  }

  function finishQuiz() {
    if (!answers[step]) return;
    if (step < 2) { setStep(step + 1); return; }
    const key = resolveMatch(answers);
    setMatch(key);
    const url = new URL(window.location.href);
    url.searchParams.set("match", key);
    window.history.replaceState(null, "", url);
    trackEvent("play_quiz_complete", { match: key });
  }

  function resetQuiz() {
    setAnswers([]); setStep(0); setMatch(null); setShared(""); setShareUrl("");
    const url = new URL(window.location.href); url.searchParams.delete("match");
    window.history.replaceState(null, "", url);
  }

  async function shareMatch() {
    if (!match) return;
    const url = new URL("/play", window.location.origin);
    url.searchParams.set("match", match); url.hash = "maker-match";
    const data = { title: MATCHES[match].name, text: "Meet our maker match at Color Cocktail Factory. What should we make together?", url: url.toString() };
    try {
      if (navigator.share) { await navigator.share(data); setShared("Your maker match is ready to share."); }
      else { await navigator.clipboard.writeText(data.url); setShared("Link copied. Send a little creative nudge."); }
      trackEvent("play_share", { match });
    } catch (error) {
      if ((error as Error).name !== "AbortError") { setShareUrl(data.url); setShared("Copy your match link below."); }
    }
  }

  return (
    <main id="main-content" className={s.page}>
      <header className={s.header}>
        <Link href="/" className={s.brand} aria-label="Color Cocktail Factory home"><span className={s.brandMark}>ccf<span>✳</span></span><span>COLOR COCKTAIL<br/>FACTORY</span></Link>
        <nav className={s.nav} aria-label="Curiosity Studio navigation"><a href="#find-your-class">Spin the wheel</a><a href="#maker-match">Find your match</a><a href="#beautiful-mistakes">Happy accidents</a></nav>
        <a className={s.headerBooking} href={BOOKING} target="_blank" rel="noopener noreferrer">Visit the studio <ArrowUpRight size={17}/></a>
      </header>

      <section className={s.hero} aria-labelledby="studio-title">
        <div className={s.heroCopy}>
          <p className={s.eyebrow}><span/> THE CCF CURIOSITY STUDIO</p>
          <h1 id="studio-title">What will you<br/>get your<br/><em>hands into?</em></h1>
          <p className={s.heroIntro}>A little clay. A little curiosity.<br/>Something wonderfully yours.</p>
          <div className={s.heroActions}><a className={s.primary} href="#find-your-class">Let’s find your thing <ArrowRight size={18}/></a><span className={s.handwritten}>no experience.<br/>just a little wonder.</span></div>
          <div className={s.locations}><MapPin size={13}/><Link href="/chicago">Chicago</Link><span>·</span><Link href="/eugene">Eugene</Link><span>·</span><button onClick={() => { changeFilters({ location: "online" }); document.getElementById("find-your-class")?.scrollIntoView(); }}>Your place, online</button></div>
        </div>
        <div className={s.heroArt}>
          <div className={s.artNote}>a few things you<br/>haven’t made yet <span>↘</span></div>
          <Image src="/images/play/studio.webp" alt="A terracotta vase with pencil-drawn flowers, a wonky yellow bowl, colored pencils, and a tiny bonsai" width={1536} height={1024} priority sizes="(max-width: 760px) 100vw, 60vw" className={s.heroImage}/>
          <div className={s.seal}><Star/><span>MADE WITH<br/><b>a little<br/>imperfection</b><br/>AND A LOT OF HEART</span></div>
          <p className={s.artCaption}>a small collection of big possibilities</p>
        </div>
      </section>

      <div className={s.ribbon} aria-label="Studio philosophy"><span>GOOD THINGS BEGIN WITH MESSY HANDS</span><Star/><span>COME CURIOUS. LEAVE A LITTLE DIFFERENT.</span><Star/><span>PERFECT ISN’T THE POINT.</span><Star/></div>

      <section id="find-your-class" className={s.finder} aria-labelledby="finder-title">
        <div className={s.finderIntro}><p className={s.eyebrow}>01 / A LITTLE SERENDIPITY</p><h2 id="finder-title">Less scrolling.<br/><em>More making.</em></h2><p>Leave a little room for the unexpected.<br/>Tell us a few things. We’ll find a real class<br className={s.desktopBreak}/> with a place for your curiosity.</p><div className={s.wheelWrap}><Wheel spinning={busy}/><Star className={s.wheelStar}/><span className={s.wheelNote}>your next good story<br/>starts with a spin ↗</span></div></div>
        <div className={s.finderPaper}>
          <div className={s.paperTop}><span>THE POSSIBILITY GENERATOR</span><span>No. 001</span></div>
          <h3>Spin my weekend.</h3><p className={s.smallIntro}>Or my Tuesday. We’re open to possibilities.</p>
          <form onSubmit={spin}>
            <fieldset className={s.cityField}><legend>Where shall we make?</legend><div className={s.cityOptions}>{Object.entries(LOCATIONS).map(([value, label]) => <label key={value}><input type="radio" name="studio-city" value={value} checked={filters.location === value} onChange={() => changeFilters({ location: value as PlayFilters["location"] })}/><span>{label}{filters.location === value && <Check size={13}/>}</span></label>)}</div></fieldset>
            <div className={s.fields}>
              <label>When’s good?<select value={filters.when} onChange={(e) => changeFilters({ when: e.target.value as PlayFilters["when"] })}><option value="month">Next 30 days</option><option value="weekend">This weekend</option><option value="custom">Choose my dates</option></select></label>
              <label>How many makers?<select value={filters.groupSize} onChange={(e) => changeFilters({ groupSize: Number(e.target.value) })}>{Array.from({ length: 8 }, (_, i) => <option key={i} value={i + 1}>{i + 1 === 1 ? "Just me" : `${i + 1} people`}</option>)}</select></label>
              {filters.when === "custom" && <><label>From<input type="date" required min={bounds.today} max={bounds.lastDay} value={filters.dateFrom ?? ""} onChange={(e) => changeFilters({ dateFrom: e.target.value })}/></label><label>Through<input type="date" required min={filters.dateFrom || bounds.today} max={bounds.lastDay} value={filters.dateTo ?? ""} onChange={(e) => changeFilters({ dateTo: e.target.value })}/></label></>}
              <label>Budget per person<select value={filters.budget ?? "any"} onChange={(e) => changeFilters({ budget: e.target.value === "any" ? null : Number(e.target.value) })}><option value="any">Any budget</option>{[35, 50, 75, 100, 150].map((amount) => <option key={amount} value={amount}>Up to ${amount}</option>)}</select></label>
              <label>A little preference?<select id="activity" value={filters.activity} onChange={(e) => changeFilters({ activity: e.target.value as PlayFilters["activity"] })}><option value="any">Surprise me</option>{Object.entries(MATCHES).map(([key, value]) => <option key={key} value={key}>{value.craft}</option>)}</select></label>
            </div>
            <button className={s.spinButton} type="submit" disabled={busy}><RotateCcw size={19} className={busy ? s.rotating : ""}/>{busy ? "Finding a little possibility…" : result ? "Give it another spin" : "Give it a spin"}<ArrowRight size={18}/></button>
            <p className={s.finePrint}>Real classes. Current availability. A very good use of your hands.</p>
          </form>
          <div aria-live="polite" aria-atomic="true" className={s.liveStatus}>{busy ? "Checking the class schedule for your choices." : searched && !result ? notice : ""}</div>
          {result && <article className={s.result}>
            <p className={s.eyebrow}><Sparkles size={14}/> YOUR LITTLE POSSIBILITY</p><h4 ref={resultHeading} tabIndex={-1}>{result.title}</h4>
            <p className={s.resultMeta}><MapPin size={14}/>{result.locationLabel}{result.durationMinutes && !result.isSeries && <><span>·</span><Clock3 size={14}/>{result.durationMinutes} min</>}</p>
            {result.isSeries && <p className={s.seriesNote}>Multi-session course · This is a scheduled lesson; confirm the course start and enrollment conditions below.</p>}
            <p className={s.resultDate}>{result.nextLocaleTime}</p>
            <p className={s.price}>{result.priceUsd == null ? "See booking calendar for price" : `$${result.priceUsd} per ticket`}{result.ticketCovers != null && <span> · covers {result.ticketCovers} {result.ticketCovers === 1 ? "person" : "people"}</span>}</p>
            {result.groupPrice ? <p className={s.priceDetail}>{result.groupPrice.tickets} {result.groupPrice.tickets === 1 ? "ticket" : "tickets"} for your group of {filters.groupSize}: <strong>${result.groupPrice.total}</strong>{result.isSeries ? " for the course" : ""}, before any checkout fees.</p> : <p className={s.priceDetail}>The listing doesn’t specify ticket coverage. Confirm your group’s ticket quantity and total at checkout.</p>}
            {result.enrollmentNotes.length > 0 && <ul className={s.enrollment}>{result.enrollmentNotes.map((note) => <li key={note}>{note}</li>)}</ul>}
            <a className={s.primary} href={result.bookingUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("play_booking_click", { class_id: result.id, city: filters.location, placement: "spin_result" })}>This feels like me <ArrowUpRight size={18}/></a><p className={s.finePrint}>Opens our booking calendar. Availability can change before checkout.</p>
          </article>}
          {searched && !result && <a className={s.textLink} href={BOOKING} target="_blank" rel="noopener noreferrer">Explore the full class calendar <ArrowUpRight size={16}/></a>}
          <div className={s.paperBottom}><span>More than 8 makers?</span><Link href="/private-events">Make it a private party <ArrowUpRight size={14}/></Link></div>
        </div>
      </section>

      <section id="maker-match" className={s.quiz} aria-labelledby="quiz-title">
        <div className={s.quizIntro}><p className={s.eyebrow}>02 / YOUR KIND OF CREATIVE</p><h2 id="quiz-title">What should we<br/>make <em>together?</em></h2><p>For first dates, old friends, and a little time<br/>with yourself. Three tiny questions.<br/>One lovely place to start.</p><span className={s.quizScribble}>a little less “what do you want to do?”<br/>a little more “let’s do this.”</span><Star className={s.quizStar}/></div>
        <div className={s.quizCard}>
          {match ? <>
            <div className={s.quizCardTop}><span>YOUR MAKER MATCH</span><span>✳</span></div><span className={s.matchMark} aria-hidden="true">{MATCHES[match].mark}</span><h3 ref={quizHeading} tabIndex={-1}>{MATCHES[match].name}</h3><p className={s.matchNote}>{MATCHES[match].note}</p><span className={s.matchCraft}>A little nudge toward {MATCHES[match].craft.toLowerCase()}</span>
            <button className={s.primary} onClick={() => applyMatch(match)}>Find our kind of class <ArrowRight size={17}/></button>
            <div className={s.resultActions}><button onClick={shareMatch}><Share2 size={15}/> Share our match</button><button onClick={resetQuiz}><RotateCcw size={15}/> Start again</button></div><p role="status" className={s.shareStatus}>{shared}</p>{shareUrl && <label className={s.shareFallback}>Your match link<input readOnly value={shareUrl} onFocus={(e) => e.target.select()}/></label>}
          </> : <>
            <div className={s.quizCardTop}><span>A SMALL CREATIVE COMPASS</span><span>0{step + 1} / 03</span></div><div className={s.progress} aria-label={`Question ${step + 1} of 3`}>{[0, 1, 2].map((i) => <span key={i} className={i <= step ? s.progressActive : ""}/>)}</div>
            <h3 ref={quizHeading} tabIndex={-1}>{QUESTIONS[step].title}</h3><p className={s.quizNote}>{QUESTIONS[step].note}</p>
            <div className={s.quizOptions} role="group" aria-label={QUESTIONS[step].title}>{QUESTIONS[step].options.map(({ value, title, note, Icon }) => <button key={value} aria-pressed={answers[step] === value} onClick={() => setAnswers((current) => { const next = [...current]; next[step] = value; return next; })}><span className={s.optionIcon}><Icon size={23} strokeWidth={1.3}/></span><span><b>{title}</b><small>{note}</small></span><span className={s.optionCheck}>{answers[step] === value ? <Check size={15}/> : <ArrowUpRight size={16}/>}</span></button>)}</div>
            <div className={s.quizControls}>{step > 0 ? <button className={s.backButton} onClick={() => setStep(step - 1)}><ChevronLeft size={16}/> Back</button> : <span className={s.quizTime}>A minute, maybe less.</span>}<button className={s.primary} disabled={!answers[step]} onClick={finishQuiz}>{step === 2 ? "Meet our match" : "A little further"}<ArrowRight size={16}/></button></div>
          </>}
        </div>
      </section>

      <section id="beautiful-mistakes" className={s.gallery} aria-labelledby="gallery-title">
        <div className={s.galleryHeading}><div><p className={s.eyebrow}>03 / THE BEAUTY IN THE ALMOST</p><h2 id="gallery-title">Beautifully <em>imperfect.</em></h2></div><p>A small cabinet of happy accidents.<br/>Because the best things have a little character.</p></div>
        <div className={s.galleryGrid}>{GALLERY.map((item, i) => <article key={item.title} className={s.artwork}>
          <div className={s.artworkImage} role="img" aria-label={`Illustrated ${item.title.toLowerCase()}`} style={{ backgroundPosition: `${item.position} center` }}><span>FIG. 0{i + 1}</span></div>
          <p className={s.artworkCategory}>{item.category}</p><h3>{item.title}</h3><button className={s.artworkToggle} aria-expanded={openArtwork === i} aria-controls={`artwork-note-${i}`} onClick={() => setOpenArtwork(openArtwork === i ? null : i)}>{openArtwork === i ? "Tuck this thought away" : "A little lesson in letting go"}<span aria-hidden="true">{openArtwork === i ? "−" : "+"}</span></button>
          {openArtwork === i && <div className={s.artworkNote} id={`artwork-note-${i}`}><p>{item.note}</p><button onClick={() => applyMatch(item.activity)}>Make something your own <ArrowRight size={15}/></button></div>}
        </article>)}</div><p className={s.galleryFootnote}>Illustrated studio daydreams, created for this little corner of the internet. Your own creation will be one of a kind.</p>
      </section>

      <section className={s.closing}><Star/><p>You don’t have to be an artist.<br/><em>You just have to begin.</em></p><a href="#find-your-class" className={s.primary}>Save a little room for play <ArrowRight size={18}/></a><span>See you with clay on your hands.</span></section>
      <div className={s.studioFooter}><Link href="/">A little corner of Color Cocktail Factory</Link><span>CHICAGO · EUGENE · EVERYWHERE, ONLINE</span><a href={BOOKING} target="_blank" rel="noopener noreferrer">Back to all classes <ArrowUpRight size={14}/></a></div>
    </main>
  );
}
