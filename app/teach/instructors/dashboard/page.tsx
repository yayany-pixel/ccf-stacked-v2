import type { Metadata } from "next";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";

export const metadata: Metadata = {
  title: "Instructor Dashboard — CCF Portal",
  description: "Manage your classes, schedule, and resources at Color Cocktail Factory.",
  robots: {
    index: false,
    follow: false
  }
};

export default function InstructorDashboardPage() {
  // Mock data for demonstration
  const upcomingClasses = [
    { date: "Jan 15, 2026", time: "6:00 PM", class: "Pottery Wheel Basics", students: 8, location: "Chicago" },
    { date: "Jan 18, 2026", time: "2:00 PM", class: "Glass Fusion Workshop", students: 6, location: "Chicago" },
    { date: "Jan 22, 2026", time: "7:00 PM", class: "Date Night Pottery", students: 12, location: "Chicago" }
  ];

  const quickActions = [
    { label: "View Schedule", icon: "📅", href: "#" },
    { label: "Class Materials", icon: "📚", href: "#" },
    { label: "Student Roster", icon: "👥", href: "#" },
    { label: "Submit Hours", icon: "⏰", href: "#" },
    { label: "Resources", icon: "🎨", href: "#" },
    { label: "Help Center", icon: "💬", href: "#" }
  ];

  return (
    <div className="relative min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Welcome back, Instructor!</h1>
            <p className="text-sm text-white/60">Here's what's coming up this week</p>
          </div>
          <ButtonPill href="/teach/instructors/login" variant="ghost">
            Sign Out
          </ButtonPill>
        </div>

        {/* Notice */}
        <div className="mb-8 rounded-lg bg-purple-500/10 p-6 text-center">
          <p className="text-sm text-white/70">
            🚧 <strong>Portal Under Development</strong> — This dashboard is coming soon! 
            For now, please contact your studio manager for scheduling and resources.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <GlassCard key={action.label} className="p-6 text-center transition hover:bg-white/10">
              <a href={action.href} className="block">
                <div className="mb-3 text-4xl">{action.icon}</div>
                <div className="text-sm font-semibold">{action.label}</div>
              </a>
            </GlassCard>
          ))}
        </div>

        {/* Upcoming Classes */}
        <div>
          <h2 className="mb-6 text-2xl font-bold">Upcoming Classes</h2>
          <div className="space-y-4">
            {upcomingClasses.map((cls, index) => (
              <GlassCard key={index} className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">{cls.class}</h3>
                    <p className="text-sm text-white/60">
                      {cls.date} at {cls.time} • {cls.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-purple-500/20 px-4 py-2">
                      <span className="text-sm font-semibold">{cls.students} students</span>
                    </div>
                    <ButtonPill href="#" variant="secondary" className="text-xs">
                      View Details
                    </ButtonPill>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Stats Overview (Mock) */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <GlassCard className="p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-pink-400">24</div>
            <div className="text-sm text-white/60">Classes This Month</div>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-purple-400">186</div>
            <div className="text-sm text-white/60">Students Taught</div>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-cyan-400">4.9</div>
            <div className="text-sm text-white/60">Avg Rating</div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
