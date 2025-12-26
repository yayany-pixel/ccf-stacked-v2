"use client";

import { useState, useEffect } from "react";

type City = "chicago" | "eugene";

interface CityFilterProps {
  onCityChange: (city: City) => void;
  defaultCity?: City;
}

export default function CityFilter({ onCityChange, defaultCity = "chicago" }: CityFilterProps) {
  const [selectedCity, setSelectedCity] = useState<City>(defaultCity);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("ccf-city") as City | null;
    if (saved && (saved === "chicago" || saved === "eugene")) {
      setSelectedCity(saved);
      onCityChange(saved);
    }
  }, [onCityChange]);

  const handleCityChange = (city: City) => {
    setSelectedCity(city);
    localStorage.setItem("ccf-city", city);
    onCityChange(city);
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={() => handleCityChange("chicago")}
        className={`
          rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200
          ${
            selectedCity === "chicago"
              ? "bg-white/15 text-white shadow-lg shadow-white/10"
              : "text-white/50 hover:text-white/80"
          }
        `}
      >
        Chicago
      </button>
      <button
        onClick={() => handleCityChange("eugene")}
        className={`
          rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200
          ${
            selectedCity === "eugene"
              ? "bg-white/15 text-white shadow-lg shadow-white/10"
              : "text-white/50 hover:text-white/80"
          }
        `}
      >
        Eugene
      </button>
    </div>
  );
}
