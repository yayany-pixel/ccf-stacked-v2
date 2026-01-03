import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";

export default function TeachFAQ() {
  const faqCategories = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "Do I need teaching experience?",
          a: "No! Many of our best instructors had never taught before joining CCF. We provide comprehensive training covering teaching techniques, student management, and our creative curriculum. If you're passionate about your craft and enjoy helping others, we'll teach you the rest."
        },
        {
          q: "What creative experience do I need?",
          a: "It varies by role. For pottery, we look for 1+ years of personal practice (wheel throwing or hand-building). For glass fusion or mosaics, we want familiarity with the medium and basic safety knowledge. Assistant instructors need no prior experience — just enthusiasm and willingness to learn."
        },
        {
          q: "How long is the hiring process?",
          a: "Typically 2-3 weeks from application to your first training shift. This includes: application review (3-5 days), interview + studio tour (scheduled within 1 week), background check (3-5 days), and onboarding paperwork (1-2 days)."
        },
        {
          q: "What happens after I'm hired?",
          a: "You'll enter our paid training program (2-4 weeks depending on medium). You'll shadow experienced instructors, learn class prep routines, and practice teaching with support. Once certified, you'll start with 1-2 shifts per week and grow from there."
        }
      ]
    },
    {
      category: "Schedule & Commitment",
      questions: [
        {
          q: "How flexible is the schedule?",
          a: "Very flexible. You set your availability (e.g., 'available Tuesday and Thursday evenings') and we assign shifts accordingly. Most instructors work 1-3 shifts per week (4-12 hours total). We post schedules 2 weeks in advance and accommodate time-off requests with advance notice."
        },
        {
          q: "Can I teach part-time?",
          a: "Yes! Most of our instructors are part-time. We have no minimum hour requirements, though we prioritize shifts for instructors who commit to at least 1-2 regular weekly slots."
        },
        {
          q: "What are typical class hours?",
          a: "Evenings (6-9pm) and weekends (10am-8pm) are our busiest times. Weekday afternoon classes are less common but available. Private events can be any time, often Friday/Saturday nights."
        },
        {
          q: "Can I work at both Chicago and Eugene locations?",
          a: "Yes! If you're willing to travel or split time between cities, you'll have access to more shifts. We reimburse travel expenses for instructors who teach at both locations on the same day."
        }
      ]
    },
    {
      category: "Pay & Benefits",
      questions: [
        {
          q: "What's the pay structure?",
          a: "Hourly rates range from $18-50/hr based on role, experience, and certifications. Assistant instructors start at $18-22/hr. Lead instructors (single medium) earn $25-35/hr. Multi-medium instructors earn $30-40/hr. Master instructors/mentors earn $35-50/hr. All training is paid at your starting rate."
        },
        {
          q: "When do I get paid?",
          a: "Bi-weekly via direct deposit. You log hours after each class, and payments process every other Friday."
        },
        {
          q: "What benefits do you offer?",
          a: "Free studio access during off-hours, 30% materials discount, paid training/certifications, professional development stipend ($200/year), performance bonuses for top-rated classes, and health insurance stipend for full-time instructors (20+ hrs/week)."
        },
        {
          q: "How do I earn more?",
          a: "By adding certifications (each new medium = pay bump), taking on private events (often higher rates), or advancing to mentor/master instructor roles. Top-rated instructors also earn quarterly bonuses."
        }
      ]
    },
    {
      category: "Teaching & Training",
      questions: [
        {
          q: "What does training involve?",
          a: "2-4 weeks of paid shadowing and hands-on practice. You'll observe 3-5 classes taught by experienced instructors, assist with class prep and student support, co-teach with a mentor, and finally teach a certification class (mentor present). All materials and training time are compensated."
        },
        {
          q: "Can I teach multiple mediums?",
          a: "Yes! We encourage cross-training. After your first certification, you can train in additional mediums. Each new certification increases your hourly rate and gives you access to more shifts."
        },
        {
          q: "What if I've never worked with beginners?",
          a: "That's what training is for. We'll teach you how to break down complex techniques, manage different skill levels in one class, and keep students encouraged even when projects don't go as planned. Our 'beginner-first' philosophy is core to everything we do."
        },
        {
          q: "Do I create my own curriculum?",
          a: "We provide structured lesson plans for core classes (e.g., Pottery Wheel Basics, Glass Fusion 101). Once you're comfortable, you can propose custom workshops or specialty classes. Master instructors often develop signature offerings."
        }
      ]
    },
    {
      category: "Logistics",
      questions: [
        {
          q: "What should I wear?",
          a: "Casual, movement-friendly clothes that can get messy. Closed-toe shoes required. We provide aprons for pottery/messy mediums. Many instructors wear our branded aprons or t-shirts (available at cost)."
        },
        {
          q: "Do I need to bring my own tools?",
          a: "No. We provide all tools, materials, and equipment. You're welcome to bring personal tools if you prefer (e.g., favorite pottery ribs), but it's not required."
        },
        {
          q: "What if a student gets hurt?",
          a: "We have comprehensive safety protocols and liability insurance. All instructors complete safety training covering first aid, equipment use, and emergency procedures. Students sign waivers, and we maintain a first aid kit on-site."
        },
        {
          q: "How do I handle difficult students?",
          a: "We train you in de-escalation and boundary-setting. Most issues are minor (someone frustrated with their project). For serious behavioral issues, studio managers are always available for support. Your safety and comfort are priorities."
        }
      ]
    }
  ];

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      {faqCategories.map((category, catIndex) => (
        <div key={category.category} className="mb-12">
          <Reveal delay={catIndex * 0.1}>
            <h2 className="mb-6 text-2xl font-bold text-purple-300">{category.category}</h2>
          </Reveal>
          <div className="space-y-4">
            {category.questions.map((faq, qIndex) => (
              <Reveal key={faq.q} delay={catIndex * 0.1 + qIndex * 0.05}>
                <GlassCard className="p-6">
                  <h3 className="mb-3 font-semibold text-white/90">{faq.q}</h3>
                  <p className="text-sm leading-relaxed text-white/70">{faq.a}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
