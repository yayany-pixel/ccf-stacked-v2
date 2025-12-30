"use client";

import { useState } from "react";
import Link from "next/link";

type NavItem = {
  id: string;
  label: string;
  href?: string;
};

export default function MobileMenu({ items }: { items: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl transition-all hover:bg-white/20 lg:hidden"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <div className="flex flex-col gap-1.5">
          <span className={`h-0.5 w-5 bg-white transition-all ${isOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-0.5 w-5 bg-white transition-all ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-5 bg-white transition-all ${isOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-gradient-to-br from-slate-900 via-purple-900/80 to-slate-900 shadow-2xl lg:hidden">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <div>
                  <div className="text-lg font-semibold">Menu</div>
                  <div className="text-sm text-white/60">Color Cocktail Factory</div>
                </div>
                <button
                  onClick={closeMenu}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl transition-all hover:bg-white/20"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 overflow-y-auto p-6">
                <ul className="space-y-2">
                  {items.map((item) => {
                    const href = item.href || `#${item.id}`;
                    const isHash = href.startsWith('#');
                    
                    return (
                      <li key={item.id}>
                        {isHash ? (
                          <a
                            href={href}
                            onClick={(e) => {
                              closeMenu();
                              // Smooth scroll for hash links
                              e.preventDefault();
                              const target = document.querySelector(href);
                              if (target) {
                                target.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-medium transition-all hover:border-white/20 hover:bg-white/10"
                          >
                            {item.label}
                          </a>
                        ) : (
                          <Link
                            href={href}
                            onClick={closeMenu}
                            className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-medium transition-all hover:border-white/20 hover:bg-white/10"
                          >
                            {item.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Footer CTA */}
              <div className="border-t border-white/10 p-6">
                <Link
                  href="/gift-cards"
                  onClick={closeMenu}
                  className="block rounded-xl border border-pink-400/40 bg-gradient-to-r from-pink-500/30 to-purple-500/30 px-6 py-3 text-center font-semibold shadow-lg shadow-pink-500/20 transition-all hover:border-pink-400/60 hover:shadow-pink-500/30"
                >
                  🎁 Gift Cards (50% Off)
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
