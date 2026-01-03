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
      description: "Tell us about your creative background and teaching interests. We review applications weekly.",
      details: detailed ? "Include your resume, portfolio (if applicable), and a brief note about why you want to teach at CCF. We're looking for passion over perfection — many of our best instructors had zero teaching experience when they started." : null
    },
    {
      number: "2",
      title: "Interview & Studio Tour",
      description: "Meet our team, see the studio, and experience a sample workshop from the student perspective.",
      details: detailed ? "This is a casual conversation (30-45 min) followed by a hands-on demo class. We want to see your enthusiasm and how you interact with creative materials. Expect questions like 'What's your favorite medium?' and 'Tell us about a time you taught someone something new.'" : null
    },
    {
      number: "3",
      title: "Training & Certification",
      description: "Shadow experienced instructors, learn our teaching methods, and get certified in your first medium.",
      details: detailed ? "Training takes 2-4 weeks depending on the medium. You'll shadow 3-5 classes, assist experienced instructors, and eventually co-teach before leading solo. We cover class prep, student safety, troubleshooting common issues, and our teaching philosophy. All training is paid." : null
    },
    {
      number: "4",
      title: "Start Teaching!",
      description: "Begin with assisted classes, then lead your own workshops. Build your student following and grow from there.",
      details: detailed ? "Your first few classes will have a mentor instructor present for support. Once you're comfortable, you'll teach independently. We start new instructors with 1-2 shifts per week and increase as demand grows and you gain additional certifications." : null
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
