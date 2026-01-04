import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";

interface TeachHowItWorksProps {
  detailed?: boolean;
}

export default function TeachHowItWorks({ detailed = false }: TeachHowItWorksProps) {
  const steps = [
    {
      number: "1",
      title: "Apply Online",
      description: "Tell us about your pottery teaching experience and your space. We review applications weekly.",
      details: detailed ? "Include your teaching background, pottery experience, and photos/video of your teaching space. We're looking for instructors with proven teaching ability and a professional workspace suitable for hosting date night classes." : null
    },
    {
      number: "2",
      title: "Space Readiness Check",
      description: "We review your space setup and do a virtual walkthrough to confirm it's safe, clean, and guest-ready.",
      details: detailed ? "This is a 20-30 minute video call where we walk through your teaching space together. We check safety (ventilation, wheel setup, clear pathways), cleanliness, and overall ambiance. We'll also discuss your kiln access and firing workflow to ensure you can handle the full bisque + glaze process." : null
    },
    {
      number: "3",
      title: "Equipment & Supply Setup",
      description: "Get your wheels ready (purchase from us or use your own) and receive your first clay and glaze shipments.",
      details: detailed ? "If you need wheels, you can purchase portable standing wheels from us for $750 each with free shipping. You'll receive clay and glaze shipments to get started. Submit your space walkthrough video and 2-minute wheel throw demo to support@colorcocktailfactory.com. We'll review our teaching standards, class structure, and customer service expectations." : null
    },
    {
      number: "4",
      title: "Start Teaching!",
      description: "We send you bookings, you teach the classes. You handle instruction, firing, and customer pickup/delivery.",
      details: detailed ? "CCF handles all marketing and bookings. When customers book a date night class in your area, you receive the booking notification. You teach the 2-hour wheel-throwing session, then handle bisque firing, glazing guidance, glaze firing, and final piece pickup or shipping. Finishing fees ($5 bisque, $10 glaze) go to you." : null
    }
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      {!detailed && (
        <Reveal>
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            How It Works
          </h2>
        </Reveal>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {steps.map((step, index) => (
          <Reveal key={step.number} delay={index * 0.1}>
            <GlassCard className="p-6">
              <div className="mb-4 flex items-center gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 text-xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
              </div>
              <p className="text-white/70">{step.description}</p>
              {step.details && (
                <p className="mt-4 text-sm text-white/60 border-t border-white/10 pt-4">
                  {step.details}
                </p>
              )}
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
