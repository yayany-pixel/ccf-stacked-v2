"use client";

import Link from "next/link";
import { useState } from "react";

interface NavItem {
  id: string;
  label: string;
  href?: string;
  dropdown?: Array<{ label: string; href: string }>;
}

export default function PillNav({ items }: { items: NavItem[] }) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="flex max-w-[70vw] items-center gap-2 overflow-x-auto py-1">
      {items.map((it) => {
        // If item has dropdown
        if (it.dropdown) {
          return (
            <div
              key={it.id}
              className="relative"
              onMouseEnter={() => setOpenDropdown(it.id)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className="whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/75 hover:bg-white/10 hover:text-white flex items-center gap-1"
              >
                {it.label}
                <span className="text-[10px]">▼</span>
              </button>
              
              {openDropdown === it.id && (
                <div className="absolute top-full left-0 mt-1 min-w-[200px] rounded-lg border border-white/15 bg-white/95 backdrop-blur-xl shadow-xl py-1 z-50">
                  {it.dropdown.map((dropItem) => (
                    <Link
                      key={dropItem.href}
                      href={dropItem.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 font-medium"
                    >
                      {dropItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        }

        // Regular nav item
        return (
          <Link
            key={it.id}
            href={it.href || `#${it.id}`}
            className="whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/75 hover:bg-white/10 hover:text-white"
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
