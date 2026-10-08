"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import BrandLogo from "@/components/BrandLogo";
import { classImageLoader } from "@/lib/classImageLoader";
import Link from "next/link";
import PrivateEventFormCard from "@/components/PrivateEventFormCard";
import { useScrollDepth } from "@/lib/analyticsHooks";
import { trackEvent, trackBeginCheckout, trackCardView, trackCardSelect, trackShowMore, trackCitySelection, metaContent, isGtagAvailable } from "@/lib/analytics";
import { trackMetaViewContent } from "@/lib/metaPixel";
import { getCityByParam } from "@/lib/links";
import { STUDIO_LOCATIONS } from "@/lib/locations";
import { activitiesForCity, formatNextSession, priceLabel, HOMEPAGE_FILTERS, matchesHomepageFilter, type HomepageFilter } from "@/lib/homepage/data";
import type { HomepageActivity, HomepageCity, HomepageData } from "@/lib/homepage/types";
import styles from "./HomePageClient.module.css";
import { HOMEPAGE_REVIEWS } from "@/lib/homepage/reviews";
import { PRIVACY_EVENT } from "@/lib/privacy";

function ActivityCard({ activity, position, listCity, first = false }: { activity: HomepageActivity; position: number; listCity: HomepageCity; first?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const photo = activity.image;
  const ref = useRef<HTMLElement>(null);
  const seen = useRef(new Set<string>());
  const tracking = useMemo(() => ({
    city: listCity,
    class_name: activity.title,
    class_id: activity.analyticsContentId ?? String(activity.appointmentTypeId),
    appointment_type_id: activity.bookingVariantIds && activity.bookingVariantIds.length > 1 ? undefined : String(activity.appointmentTypeId),
    class_category: 'workshop',
    card_position: position,
    item_list_name: `Homepage - ${listCity === 'chicago' ? 'Chicago' : 'Eugene'} Workshops`,
    displayed_price: activity.currentPrice ?? undefined,
    mode: activity.mode === 'online' ? 'online' : 'in_studio',
    batch_number: Math.ceil(position / 10),
  }), [listCity, activity.title, activity.analyticsContentId, activity.appointmentTypeId, activity.bookingVariantIds, position, activity.currentPrice, activity.mode]);
  useEffect(() => {
    const node=ref.current; if(!node)return;
    const key=listCity + ':' + activity.key;
    const recordView = () => {
      if (isGtagAvailable() && !seen.current.has(key)) {
        seen.current.add(key);
        trackCardView(tracking);
      } else {
        trackMetaViewContent(metaContent(tracking));
      }
    };
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(e=>e.isIntersecting && e.intersectionRatio>=0.25)) recordView();
    },{threshold:0.25});
    const consentChanged = (event: Event) => {
      const box=node.getBoundingClientRect();
      const visibleHeight=Math.max(0,Math.min(box.bottom,window.innerHeight)-Math.max(box.top,0));
      if(box.height>0 && visibleHeight/box.height>=0.25) {
        if (event.type === PRIVACY_EVENT) recordView();
        else trackMetaViewContent(metaContent(tracking));
      }
    };
    window.addEventListener('ccf-meta-consent',consentChanged);
    window.addEventListener(PRIVACY_EVENT,consentChanged);
    observer.observe(node); return ()=>{observer.disconnect();window.removeEventListener('ccf-meta-consent',consentChanged);window.removeEventListener(PRIVACY_EVENT,consentChanged);};
  },[listCity,activity.key,tracking]);
  if (!photo || !activity.bookingUrl) return null;
  return (
    <article ref={ref} onClick={event => {
      const target=event.target as HTMLElement;
      if (target.closest('[data-variant-booking]')) return;
      const click_target=target.closest('summary') ? 'details' : target.closest('a') ? 'choose_date' : target.closest('h2') ? 'title' : target.closest('img') ? 'image' : 'card';
      trackCardSelect({...tracking,click_target});
    }} className={styles.card} data-activity={activity.key} data-appointment-id={activity.bookingVariantIds?.length === 1 || !activity.bookingVariantIds ? activity.appointmentTypeId : undefined}>
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
        <details className={styles.classDetails}>
          <summary>Workshop details{activity.bookingVariants ? " & options" : ""}</summary>
          {activity.durationMinutes && <p>{activity.durationMinutes} minutes</p>}
          {activity.beginnerFriendly && <p>Beginner-friendly</p>}
          {activity.byob && <p>BYOB · ages 21+ for alcohol</p>}
          {activity.ageRestriction && <p>{activity.ageRestriction}</p>}
          {activity.listingDescription ? <p className={styles.listing}>{activity.listingDescription}</p> : !activity.bookingVariants && <p>Check the booking listing for included materials, what you make, and any finishing fees.</p>}
          {activity.pickupNotes?.map(note => <p key={note}>{note}</p>)}
          {(activity.upcomingSessions?.length ?? 0) > 1 && <><h3>Upcoming sessions</h3><ul>{activity.upcomingSessions!.map(time => <li key={time}>{formatNextSession({...activity, nextAvailability: time}).replace(/^Next: /, "")}</li>)}</ul></>}
          {activity.bookingVariants?.map(variant => <div className={styles.variant} key={variant.key}>
            <h3>{variant.title}</h3><p>{variant.description}</p>
            <p>{priceLabel(variant)}{variant.durationMinutes ? ` · ${variant.durationMinutes} minutes` : ""}</p>
            <p>{formatNextSession(variant)}</p>
            <a href={variant.bookingUrl!} data-variant-booking="true" data-analytics-booking="true" onClick={() => {
              const parameters = {...tracking, class_name: variant.title, class_id: String(variant.appointmentTypeId), appointment_type_id: String(variant.appointmentTypeId), displayed_price: variant.currentPrice ?? undefined, click_target: "choose_date"};
              trackCardSelect(parameters);
              trackBeginCheckout({...parameters, booking_provider: "acuity", link_url: variant.bookingUrl!});
            }}>Choose dates for {variant.title} →</a>
          </div>)}
        </details>
        <a href={activity.bookingUrl} data-analytics-booking="true" className={styles.bookButton}
          aria-label={`Choose a date for ${activity.title} — ${activity.city === "online" ? "Live Online" : STUDIO_LOCATIONS[activity.city === "eugene" ? "eugene" : "chicago"].label}`}
          onClick={() => trackBeginCheckout({ ...tracking, click_target: "choose_date", booking_provider: "acuity", link_url: activity.bookingUrl! })}
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
  const [filter, setFilter] = useState<HomepageFilter>("All workshops");
  const [refreshing, setRefreshing] = useState(false);
  const [refreshFailed, setRefreshFailed] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const revealAnchor = useRef<string | null>(null);

  const cityRef = useRef(initialCity);
  const restored = useRef(false);
  const selectCity = useCallback((nextCity: HomepageCity, remember = true, source = "homepage_toggle") => {
    const previous_city = cityRef.current;
    cityRef.current = nextCity;
    trackCitySelection({city:nextCity,previous_city,placement:"homepage",selection_source:source});
    setCity(nextCity);
    setFilter("All workshops");
    setVisibleCount(10);
    setAnnouncement(`Showing ${STUDIO_LOCATIONS[nextCity].label} workshops.`);
    if (remember) {
      try { localStorage.setItem("preferredCity", nextCity); localStorage.setItem("ccf-city", nextCity); } catch {}
      const url = new URL(window.location.href);
      url.searchParams.set("location", nextCity);
      window.history.replaceState(window.history.state, "", url);
      window.dispatchEvent(new Event("ccf-city-change"));

    }
  }, []);

  useEffect(() => {
    const restoreCity = () => {
      const query = new URLSearchParams(window.location.search).get("location");
      if (query === "chicago" || query === "eugene") { selectCity(query, true, "url_parameter"); return; }
      try {
        const stored = localStorage.getItem("preferredCity") ?? localStorage.getItem("ccf-city");
        if (stored === "chicago" || stored === "eugene") selectCity(stored, false, "saved_preference");
      } catch {}
    };
    if (!restored.current) { restored.current = true; restoreCity(); }
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
          setData(previous => ({ ...previous, activities: previous.activities.map(activity => ({ ...activity, currentPrice: null, nextAvailability: null, upcomingSessions: [], availabilityState: "unavailable" })) }));
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

  const cityActivities = activitiesForCity(data.activities, city);
  const activities = cityActivities.filter(activity => matchesHomepageFilter(activity, filter));
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
    trackShowMore({ city, previous_visible_count: visibleCount, new_visible_count: visibleCount + count, batch_number: Math.ceil((visibleCount + count) / 10), total_available_classes: activities.length });
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
      <main tabIndex={-1} id="main-content" className={styles.main}>
        <div className={styles.intro}><h1>The future is <em>handmade...</em></h1><p>Come make something together.</p></div>
        <div className={styles.filters} role="group" aria-label="Filter workshops">
          {HOMEPAGE_FILTERS.map(option => <button key={option} type="button" aria-pressed={filter === option} onClick={() => {
            if (filter === option) return;
            setFilter(option); setVisibleCount(10); revealAnchor.current = null;
            setAnnouncement(`Showing ${option.toLowerCase()} in ${studio.label}.`);
            trackEvent("homepage_filter_selected", {city, placement: "homepage", class_category: option});
          }}>{option}</button>)}
        </div>
        <p className={styles.filterCount} role="status">{activities.length} {filter === "All workshops" ? "workshops" : filter.toLowerCase() + " workshops"} · {studio.label}</p>
        {!activities.length && <p className={styles.empty}>No matching workshops are listed right now. Try another filter or city.</p>}
        <div className={styles.feed} id="classes" aria-label={`${studio.label} creative workshops`}>
          {visible.slice(0, 2).map((activity, index) => <ActivityCard key={activity.key} activity={activity} position={index + 1} listCity={city} first={index === 0} />)}
          <section id="private-party" className={styles.party} aria-labelledby="private-party-title">
            <div className={styles.partyIntro}><p className={styles.eyebrow}>Your people. Your kind of party.</p><h2 id="private-party-title">Make it a <em>private party.</em></h2><p>Birthdays, team-building, bachelorettes, and creative get-togethers.</p><p>Planning for 8–50+ guests? Share your city, preferred date, group size, and activity. Staff confirm the space, options, and quote for your event.</p><p>Your inquiry starts a conversation; it does not reserve a date or take payment.</p></div>
            <PrivateEventFormCard city={getCityByParam(city)} timeWindows={[]} variant="homepage" onCityChange={selectCity} />
          </section>
          {visible.slice(2).map((activity, index) => <ActivityCard key={activity.key} activity={activity} position={index + 3} listCity={city} />)}
        </div>
        {visibleCount < activities.length && <div className={styles.more}><button type="button" disabled={!hydrated} onClick={showMore}>Show me more</button><p>{visible.length} of {activities.length} workshops</p></div>}
        <p role="status" className="sr-only">{announcement}</p>
        <section className={styles.enrichment} aria-labelledby="workshop-inspiration">
          <p className={styles.eyebrow}>From the studio</p><h2 id="workshop-inspiration">A little inspiration for your next creation.</h2>
          <div className={styles.gallery}>{cityActivities.filter(activity => /bonsai|cat vase|turkish/i.test(activity.title)).slice(0, 3).map(activity => <figure key={activity.key}>
            <Image src={activity.image!.path} alt={activity.image!.alt} width={activity.image!.width} height={activity.image!.height} loader={classImageLoader} sizes="(min-width: 680px) 320px, 85vw" loading="lazy" />
            <figcaption>{activity.title}</figcaption>
          </figure>)}</div>
          <p className={styles.dataStatus}>Workshop photos from our approved studio collection. Each guest’s creation is their own.</p>
        </section>
        {HOMEPAGE_REVIEWS.some(review => review.city === city) && <section className={styles.enrichment} aria-labelledby="guest-reviews">
          <p className={styles.eyebrow}>In our guests’ words</p><h2 id="guest-reviews">Made here. Remembered together.</h2>
          {HOMEPAGE_REVIEWS.filter(review => review.city === city).map(review => <figure className={styles.review} key={review.sourceUrl + review.attribution}>
            <blockquote>{review.quote}</blockquote><figcaption>{review.attribution} · {review.workshop} · <a href={review.sourceUrl} target="_blank" rel="noopener noreferrer">{review.sourceLabel}</a></figcaption>
          </figure>)}
        </section>}
        <section className={styles.enrichment} aria-labelledby="before-visit">
          <p className={styles.eyebrow}>A few useful details</p><h2 id="before-visit">Before you visit {studio.label}</h2>
          <details><summary>Where do I go, and where can I park?</summary><p>{studio.address}. Check local parking signs and allow time to arrive. For parking or accessibility guidance, contact the studio before your visit.</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(studio.address)}`} target="_blank" rel="noopener noreferrer">Open studio map →</a></details>
          <details><summary>What’s included, and what do I take home?</summary><p>Open Workshop details on a card for the class listing. Materials, tools, finishing fees, and pickup arrangements vary. Pottery may need firing and a later pickup; a finished wheel-thrown piece is not guaranteed.</p></details>
          <details><summary>Can I bring drinks?</summary><p>Look for BYOB in the workshop details and confirm your class’s rules. Alcohol is for guests 21+ with valid ID. Bring your own cups, ice, and mixers, and keep drinks away from art-making surfaces.</p></details>
          <details><summary>Do I need experience? Can children attend?</summary><p>Look for the beginner-friendly note and check the age requirements on your chosen booking listing. Ask staff about suitability for children before booking; age requirements vary by workshop.</p></details>
          <details><summary>What if I need to cancel or change my date?</summary><p>Policies vary by booking. Refer to your booking confirmation and contact <a href="mailto:support@colorcocktailfactory.com">support@colorcocktailfactory.com</a> with your booking details. Staff handle cancellation and rescheduling requests.</p></details>
        </section>
        <section className={styles.studioInfo} aria-label="Selected studio">
          <p className={styles.eyebrow}>Meet us at the studio</p><h2>{studio.label}{city === "chicago" ? ", Pilsen" : ", Oregon"}</h2><p>{studio.address}</p>
          <p className={styles.dataStatus}>{refreshing ? "Checking current class details…" : refreshFailed || data.catalogState === "unavailable" || data.availabilityState === "unavailable" ? "Some live details are temporarily unavailable. Choose a date to check the studio’s current schedule." : "Prices and upcoming sessions come from the studio’s booking calendar. Your studio’s local time is shown."}</p>
          <Link href="/gift-cards">Give a little creative time <span aria-hidden="true">↗</span></Link>
        </section>
      </main>
    </div>
  );
}
