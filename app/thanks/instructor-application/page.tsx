import type { Metadata } from "next";
import Link from "next/link";
import ButtonPill from "@/components/ui/ButtonPill";

export const metadata: Metadata = {
  title: "Application Submitted — Thank You | Color Cocktail Factory",
  description: "Your instructor application has been submitted. We'll review it and be in touch within 5-7 business days.",
  robots: "noindex, nofollow"
};

export default function InstructorApplicationThankYou() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900">
      {/* Background effects */}
      <div className="sparkle-noise absolute inset-0 opacity-20" />
      
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glass backdrop-blur-xl sm:p-12">
            {/* Success Icon */}
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 text-5xl">
                🎉
              </div>
              <h1 className="mb-3 font-serif text-3xl font-bold sm:text-4xl">
                Application Submitted!
              </h1>
              <p className="text-lg text-white/70">
                Thank you for your interest in partnering with Color Cocktail Factory.
              </p>
            </div>

            {/* What Happens Next */}
            <div className="mb-8 space-y-4 rounded-2xl border border-purple-400/20 bg-purple-500/5 p-6">
              <h2 className="text-lg font-semibold text-purple-300">📋 What Happens Next</h2>
              <ol className="space-y-3 text-sm text-white/70">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-xs font-semibold text-purple-300">1</span>
                  <span><strong className="text-white">Email Your Videos:</strong> Send your space walkthrough and wheel throwing demonstration to <a href="mailto:support@colorcocktailfactory.com" className="text-purple-400 hover:text-purple-300">support@colorcocktailfactory.com</a></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-xs font-semibold text-purple-300">2</span>
                  <span><strong className="text-white">Application Review:</strong> We review applications weekly and prioritize those with videos submitted</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-xs font-semibold text-purple-300">3</span>
                  <span><strong className="text-white">We'll Be In Touch:</strong> Expect to hear from us within 5-7 business days to discuss next steps</span>
                </li>
              </ol>
            </div>

            {/* Video Reminder */}
            <div className="mb-8 rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-4">
              <div className="flex gap-3">
                <div className="text-2xl">📹</div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-cyan-300">Don't Forget Your Videos!</h3>
                  <p className="text-sm text-white/70">
                    Your application is incomplete without the required videos. Please email them to{" "}
                    <a href="mailto:support@colorcocktailfactory.com" className="text-cyan-400 hover:text-cyan-300">
                      support@colorcocktailfactory.com
                    </a>{" "}
                    as soon as possible.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="space-y-3">
              <h3 className="text-center text-sm font-semibold text-white/70">While You Wait...</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <ButtonPill 
                  href="/teach/faq" 
                  variant="secondary"
                  className="w-full justify-center"
                >
                  Read Partnership FAQ
                </ButtonPill>
                <ButtonPill 
                  href="/chicago" 
                  variant="secondary"
                  className="w-full justify-center"
                >
                  See Our Workshops
                </ButtonPill>
              </div>
              <div className="pt-3 text-center">
                <ButtonPill 
                  href="/teach" 
                  variant="ghost"
                  className="w-full justify-center sm:w-auto"
                >
                  Back to Teach Page
                </ButtonPill>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-8 border-t border-white/10 pt-6 text-center">
              <p className="text-xs text-white/50">
                Questions? Email us at{" "}
                <a href="mailto:support@colorcocktailfactory.com" className="text-purple-400 hover:text-purple-300">
                  support@colorcocktailfactory.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
