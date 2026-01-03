import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";

export default function TeachTestimonials() {
  const testimonials = [
    {
      quote: "I went from 'I've never taught anything' to leading my own pottery wheel classes in 6 weeks. The training is incredible, and the team is so supportive.",
      author: "Sarah M.",
      role: "Pottery Instructor, Chicago",
      months: "8 months at CCF"
    },
    {
      quote: "Best part-time gig I've ever had. I teach 2 nights a week, make great money, and get free studio time for my own art. Plus, the students are always so excited to learn.",
      author: "James L.",
      role: "Glass Fusion Instructor, Eugene",
      months: "1 year at CCF"
    },
    {
      quote: "CCF gave me the confidence to teach. I started as an assistant and now I'm certified in pottery, mosaics, AND glass. The growth opportunities are real.",
      author: "Maria G.",
      role: "Multi-Medium Instructor, Chicago",
      months: "2 years at CCF"
    }
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <Reveal>
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          What Instructors Say
        </h2>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Reveal key={testimonial.author} delay={index * 0.1}>
            <GlassCard className="p-6">
              <p className="mb-6 italic text-white/80">"{testimonial.quote}"</p>
              <div className="border-t border-white/10 pt-4">
                <div className="font-semibold">{testimonial.author}</div>
                <div className="text-sm text-white/60">{testimonial.role}</div>
                <div className="mt-1 text-xs text-white/50">{testimonial.months}</div>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
