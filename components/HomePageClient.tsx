"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import BrandLogo from "@/components/BrandLogo";
import { classImageLoader } from "@/lib/classImageLoader";
import Link from "next/link";
import PrivateEventFormCard from "@/components/PrivateEventFormCard";
import { useScrollDepth } from "@/lib/analyticsHooks";
import { trackBeginCheckout, trackEvent } from "@/lib/analytics";
import { getCityByParam } from "@/lib/links";
import { STUDIO_LOCATIONS } from "@/lib/locations";
import { activitiesForCity, formatNextSession, priceLabel } from "@/lib/homepage/data";
import type { HomepageActivity, HomepageCity, HomepageData } from "@/lib/homepage/types";
import styles from "./HomePageClient.module.css";

function ActivityCard({ activity, first = false }: { activity: HomepageActivity; first?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const photo = activity.image;
  if (!photo || !activity.bookingUrl) return null;
  return (
    <article className={styles.card} data-activity={activity.key} data-appointment-id={activity.appointmentTypeId}>
      <div className={styles.photo}>
        {imageFailed ? <p className={styles.imageError}>This photograph is temporarily unavailable.</p> : (
          <Image src={photo.path} alt={photo.alt} width={photo.width} height={photo.height}
            loader={props => classImageLoader({ ...props, width: Math.min(props.width, photo.width) })}
            sizes="(min-width: 900px) 560px, (min-width: 680px) 640px, calc(100vw - 32px)"
            priority={first} loading={first ? "eager" : "lazy"}
            style={{ objectPosition: photo.focalPosition }} onError={() => setImageFailed(true)} />
        )}
      </div>
      <div className={styles.cardBody}>
        {activity.mode === "online" && <p className={styles.eyebrow}>Live Online · Join from home</p>}
        {activity.adultThemed && <p className={styles.eyebrow}>Adult-themed · {activity.ageRestriction ?? "Check age policy at booking"}</p>}
        <h2>{activity.title}</h2>
        <p className={styles.description}>{activity.description}</p>
        <div className={styles.facts} aria-live="polite">
          <p className={styles.price}>
            {activity.formerPrice && activity.currentPrice !== null && activity.formerPrice.amount > activity.currentPrice && activity.formerPrice.evidence && <del aria-label="Verified former price">${activity.formerPrice.amount} </del>}
            {priceLabel(activity)}
          </p>
          <p className={styles.nextDate}>{formatNextSession(activity)}</p>
        </div>
        <a href={activity.bookingUrl} className={styles.bookButton}
          aria-label={`Choose a date for ${activity.title} — ${activity.city === "online" ? "Live Online" : STUDIO_LOCATIONS[activity.city === "eugene" ? "eugene" : "chicago"].label}`}
          onClick={() => trackBeginCheckout({ city: activity.city, class_name: activity.title, class_id: String(activity.appointmentTypeId), booking_provider: "acuity", link_url: activity.bookingUrl! })}
        >Choose a date <span aria-hidden="true">→</span></a>
      </div>
    </article>
  );
}

export default function HomePageClient({ initialData, initialCity = "chicago" }: { initialData: HomepageData; initialCity?: HomepageCity }) {
  useScrollDepth();
  const [city, setCity] = useState<HomepageCity>(initialCity);
  const [data, setData] = useState(initialData);
  const [visibleCount, setVisibleCount] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshFailed, setRefreshFailed] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const revealAnchor = useRef<string | null>(null);

  const selectCity = useCallback((nextCity: HomepageCity, remember = true) => {
    setCity(nextCity);
    setVisibleCount(10);
    setAnnouncement(`Showing ${STUDIO_LOCATIONS[nextCity].label} workshops.`);
    if (remember) {
      try { localStorage.setItem("preferredCity", nextCity); localStorage.setItem("ccf-city", nextCity); } catch {}
      const url = new URL(window.location.href);
      url.searchParams.set("location", nextCity);
      window.history.replaceState(window.history.state, "", url);
      window.dispatchEvent(new Event("ccf-city-change"));
      trackEvent("city_selected", { city: nextCity, placement: "homepage" });
    }
  }, []);

  useEffect(() => {
    const restoreCity = () => {
      const query = new URLSearchParams(window.location.search).get("location");
      if (query === "chicago" || query === "eugene") { selectCity(query); return; }
      try {
        const stored = localStorage.getItem("preferredCity") ?? localStorage.getItem("ccf-city");
        if (stored === "chicago" || stored === "eugene") selectCity(stored, false);
      } catch {}
    };
    restoreCity();
    setHydrated(true);
    window.addEventListener("popstate", restoreCity);
    return () => window.removeEventListener("popstate", restoreCity);
  }, [selectCity]);

  useEffect(() => {
    let controller: AbortController | null = null;
    let active = true;
    const refresh = async () => {
      if (document.hidden) return;
      controller?.abort();
      controller = new AbortController();
      const requestController = controller;
      const timeout = window.setTimeout(() => requestController.abort(), 20000);
      setRefreshing(true);
      try {
        const response = await fetch("/api/homepage", { signal: requestController.signal });
        if (!response.ok) throw new Error("Homepage data unavailable");
        const nextData: HomepageData = await response.json();
        if (!Array.isArray(nextData.activities)) throw new Error("Invalid homepage data");
        if (active && controller === requestController) {
          setData(nextData);
          setRefreshFailed(nextData.catalogState === "unavailable" || nextData.availabilityState === "unavailable");
        }
      } catch {
        if (active && controller === requestController) {
          setRefreshFailed(true);
          setData(previous => ({ ...previous, activities: previous.activities.map(activity => ({ ...activity, currentPrice: null, nextAvailability: null, availabilityState: "unavailable" })) }));
        }
      } finally {
        window.clearTimeout(timeout);
        if (active && controller === requestController) setRefreshing(false);
      }
    };
    void refresh();
    const interval = window.setInterval(refresh, 120000);
    document.addEventListener("visibilitychange", refresh);
    return () => { active = false; controller?.abort(); window.clearInterval(interval); document.removeEventListener("visibilitychange", refresh); };
  }, []);

  const activities = activitiesForCity(data.activities, city);
  const visible = activities.slice(0, visibleCount);
  const studio = STUDIO_LOCATIONS[city];

  useEffect(() => {
    if (!revealAnchor.current) return;
    document.querySelector<HTMLElement>(`[data-activity="${revealAnchor.current}"]`)?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });
    revealAnchor.current = null;
  }, [visibleCount]);

  const showMore = () => {
    const count = Math.min(10, activities.length - visibleCount);
    revealAnchor.current = activities[visibleCount]?.key ?? null;
    setVisibleCount(previous => previous + count);
    setAnnouncement(`${count} more workshops added. ${Math.min(visibleCount + count, activities.length)} workshops shown.`);
    trackEvent("homepage_show_more", { city, visible_count: visibleCount + count });
  };

  return (
    <div className={`studio-home ${styles.home}`}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand} aria-label="Color Cocktail Factory home">
            <BrandLogo className={styles.brandMark} />
            <span>Color Cocktail<span>Factory</span></span>
          </Link>
          <nav className={styles.desktopNav} aria-label="Main navigation"><a href="#classes">Classes</a><a href="#private-party">Private parties</a><Link href="/gift-cards">Gift cards</Link></nav>
          <div className={styles.headerActions}>
            <div className={styles.citySelector} role="group" aria-label="Choose your studio">
              {(["chicago", "eugene"] as const).map(option => <button key={option} type="button" disabled={!hydrated} aria-pressed={city === option} onClick={() => selectCity(option)}>{STUDIO_LOCATIONS[option].label}</button>)}
            </div>
            <details className={styles.menu}>
              <summary aria-label="Open navigation menu"><span aria-hidden="true">☰</span><span className={styles.menuLabel}>Menu</span></summary>
              <nav aria-label="More navigation" onClick={event => { if ((event.target as HTMLElement).closest("a")) event.currentTarget.closest("details")?.removeAttribute("open"); }}>
                <a href="#classes">All classes</a><a href="#private-party">Private parties</a><Link href="/gift-cards">Gift cards</Link>
                <Link href="/blog">Studio journal</Link><Link href="/teach">Teach with us</Link><Link href={`/${city}`}>{studio.label} studio</Link>
                <Link href={`/${city}/paper-pigment`}>Pigment Lab</Link><Link href="/activities/date-night-wheel">Date night pottery</Link><Link href="/activities/mosaic">Mosaics & glass</Link><Link href="/activities/bonsai">Bonsai</Link>
                <div id="home-help" />
              </nav>
            </details>
          </div>
        </div>
      </header>
      <main id="main-content" className={styles.main}>
        <div className={styles.intro}><h1>The future is <em>handmade...</em></h1><p>Come make something together.</p></div>
        <div className={styles.feed} id="classes" aria-label={`${studio.label} creative workshops`}>
          {visible.slice(0, 2).map((activity, index) => <ActivityCard key={activity.key} activity={activity} first={index === 0} />)}
          <section id="private-party" className={styles.party} aria-labelledby="private-party-title">
            <div className={styles.partyIntro}><p className={styles.eyebrow}>Your people. Your kind of party.</p><h2 id="private-party-title">Make it a <em>private party.</em></h2><p>Birthdays, team-building, bachelorettes, and creative get-togethers.</p></div>
            <PrivateEventFormCard city={getCityByParam(city)} timeWindows={[]} variant="homepage" onCityChange={selectCity} />
          </section>
          {visible.slice(2).map(activity => <ActivityCard key={activity.key} activity={activity} />)}
        </div>
        {visibleCount < activities.length && <div className={styles.more}><button type="button" disabled={!hydrated} onClick={showMore}>Show me more</button><p>{visible.length} of {activities.length} workshops</p></div>}
        <p role="status" className="sr-only">{announcement}</p>
        <section className={styles.studioInfo} aria-label="Selected studio">
          <p className={styles.eyebrow}>Meet us at the studio</p><h2>{studio.label}{city === "chicago" ? ", Pilsen" : ", Oregon"}</h2><p>{studio.address}</p>
          <p className={styles.dataStatus}>{refreshing ? "Checking current class details…" : refreshFailed || data.catalogState === "unavailable" || data.availabilityState === "unavailable" ? "Some live details are temporarily unavailable. Choose a date to check the studio’s current schedule." : "Prices and upcoming sessions come from the studio’s booking calendar. Your studio’s local time is shown."}</p>
          <Link href="/gift-cards">Give a little creative time <span aria-hidden="true">↗</span></Link>
        </section>
      </main>
    </div>
  );
}
