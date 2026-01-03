import type { Metadata } from "next";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";

export const metadata: Metadata = {
  title: "Instructor Login — CCF Portal",
  description: "Login to access your Color Cocktail Factory instructor dashboard, schedule, and resources.",
  robots: {
    index: false,
    follow: false
  }
};

export default function InstructorLoginPage() {
  return (
    <div className="relative min-h-screen">
      <div className="mx-auto max-w-md px-4 py-24">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Instructor Portal</h1>
          <p className="text-sm text-white/60">Log in to access your dashboard</p>
        </div>

        <GlassCard className="p-8">
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                placeholder="instructor@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-2 focus:ring-purple-400/20"
                />
                <span className="text-white/60">Remember me</span>
              </label>
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-indigo-500/80 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:shadow-purple-500/50"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-white/60">
              New instructor?{" "}
              <ButtonPill href="/teach/apply" variant="ghost" className="inline-flex text-xs">
                Apply here
              </ButtonPill>
            </p>
          </div>
        </GlassCard>

        <div className="mt-6 rounded-lg bg-purple-500/10 p-4 text-center">
          <p className="text-xs text-white/50">
            🚧 Portal under construction. Contact your studio manager for scheduling and resources.
          </p>
        </div>
      </div>
    </div>
  );
}
