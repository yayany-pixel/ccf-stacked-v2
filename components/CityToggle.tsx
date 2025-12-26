"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { swapCityInPath } from "@/lib/links";
import type { City } from "@/lib/config";

export default function CityToggle({ city }: { city: City }) {
  const pathname = usePathname() || `/${city.param}`;

  return (
    <div className="flex items-center rounded-full border border-white/15 bg-white/5 p-1 backdrop-blur">
      <Link
        href={swapCityInPath(pathname, "chicago")}
        className={`city-toggle-btn rounded-full px-3 py-1.5 text-xs font-semibold ${
          city.param === "chicago"
            ? "active bg-white/15 text-white"
            : "text-white/70 hover:text-white"
        }`}
      >
        Chicago
      </Link>
      <Link
        href={swapCityInPath(pathname, "eugene")}
        className={`city-toggle-btn rounded-full px-3 py-1.5 text-xs font-semibold ${
          city.param === "eugene"
            ? "active bg-white/15 text-white"
            : "text-white/70 hover:text-white"
        }`}
      >
        Eugene
      </Link>
    </div>
  );
}
