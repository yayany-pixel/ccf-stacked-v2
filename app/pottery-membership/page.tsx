import type { Metadata } from "next";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";
import PricingDisplay from "@/components/PricingDisplay";
import { getCatalog, getClassTimes } from "@/lib/askccf/catalog";
import { ONLINE_CAULDRON_URL } from "@/lib/booking";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Six-Session Online Pottery Course | $150 | Color Cocktail Factory",
  description: "Learn pottery at home in six live online sessions for $150. Includes a beginner tabletop wheel, tools, and clay for the first session. Check current enrollment.",
  alternates: { canonical: "https://colorcocktailfactory.com/pottery-membership" },
  openGraph: {
    title: "Six Live Online Pottery Sessions — $150",
    description: "A beginner pottery course at home with a tabletop wheel and tools to keep.",
    url: "https://colorcocktailfactory.com/pottery-membership", images: ["/og-image.jpg"],
  },
};

const faqs = [
  { q: "How much is the course?", a: "The course is $150 total for six live online sessions. One registration covers one student and one kit." },
  { q: "What is included?", a: "Six live sessions, a beginner tabletop pottery wheel and tools to keep, and clay for the first session. You will need additional air-dry clay before the second session." },
  { q: "Do I need experience or a kiln?", a: "No. This is a beginner course using air-dry clay. Set up a sturdy table, water, a towel, and room for cleanup." },
  { q: "Can I use my pieces for food or drinks?", a: "The air-dry clay projects are decorative. They are not food safe or waterproof." },
  { q: "When does the next course begin?", a: "Available cohorts and registration deadlines are listed in Acuity. Register before the delivery deadline shown for your cohort so your kit can arrive before the first session." },
];

export default async function PotteryMembershipPage() {
  let bookingUrl: string | undefined;
  try {
    const course = (await getCatalog()).find(item => item.id === "97904203");
    if (course && (await getClassTimes(course.id, 60, "online")).length) bookingUrl = course.bookingUrl;
  } catch { /* The online scheduler remains available if the catalog is temporarily unavailable. */ }
  const schema = {
    "@context": "https://schema.org", "@type": "Course", name: "Six-Session Online Pottery Course",
    description: "Six live online pottery sessions for $150, with a tabletop wheel, tools, and first-session clay.",
    provider: { "@type": "Organization", name: "Color Cocktail Factory", url: "https://colorcocktailfactory.com" },
    offers: { "@type": "Offer", price: 150, priceCurrency: "USD", category: "Paid", url: "https://colorcocktailfactory.com/pottery-membership" },
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "Online", courseWorkload: "PT9H" },
  };
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-4xl">
        <Reveal variant="fade-up">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-purple-200">Live online · Beginner-friendly</p>
            <h1 className="mt-4 font-serif text-4xl font-bold sm:text-6xl">Learn Pottery at Home<br />Six Sessions for $150</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/75">Build your wheel-throwing skills with live instruction and a beginner tabletop pottery wheel kit delivered to you and yours to keep.</p>
          </div>
        </Reveal>
        <div className="mt-10"><PricingDisplay bookingUrl={bookingUrl} /></div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            ["Your starter kit", "A tabletop wheel, tools, and clay for session one. One kit and one student per registration."],
            ["Six live sessions", "Learn with step-by-step demonstrations, guided practice, and instructor feedback."],
            ["Create from home", "Use air-dry clay; no kiln needed. Your finished projects are decorative, not food safe or waterproof."],
          ].map(([title, text]) => <GlassCard key={title} className="p-6"><h2 className="text-xl font-semibold">{title}</h2><p className="mt-3 text-sm text-white/70">{text}</p></GlassCard>)}
        </div>
        <GlassCard className="mt-10 p-8">
          <h2 className="font-serif text-2xl">Before your first session</h2>
          <p className="mt-4 text-white/75">Check the cohort dates and kit delivery deadline in Acuity before enrolling. Prepare a sturdy table, water, a towel, and cleanup space. Plan to purchase additional air-dry clay before session two.</p>
        </GlassCard>
        <section className="mt-12 space-y-6">
          <h2 className="font-serif text-3xl">Frequently Asked Questions</h2>
          {faqs.map(({ q, a }) => <div key={q}><h3 className="font-semibold">{q}</h3><p className="mt-2 text-white/70">{a}</p></div>)}
        </section>
        <GlassCard className="mt-12 p-8 text-center">
          <h2 className="font-serif text-2xl">Looking for a single online workshop?</h2>
          <p className="mt-3 text-white/70">Make a decorative clay cauldron in a 90-minute live class. $29 class only, with optional clay delivery for $20.</p>
          <Link href={ONLINE_CAULDRON_URL} className="mt-5 inline-block rounded-full bg-purple-500 px-6 py-3 font-semibold">Book Online Cauldrons</Link>
        </GlassCard>
      </div>
    </main>
  );
}
