import type { Metadata } from "next";
import Link from "next/link";
import ButtonPill from "@/components/ui/ButtonPill";

export const metadata: Metadata = {
  title: {
    default: "Teach with CCF — Wheel Throwing Partnership | Color Cocktail Factory",
    template: "%s | Teach with CCF"
  },
  description:
    "Partner with Color Cocktail Factory to teach wheel throwing date nights from your own space. Nationwide USA & Canada. Kiln required. Wheel lease-to-own available. Earn from classes and finishing fees.",
  keywords: [
    "pottery instructor partner",
    "wheel throwing instructor",
    "pottery teaching partnership",
    "pottery instructor USA",
    "pottery instructor Canada",
    "teach pottery from home",
    "pottery business opportunity",
    "kiln required pottery job",
    "wheel throwing teaching",
    "pottery partnership program"
  ],
  openGraph: {
    title: "Teach Wheel Throwing with Color Cocktail Factory",
    description: "Partner with CCF to teach pottery date nights from your own space nationwide. Kiln required, wheel lease available.",
    type: "website"
  }
};

export default function TeachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navLinks = [
    { label: "How It Works", href: "/teach/how-it-works" },
    { label: "Roles", href: "/teach/roles" },
    { label: "Partnership", href: "/teach/pay" },
    { label: "Standards", href: "/teach/standards" },
    { label: "Locations", href: "/teach/locations" },
    { label: "FAQ", href: "/teach/faq" }
  ];

  return (
    <div className="min-h-screen bg-[#080A10]">
      {/* Dedicated Teach Header */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="shimmer-drift rounded-2xl border border-white/10 bg-white/5 shadow-glass backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              {/* Logo */}
              <Link href="/teach" className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/15 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 shadow-lg shadow-purple-500/20">
                  <span className="bg-gradient-to-br from-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-sm font-semibold text-transparent">CCF</span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-semibold leading-none">Teach with CCF</div>
                  <div className="mt-1 text-xs text-white/60">Join our creative team</div>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full px-4 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* CTA Buttons */}
              <div className="flex items-center gap-2">
                <ButtonPill 
                  href="/teach/instructors/login" 
                  variant="ghost"
                  className="hidden md:inline-flex text-xs"
                >
                  Instructors Login
                </ButtonPill>
                <ButtonPill 
                  href="/teach/apply" 
                  variant="primary"
                  className="text-xs sm:text-sm"
                >
                  Apply Now
                </ButtonPill>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="border-t border-white/10 px-4 py-2 lg:hidden">
              <div className="flex flex-wrap gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full px-3 py-1.5 text-xs font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-3 text-sm font-semibold">Teach with CCF</h3>
              <p className="text-sm text-white/60">
                Join our team of passionate instructors and inspire creativity in Chicago and Eugene.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/teach/apply" className="hover:text-white">Apply Now</Link></li>
                <li><Link href="/teach/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/teach/instructors/login" className="hover:text-white">Instructor Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold">Main Site</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/chicago" className="hover:text-white">Book Classes - Chicago</Link></li>
                <li><Link href="/eugene" className="hover:text-white">Book Classes - Eugene</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-8 text-center text-xs text-white/50">
            © {new Date().getFullYear()} Color Cocktail Factory. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
