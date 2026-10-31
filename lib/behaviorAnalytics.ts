import { PRIVACY_EVENT } from "./privacy";
import { publicPath, simpleAnalyticsAllowed, trackSimpleEvent } from "./simpleAnalytics";
import { trackEvent } from "./analytics";

const excluded = 'form,dialog,[role="dialog"],[role="log"],[contenteditable="true"],[data-analytics-ignore]';
const forms = new Set(["private-party", "birthday-party", "newsletter"]);
const cleanLabel = (value: string) => value.replace(/\s+/g, " ").trim().slice(0, 100);

/** Aggregate interactions only. Never read input values, form bodies, or chat. */
export function startBehaviorAnalytics() {
  let thresholds = new Set<number>();
  let formEvents = new Set<string>();
  let sections = new Set<string>();
  let engagedSeconds = 0;
  let active = simpleAnalyticsAllowed();
  let lastTick = performance.now();
  const placement = (el: Element) => el.closest('header,nav') ? 'navigation' : el.closest('footer') ? 'footer' : el.closest('[data-activity]') ? 'class_card' : 'page';
  const click = (event: MouseEvent) => {
    if (event.type === 'auxclick' && event.button !== 1) return;
    if (!simpleAnalyticsAllowed() || !(event.target instanceof Element)) return;
    const el = event.target.closest<HTMLElement>('a[href],button,summary,[role="button"]');
    if (!el || el.closest(excluded) || el.matches(':disabled,[aria-disabled="true"]')) return;
    const button_name = cleanLabel(el.dataset.analyticsLabel || el.getAttribute('aria-label') || el.textContent || '');
    // Never report text that resembles contact information.
    if (!button_name || /@|%40|\b\d[\d ()+.-]{8,}\d\b/.test(button_name) || button_name === 'Privacy preferences') return;
    const metadata: Record<string, unknown> = { button_name, placement: placement(el), element_type: el.tagName.toLowerCase() };
    if (el instanceof HTMLAnchorElement) {
      const url = new URL(el.href);
      if (url.protocol === 'mailto:' || url.protocol === 'tel:') {
        metadata.destination_kind = url.protocol === 'mailto:' ? 'email' : 'phone';
      } else if (/^https?:$/.test(url.protocol)) {
        metadata.destination_kind = url.origin === location.origin ? (url.pathname === location.pathname && url.hash ? 'section' : 'internal') : 'external';
        metadata.destination_host = url.hostname;
        if (/^(www\.)?colorcocktailfactory\.com$/.test(url.hostname)) {
          metadata.destination_page = publicPath(url.href);
          if (!metadata.destination_page) return;
        }
      } else return;
      trackSimpleEvent('link_click', metadata);
    } else {
      metadata.action = el.tagName === 'SUMMARY' ? (el.parentElement?.hasAttribute('open') ? 'collapse' : 'expand') : 'click';
      trackSimpleEvent('button_click', metadata);
    }
  };
  const form = (event: Event) => {
    if (!simpleAnalyticsAllowed() || !(event.target instanceof Element)) return;
    const el = event.target.closest('form');
    const name = el?.getAttribute('name');
    if (!name || !forms.has(name)) return;
    const type = event.type === 'focusin' ? 'form_start' : event.type === 'invalid' ? 'form_error' : 'form_submit_attempt';
    const key = `${name}:${type}`;
    if (formEvents.has(key) && type !== 'form_submit_attempt') return;
    formEvents.add(key);
    trackSimpleEvent(type, { form_name: name });
  };
  let scrollTimer: ReturnType<typeof setTimeout> | undefined;
  const scroll = () => {
    if (scrollTimer || !simpleAnalyticsAllowed()) return;
    scrollTimer = setTimeout(() => {
      scrollTimer = undefined;
      if (!simpleAnalyticsAllowed()) return;
      const height = document.documentElement.scrollHeight - innerHeight;
      if (height <= 0) return;
      const percent = 100 * scrollY / height;
      for (const threshold of [25, 50, 75, 90]) if (percent >= threshold && !thresholds.has(threshold)) {
        thresholds.add(threshold);
        trackEvent('scroll_depth', { scroll_depth: threshold });
      }
    }, 200);
  };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (simpleAnalyticsAllowed() && entry.isIntersecting && entry.intersectionRatio >= 0.1) {
      const name = entry.target.id || entry.target.tagName.toLowerCase();
      if (!sections.has(name)) { sections.add(name); trackSimpleEvent('section_view', { section_name: name }); }
    }
  }, { threshold: 0.1 });
  const observeSections = () => {
    observer.disconnect();
    if (simpleAnalyticsAllowed()) document.querySelectorAll('#private-party,#our-collaborations,footer').forEach(el => observer.observe(el));
  };
  const consent = () => {
    const allowed = simpleAnalyticsAllowed();
    if (allowed === active) return;
    active = allowed;
    thresholds = new Set(); formEvents = new Set(); sections = new Set(); engagedSeconds = 0;
    lastTick = performance.now(); observeSections();
  };
  const timer = setInterval(() => {
    const now = performance.now();
    const delta = Math.min((now - lastTick) / 1000, 2); lastTick = now;
    if (!simpleAnalyticsAllowed() || document.hidden) return;
    const previous = engagedSeconds; engagedSeconds += delta;
    for (const milestone of [15, 30, 60]) if (previous < milestone && engagedSeconds >= milestone)
      trackSimpleEvent('page_engagement', { engaged_seconds: milestone });
  }, 1000);
  document.addEventListener('click', click, true);
  document.addEventListener('auxclick', click, true);
  document.addEventListener('focusin', form, true);
  document.addEventListener('invalid', form, true);
  document.addEventListener('submit', form, true);
  window.addEventListener('scroll', scroll, { passive: true });
  window.addEventListener(PRIVACY_EVENT, consent);
  observeSections();
  return () => {
    document.removeEventListener('click', click, true);
    document.removeEventListener('auxclick', click, true);
    document.removeEventListener('focusin', form, true);
    document.removeEventListener('invalid', form, true);
    document.removeEventListener('submit', form, true);
    window.removeEventListener('scroll', scroll);
    window.removeEventListener(PRIVACY_EVENT, consent);
    observer.disconnect(); clearInterval(timer); clearTimeout(scrollTimer);
  };
}
