"use client";

import { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";

export default function TeachApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/netlify-forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString()
      });

      if (response.ok) {
        // Redirect to thank you page
        window.location.href = "/thanks/instructor-application";
      } else {
        throw new Error("Form submission failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again or email us at support@colorcocktailfactory.com");
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard className="p-8">
      <form 
        name="instructor-application" 
        method="POST" 
        data-netlify="true" 
        data-netlify-honeypot="bot-field"
        onSubmit={handleSubmit} 
        className="space-y-6"
      >
        <input type="hidden" name="form-name" value="instructor-application" />
        <input type="hidden" name="bot-field" style={{ display: 'none' }} aria-hidden="true" />
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
              disabled={isSubmitting}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isSubmitting}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isSubmitting}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isSubmitting}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isSubmitting}
              placeholder="e.g., Portland"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isSubmitting}
              placeholder="e.g., Oregon"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={isSubmitting}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 disabled:opacity-50 disabled:cursor-not-allowed [&>option]:bg-slate-800 [&>option]:text-white"
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
              Do you own a kiln? <span className="text-pink-400">*</span>
            </label>
            <select
              id="kiln"
              name="kiln"
              required
              disabled={isSubmitting}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 disabled:opacity-50 disabled:cursor-not-allowed [&>option]:bg-slate-800 [&>option]:text-white"
            >
              <option value="">Select one</option>
              <option value="yes">Yes - I own a kiln</option>
              <option value="planning">Planning to purchase one</option>
              <option value="no">No - Not yet</option>
            </select>
            <p className="mt-1 text-xs text-white/50">Kiln ownership is required to partner with us</p>
          </div>
          <div>
            <label htmlFor="wheels" className="mb-2 block text-sm font-medium">
              Do you have pottery wheels? <span className="text-pink-400">*</span>
            </label>
            <select
              id="wheels"
              name="wheels"
              required
              disabled={isSubmitting}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 disabled:opacity-50 disabled:cursor-not-allowed [&>option]:bg-slate-800 [&>option]:text-white"
            >
              <option value="">Select one</option>
              <option value="yes">Yes - I have wheels</option>
              <option value="purchase">Interested in purchasing from CCF ($750, free shipping)</option>
              <option value="planning">Planning to purchase elsewhere</option>
              <option value="no">No - Not yet</option>
            </select>
          </div>
        </div>

        {/* Video Submission Info */}
        <div className="rounded-lg border border-purple-400/30 bg-purple-500/5 p-4">
          <h3 className="mb-2 text-sm font-semibold text-purple-300">📹 Video Submission Required</h3>
          <p className="mb-3 text-sm text-white/70">
            After submitting this form, please email two videos to <strong className="text-purple-300">support@colorcocktailfactory.com</strong>:
          </p>
          <ul className="space-y-1 text-sm text-white/60">
            <li>• Walkthrough video of your teaching space</li>
            <li>• 2-minute demonstration of you throwing on the wheel</li>
          </ul>
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
            disabled={isSubmitting}
            placeholder="We require 2+ years of pottery experience. Tell us about your wheel throwing background, training, and what you love to make. How long have you been throwing?"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={isSubmitting}
            placeholder="Teaching experience is required. Tell us about pottery classes, workshops, or other teaching/facilitation you've done. How do you engage beginners and create a fun learning environment?"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={isSubmitting}
            placeholder="Which days/times work best? E.g., 'Tuesday and Thursday evenings' or 'Weekends anytime'"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={isSubmitting}
            placeholder="What excites you about teaching wheel throwing date nights from your space? Why does this partnership model appeal to you?"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={isSubmitting}
            placeholder="https://yourwebsite.com or link to Instagram/portfolio"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="mt-2 text-xs text-white/50">
            Optional but helpful. Share examples of your work or a resume if available.
          </p>
        </div>

        {/* Submit */}
        <div className="border-t border-white/10 pt-6">
          {error && (
            <div role="alert" className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-indigo-500/80 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting Application..." : "Submit Application"}
          </button>
          <p className="mt-4 text-center text-xs text-white/50">
            By submitting, you agree to be contacted about instructor opportunities at CCF.
          </p>
        </div>
      </form>
    </GlassCard>
  );
}
