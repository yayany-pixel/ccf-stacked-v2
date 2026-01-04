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
          Thank you for your interest in partnering with Color Cocktail Factory. 
          We review applications weekly and will be in touch within 5-7 business days to discuss next steps.
        </p>
        <p className="text-sm text-white/50">
          In the meantime, explore our <a href="/teach/faq" className="text-purple-400 hover:text-purple-300">Partnership FAQ</a> 
          {" "}or check out our <a href="/chicago" className="text-purple-400 hover:text-purple-300">workshops</a> to see the date night experience!
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

        {/* Location */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="city" className="mb-2 block text-sm font-medium">
              City <span className="text-pink-400">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              required
              placeholder="e.g., Portland"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
            />
          </div>
          <div>
            <label htmlFor="state" className="mb-2 block text-sm font-medium">
              State/Province <span className="text-pink-400">*</span>
            </label>
            <input
              type="text"
              id="state"
              name="state"
              required
              placeholder="e.g., Oregon"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
            />
          </div>
        </div>

        {/* Space & Equipment */}
        <div>
          <label htmlFor="space" className="mb-2 block text-sm font-medium">
            Do you have a suitable teaching space? <span className="text-pink-400">*</span>
          </label>
          <select
            id="space"
            name="space"
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
          >
            <option value="">Select one</option>
            <option value="yes-home">Yes - Home Studio</option>
            <option value="yes-commercial">Yes - Commercial Studio</option>
            <option value="yes-shared">Yes - Shared Space</option>
            <option value="maybe">Maybe - Need guidance</option>
            <option value="no">No - Looking for space</option>
          </select>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="kiln" className="mb-2 block text-sm font-medium">
              Do you have kiln access? <span className="text-pink-400">*</span>
            </label>
            <select
              id="kiln"
              name="kiln"
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
            >
              <option value="">Select one</option>
              <option value="yes-own">Yes - I own a kiln</option>
              <option value="yes-shared">Yes - Shared/Community kiln</option>
              <option value="planning">Planning to purchase</option>
              <option value="no">No - Need guidance</option>
            </select>
          </div>
          <div>
            <label htmlFor="wheels" className="mb-2 block text-sm font-medium">
              Do you have pottery wheels? <span className="text-pink-400">*</span>
            </label>
            <select
              id="wheels"
              name="wheels"
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
            >
              <option value="">Select one</option>
              <option value="yes">Yes - I have wheels</option>
              <option value="lease">Interested in lease-to-own ($300 deposit, $45/mo)</option>
              <option value="planning">Planning to purchase</option>
              <option value="no">No - Need options</option>
            </select>
          </div>
        </div>

        {/* Pottery Experience */}
        <div>
          <label htmlFor="pottery-experience" className="mb-2 block text-sm font-medium">
            Pottery & Wheel Throwing Experience <span className="text-pink-400">*</span>
          </label>
          <textarea
            id="pottery-experience"
            name="pottery-experience"
            rows={4}
            required
            placeholder="We require 2+ years of pottery experience. Tell us about your wheel throwing background, training, and what you love to make. How long have you been throwing?"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
          />
        </div>

        {/* Teaching Experience */}
        <div>
          <label htmlFor="teaching" className="mb-2 block text-sm font-medium">
            Teaching or Facilitation Experience <span className="text-pink-400">*</span>
          </label>
          <textarea
            id="teaching"
            name="teaching"
            rows={4}
            required
            placeholder="Teaching experience is required. Tell us about pottery classes, workshops, or other teaching/facilitation you've done. How do you engage beginners and create a fun learning environment?"
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

        {/* Why Partner */}
        <div>
          <label htmlFor="why" className="mb-2 block text-sm font-medium">
            Why partner with CCF? <span className="text-pink-400">*</span>
          </label>
          <textarea
            id="why"
            name="why"
            rows={4}
            required
            placeholder="What excites you about teaching wheel throwing date nights from your space? Why does this partnership model appeal to you?"
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
