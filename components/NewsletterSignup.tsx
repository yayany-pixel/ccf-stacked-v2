"use client";

import { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }

    // Since there's no backend, we'll use a mailto link similar to the private events form
    // In production, this would integrate with Mailchimp, ConvertKit, or similar
    const subject = "Newsletter Signup Request";
    const body = `Please add this email to the newsletter:\n\nEmail: ${email}\nDate: ${new Date().toLocaleDateString()}\nSource: Website Footer`;
    
    window.location.href = `mailto:support@colorcocktailfactory.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    setStatus("success");
    setEmail("");
    
    // Reset success message after 3 seconds
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <div className="mx-auto max-w-md">
      <GlassCard>
        <div className="p-6">
          <div className="text-center">
            <div className="mb-2 text-2xl">✨</div>
            <h3 className="font-serif text-xl font-semibold">Join Our Creative Community</h3>
            <p className="mt-2 text-sm text-white/70">
              Get exclusive workshop updates, special offers, and creative inspiration delivered to your inbox.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm backdrop-blur-xl transition-all placeholder:text-white/40 focus:border-purple-400/50 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                required
              />
              <button
                type="submit"
                className="rounded-xl border border-purple-400/40 bg-gradient-to-r from-purple-500/30 to-pink-500/30 px-6 py-2.5 text-sm font-semibold shadow-lg shadow-purple-500/20 transition-all hover:border-purple-400/60 hover:shadow-purple-500/30"
              >
                Subscribe
              </button>
            </div>

            {status === "success" && (
              <div className="mt-3 rounded-lg border border-green-400/30 bg-green-500/10 px-4 py-2 text-center text-sm text-green-300">
                ✓ Thanks! Check your email client to send the signup request.
              </div>
            )}
            
            {status === "error" && (
              <div className="mt-3 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-2 text-center text-sm text-red-300">
                Please enter a valid email address.
              </div>
            )}

            <p className="mt-3 text-center text-xs text-white/50">
              We respect your privacy. Unsubscribe anytime. 10-15% off your first workshop!
            </p>
          </form>
        </div>
      </GlassCard>
    </div>
  );
}
