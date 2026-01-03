import type { Metadata } from "next";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";
import TeachCTA from "@/components/teach/TeachCTA";

export const metadata: Metadata = {
  title: "Teaching Standards — CCF Instructor Excellence",
  description: "Our commitment to exceptional creative education. Learn about CCF's teaching standards, class preparation requirements, and student experience expectations.",
  alternates: {
    canonical: "https://colorcocktailfactory.com/teach/standards"
  }
};

export default function StandardsPage() {
  const coreValues = [
    {
      title: "Beginner-First Mindset",
      description: "Most of our students have zero experience. We break down complex techniques into achievable steps and celebrate small wins."
    },
    {
      title: "Creativity is Shareable",
      description: "Our tagline is our mission. Every class should inspire students to see themselves as creative and capable."
    },
    {
      title: "Psychological Safety",
      description: "Students must feel comfortable experimenting and 'failing.' We model resilience and normalize the messy creative process."
    },
    {
      title: "Inclusive & Accessible",
      description: "We adapt techniques for different abilities, provide alternatives when needed, and ensure everyone can participate fully."
    }
  ];

  const classExpectations = [
    {
      category: "Preparation",
      items: [
        "Arrive 30 minutes early to set up workspace",
        "Pre-cut clay, organize tools, and prepare demo materials",
        "Review class roster and any student notes/requests",
        "Test equipment (pottery wheels, kiln temp, etc.)"
      ]
    },
    {
      category: "During Class",
      items: [
        "Welcome students warmly and learn names",
        "Clear verbal instructions + hands-on demo",
        "Circulate constantly — no student left behind",
        "Adapt pacing based on group progress",
        "Document student work (photos for marketing, with permission)"
      ]
    },
    {
      category: "After Class",
      items: [
        "Clean and reset workspace for next class",
        "Log any equipment issues or supply needs",
        "Follow up on student pieces (glazing, firing, pickup coordination)",
        "Share standout student work with team (celebrate wins!)"
      ]
    }
  ];

  const studentExperience = [
    "Students should leave saying 'I made that?!' not 'The instructor made it for me'",
    "Hands-on > lecture. Aim for 80% doing, 20% demonstration",
    "Manage expectations: set realistic goals for the time available",
    "Encourage personal expression — there's no single 'right' outcome",
    "End with clear next steps (pickup times, firing schedules, follow-up classes)"
  ];

  return (
    <div className="relative">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          Teaching Standards
        </h1>
        <p className="mb-12 text-lg text-white/70">
          What it means to teach at CCF — our commitment to exceptional creative education.
        </p>
      </div>

      {/* Core Values */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <Reveal>
          <h2 className="mb-8 text-center text-3xl font-bold">Our Core Values</h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {coreValues.map((value, index) => (
            <Reveal key={value.title} delay={index * 0.1}>
              <GlassCard className="p-6">
                <h3 className="mb-3 text-lg font-semibold text-pink-300">{value.title}</h3>
                <p className="text-sm text-white/70">{value.description}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Class Expectations */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <Reveal>
          <h2 className="mb-8 text-center text-3xl font-bold">Class Preparation & Execution</h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {classExpectations.map((section, index) => (
            <Reveal key={section.category} delay={index * 0.1}>
              <GlassCard className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-purple-300">{section.category}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="mt-1 text-xs text-cyan-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Student Experience */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <Reveal>
          <h2 className="mb-8 text-center text-3xl font-bold">The Student Experience</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <GlassCard className="p-8">
            <p className="mb-6 text-white/80">
              Every class should be transformative. Here's what that looks like:
            </p>
            <ul className="space-y-4">
              {studentExperience.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 text-pink-400">✓</span>
                  <span className="text-white/80">{point}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>
      </section>

      {/* Continuous Improvement */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <Reveal>
          <GlassCard className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8">
            <h2 className="mb-4 text-2xl font-bold">Continuous Improvement</h2>
            <p className="mb-4 text-white/80">
              We collect feedback after every class and hold monthly instructor roundtables. 
              Your input shapes our curriculum, and we invest in your growth as an educator.
            </p>
            <p className="text-sm text-white/60">
              Teaching at CCF means joining a learning community — we support each other, share what works, and evolve together.
            </p>
          </GlassCard>
        </Reveal>
      </section>

      <TeachCTA />
    </div>
  );
}
