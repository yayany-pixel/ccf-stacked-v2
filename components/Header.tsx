import Link from "next/link";
import CityToggle from "@/components/CityToggle";
import PillNav from "@/components/PillNav";
import MobileMenu from "@/components/MobileMenu";
import ButtonPill from "@/components/ui/ButtonPill";
import PrivatePartyCTA from "@/components/PrivatePartyCTA";
import type { City } from "@/lib/config";
import { buildHomeBookLink } from "@/lib/links";

export default function Header({ city }: { city: City }) {
  // Navigation items for the header
  const navItems = [
    { id: "blog", label: "Blog", href: "/blog" },
    { id: "pigment-lab", label: "Pigment Lab", href: `/${city.param}/paper-pigment` },
    { id: "activities", label: "All Classes", href: "/activities" },
    { id: "teach", label: "Teach", href: "/teach" },
    { id: "date-night", label: "Date Night Pottery" },
    { id: "mosaics", label: "Mosaics and Glass" },
    { id: "bonsai", label: "Bonsai" }
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="shimmer-drift rounded-2xl border border-white/10 bg-white/5 shadow-glass backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            {/* Logo as Home Link */}
            <Link href={`/${city.param}`} className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/15 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 shadow-lg shadow-purple-500/20">
                <span className="bg-gradient-to-br from-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-sm font-semibold text-transparent">CCF</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold leading-none">Color Cocktail Factory</div>
                <div className="mt-1 text-xs text-white/60">Creativity is shareable.</div>
              </div>
            </Link>

            <div className="hidden lg:block">
              <PillNav items={navItems} />
            </div>

            <div className="flex items-center gap-2">
              <PrivatePartyCTA variant="header" className="hidden md:inline-flex" />
              <CityToggle city={city} />
              <ButtonPill href={buildHomeBookLink(city)} variant="romanceCta" className="hidden sm:inline-flex">
                Book a Class
              </ButtonPill>
              <MobileMenu items={navItems} />
            </div>
          </div>

          <div className="border-t border-white/10 px-4 py-2 md:hidden">
            <PillNav items={navItems} />
          </div>
        </div>
      </div>
    </header>
  );
}
