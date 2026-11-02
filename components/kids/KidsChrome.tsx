"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import BrandLogo from "@/components/BrandLogo";
import type { CityParam } from "@/lib/config";
import { isKidsPath } from "@/lib/kids";
import { trackEvent } from "@/lib/analytics";
import styles from "./Kids.module.css";

export function KidsLink({ href, children, className, city }: { href: string; children: ReactNode; className?: string; city?: CityParam }) {
  return <Link href={href} className={className} onClick={() => trackEvent("kids_cta_click", { city: city ?? "global", link_url: href, placement: "kids_campaign" })}>{children}</Link>;
}
export function KidsHeader({ city }: { city?: CityParam }) {
  return <header className={styles.header}>
    <Link href="/kids" className={styles.brand}><BrandLogo className={styles.logo} /><span>Color Cocktail Factory<small>Kids &amp; Birthdays</small></span></Link>
    <nav aria-label="Kids navigation">
      <KidsLink href={city ? `/${city}/kids-birthday-parties` : "/kids#birthdays"} city={city}>Birthday parties</KidsLink>
      <KidsLink href={city ? `/${city}/kids-pottery-classes` : "/kids#classes"} city={city}>Kids classes</KidsLink>
      <Link href="/kids#choose-city">Choose city</Link>
    </nav>
  </header>;
}
export function CityHeaderSwitch({ city, children }: { city: CityParam; children: ReactNode }) {
  return isKidsPath(usePathname() ?? "") ? <KidsHeader city={city} /> : <>{children}</>;
}
export function HideOnKids({ children }: { children: ReactNode }) {
  return isKidsPath(usePathname() ?? "") ? null : <>{children}</>;
}
