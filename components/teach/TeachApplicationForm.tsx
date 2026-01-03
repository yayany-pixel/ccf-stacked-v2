"use client";

import { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";

export default function TeachApplicationForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to your backend/CRM
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <GlassCard className="p-12 text-center">
        <div className="mb-4 text-6xl">🎉</div>
        <h2 className="mb-4 text-2xl font-bold">Application Submitted!</h2>
        <p className="mb-6 text-white/70">
          Thank you for your interest in teaching at Color Cocktail Factory. 
          We review applications weekly and will be in touch within 5-7 business days.
        </p>
        <p className="text-sm text-white/50">
          In the meantime, explore our <a href="/teach/faq" className="text-purple-400 hover:text-purple-300">FAQ</a> 
          {" "}or check out our <a href="/chicago" className="text-purple-400 hover:text-purple-300">workshops</a> to see what we teach!
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="mb-2 block text-sm font-medium">
              First Name <span className="text-pink-400">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="mb-2 block text-sm font-medium">
              Last Name <span className="text-pink-400">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email <span className="text-pink-400">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              Phone <span className="text-pink-400">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
            />
          </div>
        </div>

        {/* Location Preference */}
        <div>
          <label htmlFor="location" className="mb-2 block text-sm font-medium">
            Preferred Location <span className="text-pink-400">*</span>
          </label>
          <select
            id="location"
            name="location"
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
          >
            <option value="">Select a location</option>
            <option value="chicago">Chicago (Pilsen)</option>
            <option value="eugene">Eugene (Downtown)</option>
            <option value="both">Either/Both</option>
          </select>
        </div>

        {/* Medium Interests */}
        <div>
          <label className="mb-3 block text-sm font-medium">
            Which mediums interest you? <span className="text-pink-400">*</span>
          </label>
          <div className="space-y-2">
            {[
              "Pottery (Wheel Throwing)",
              "Pottery (Hand-Building)",
              "Glass Fusion",
              "Mosaics",
              "Mixed Media (Terrariums, Candles, etc.)",
              "Assistant Role (Open to learning all)"
            ].map((medium) => (
              <label key={medium} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="mediums"
                  value={medium}
                  className="h-4 w-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-2 focus:ring-purple-400/20"
                />
                <span className="text-sm text-white/80">{medium}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div>
          <label htmlFor="experience" className="mb-2 block text-sm font-medium">
            Describe your creative experience <span className="text-pink-400">*</span>
          </label>
          <textarea
            id="experience"
            name="experience"
            rows={4}
            required
            placeholder="Tell us about your background in pottery, glass, crafts, or other creative mediums. How long have you been practicing? Any formal training?"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
          />
        </div>

        {/* Teaching Experience */}
        <div>
          <label htmlFor="teaching" className="mb-2 block text-sm font-medium">
            Teaching experience (if any)
          </label>
          <textarea
            id="teaching"
            name="teaching"
            rows={3}
            placeholder="Have you taught classes, workshops, or one-on-one lessons? If not, that's okay! Tell us about times you've helped others learn something new."
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
          />
        </div>

        {/* Availability */}
        <div>
          <label htmlFor="availability" className="mb-2 block text-sm font-medium">
            Availability <span className="text-pink-400">*</span>
          </label>
          <textarea
            id="availability"
            name="availability"
            rows={3}
            required
            placeholder="Which days/times work best? E.g., 'Tuesday and Thursday evenings' or 'Weekends anytime'"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
          />
        </div>

        {/* Why CCF */}
        <div>
          <label htmlFor="why" className="mb-2 block text-sm font-medium">
            Why do you want to teach at CCF? <span className="text-pink-400">*</span>
          </label>
          <textarea
            id="why"
            name="why"
            rows={4}
            required
            placeholder="What excites you about teaching creative workshops? Why Color Cocktail Factory?"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
          />
        </div>

        {/* Portfolio/Resume */}
        <div>
          <label htmlFor="portfolio" className="mb-2 block text-sm font-medium">
            Portfolio or Resume Link
          </label>
          <input
            type="url"
            id="portfolio"
            name="portfolio"
            placeholder="https://yourwebsite.com or link to Instagram/portfolio"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
          />
          <p className="mt-2 text-xs text-white/50">
            Optional but helpful. Share examples of your work or a resume if available.
          </p>
        </div>

        {/* Submit */}
        <div className="border-t border-white/10 pt-6">
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-indigo-500/80 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:shadow-purple-500/50"
          >
            Submit Application
          </button>
          <p className="mt-4 text-center text-xs text-white/50">
            By submitting, you agree to be contacted about instructor opportunities at CCF.
          </p>
        </div>
      </form>
    </GlassCard>
  );
}
