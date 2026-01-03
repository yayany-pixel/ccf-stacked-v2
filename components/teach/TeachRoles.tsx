import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";

interface TeachRolesProps {
  preview?: boolean;
}

export default function TeachRoles({ preview = false }: TeachRolesProps) {
  const roles = [
    {
      title: "Pottery Wheel Instructor",
      mediums: ["Wheel Throwing", "Hand-Building"],
      requirements: ["1+ years pottery experience", "Comfortable centering clay", "Patient with beginners"],
      demand: "High"
    },
    {
      title: "Glass Fusion Instructor",
      mediums: ["Glass Fusion", "Mosaic"],
      requirements: ["Glass cutting experience", "Understanding of kiln firing", "Eye for color/design"],
      demand: "Medium"
    },
    {
      title: "Mixed Media Instructor",
      mediums: ["Mosaics", "Terrariums", "Candle Making"],
      requirements: ["Crafting background", "Adaptable teaching style", "Project management skills"],
      demand: "Medium"
    },
    {
      title: "Multi-Medium Specialist",
      mediums: ["Pottery + Glass + Mosaics"],
      requirements: ["2+ years teaching", "Certified in 3+ mediums", "Curriculum development"],
      demand: "High"
    },
    {
      title: "Assistant Instructor",
      mediums: ["All (learning role)"],
      requirements: ["Creative enthusiasm", "No experience required", "Willing to learn"],
      demand: "Always Hiring"
    },
    {
      title: "Private Event Lead",
      mediums: ["Any medium"],
      requirements: ["Experience with large groups", "Flexible weekends", "High energy personality"],
      demand: "Medium"
    }
  ];

  const displayRoles = preview ? roles.slice(0, 3) : roles;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      {!preview && (
        <Reveal>
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            Open Positions
          </h2>
        </Reveal>
      )}

      {preview && (
        <Reveal>
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            Instructor Roles
          </h2>
        </Reveal>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayRoles.map((role, index) => (
          <Reveal key={role.title} delay={index * 0.1}>
            <GlassCard className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-lg font-semibold leading-tight">{role.title}</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  role.demand === "High" ? "bg-pink-500/20 text-pink-300" :
                  role.demand === "Always Hiring" ? "bg-purple-500/20 text-purple-300" :
                  "bg-cyan-500/20 text-cyan-300"
                }`}>
                  {role.demand}
                </span>
              </div>

              <div className="mb-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">
                  Mediums
                </div>
                <div className="flex flex-wrap gap-2">
                  {role.mediums.map((medium) => (
                    <span key={medium} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70">
                      {medium}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">
                  Requirements
                </div>
                <ul className="space-y-1">
                  {role.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="mt-1 text-xs text-purple-400">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>

      {preview && (
        <Reveal delay={0.4}>
          <div className="mt-8 text-center">
            <Link
              href="/teach/roles"
              className="inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300"
            >
              View all positions →
            </Link>
          </div>
        </Reveal>
      )}
    </section>
  );
}
