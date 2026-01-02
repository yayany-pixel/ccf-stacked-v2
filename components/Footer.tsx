import Link from "next/link";
import PrivatePartyCTA from "@/components/PrivatePartyCTA";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900">
      <div className="sparkle-noise absolute inset-0 opacity-10" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        {/* Private Party CTA - Prominent placement */}
        <div className="mb-12">
          <PrivatePartyCTA variant="footer" />
        </div>

        {/* Main Footer Grid */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/15 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20">
                <span className="bg-gradient-to-br from-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-sm font-semibold text-transparent">CCF</span>
              </div>
              <div>
                <div className="text-sm font-semibold">Color Cocktail Factory</div>
                <div className="text-xs text-white/60">Creativity is shareable.</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Expert-led creative workshops in Chicago and Eugene. Pottery, glass art, mosaics, and more.
            </p>
          </div>

          {/* Locations */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white/90">Locations</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/chicago" className="hover:text-purple-300 transition">
                  Chicago (Pilsen)
                </Link>
              </li>
              <li>
                <Link href="/eugene" className="hover:text-purple-300 transition">
                  Eugene, Oregon
                </Link>
              </li>
            </ul>
            
            <h3 className="mb-4 mt-6 text-sm font-bold uppercase tracking-wide text-white/90">Group Events</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/team-building" className="hover:text-purple-300 transition">
                  Team Building
                </Link>
              </li>
              <li>
                <Link href="/birthday-parties" className="hover:text-purple-300 transition">
                  Birthday Parties
                </Link>
              </li>
              <li>
                <Link href="/bachelorette-parties" className="hover:text-purple-300 transition">
                  Bachelorette Parties
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white/90">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/activities" className="hover:text-purple-300 transition">
                  All Activities
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-purple-300 transition">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link href="/gift-cards" className="hover:text-purple-300 transition">
                  Gift Cards
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-purple-300 transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/private-events" className="hover:text-purple-300 transition">
                  Private Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white/90">Stay Connected</h3>
            <NewsletterSignup />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/60">
          <p>© {currentYear} Color Cocktail Factory. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/private-events" className="hover:text-purple-300 transition">
              Private Events
            </Link>
            {" • "}
            <a href="mailto:support@colorcocktailfactory.com" className="hover:text-purple-300 transition">
              Contact Us
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
