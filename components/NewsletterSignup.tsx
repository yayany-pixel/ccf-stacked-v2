"use client";

import { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";

export default function NewsletterSignup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

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
        window.location.href = "/thanks/newsletter";
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto max-w-2xl">
        <GlassCard>
          <div className="p-6 sm:p-8">
            <div className="text-center">
              <div className="mb-2 text-2xl">✨</div>
              <h3 className="font-serif text-xl sm:text-2xl font-semibold">Join Our Creative Community</h3>
              <p className="mt-2 text-sm text-white/70">
                Get exclusive workshop updates, special offers, and creative inspiration delivered to your inbox.
              </p>
            </div>

            <form 
              name="newsletter" 
              method="POST" 
              data-netlify="true" 
              data-netlify-honeypot="bot-field"
              action="/thanks/newsletter"
              onSubmit={handleSubmit} 
              className="mt-6"
            >
              <input type="hidden" name="form-name" value="newsletter" />
              <input type="hidden" name="bot-field" style={{ display: 'none' }} aria-hidden="true" />
              
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-xl transition-all placeholder:text-white/40 focus:border-purple-400/50 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                  required
                  disabled={isSubmitting}
                  aria-label="Email address for newsletter"
                  aria-invalid={status === "error"}
                  aria-describedby={status === "error" ? "newsletter-error" : undefined}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="whitespace-nowrap rounded-xl border border-purple-400/40 bg-gradient-to-r from-purple-500/30 to-pink-500/30 px-6 py-3 text-sm font-semibold shadow-lg shadow-purple-500/20 transition-all hover:border-purple-400/60 hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </button>
              </div>
              
              {status === "error" && (
                <div 
                  id="newsletter-error"
                  role="alert"
                  className="mt-3 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-2 text-center text-sm text-red-300"
                >
                  {errorMessage || "Please enter a valid email address."}
                </div>
              )}

              <p className="mt-3 text-center text-xs text-white/50">
                We respect your privacy. Unsubscribe anytime. 10-15% off your first workshop!
              </p>
            </form>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
