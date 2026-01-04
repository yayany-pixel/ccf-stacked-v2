import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";

export default function TeachFAQ() {
  const faqCategories = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "Do I need teaching experience?",
          a: "Yes. We require some teaching experience (pottery instruction preferred) or strong facilitation experience. This is a real instructor role where you'll be hosting date night classes independently, so you need to be comfortable leading groups and managing the full class experience."
        },
        {
          q: "What pottery experience do I need?",
          a: "We look for at least 2+ years of wheel throwing experience. You should be comfortable centering clay, teaching basic forms (bowls, cups, vases), and troubleshooting common beginner issues. You don't need to be a master potter, but you should have solid fundamentals."
        },
        {
          q: "Where can I teach from?",
          a: "Anywhere in the USA or Canada! You teach from your own space — home studio, garage, dedicated room, or rented studio. As long as it's clean, safe, and professional enough to host guests for a date night experience, it works."
        },
        {
          q: "How long is the approval process?",
          a: "Typically 1-2 weeks. This includes: application review (3-5 days), space readiness check via video call (20-30 min), equipment/supply setup coordination, and final onboarding. Once approved, you can start receiving bookings."
        }
      ]
    },
    {
      category: "Equipment & Space",
      questions: [
        {
          q: "Do I need my own kiln?",
          a: "Yes, kiln access is required. You need to handle both bisque firing and glaze firing for your students' pieces. This can be your own kiln, a shared studio kiln, or a reliable kiln rental arrangement."
        },
        {
          q: "What if I don't have a pottery wheel?",
          a: "CCF offers a wheel lease-to-own program. You pay a $300 deposit and $45/month. We ship the wheel to you, and after it's fully paid off, the wheel becomes yours. Alternatively, you can use your own wheels."
        },
        {
          q: "How many wheels do I need?",
          a: "For date night classes (typically 2-6 guests), we recommend having at least 2-3 wheels available. This allows couples or small groups to work simultaneously."
        },
        {
          q: "What does 'space readiness check' mean?",
          a: "This is a 20-30 minute video call where we walk through your teaching space together. We check for safety (ventilation, clear pathways, wheel setup), cleanliness, overall ambiance, and confirm you have kiln access. It's a friendly conversation to ensure your space is guest-ready."
        }
      ]
    },
    {
      category: "How the Partnership Works",
      questions: [
        {
          q: "What does CCF provide?",
          a: "CCF handles all marketing and customer bookings. We send you reservations for date night classes in your area. We also ship you clay and glaze supplies, provide curriculum guidance, and offer the optional wheel lease-to-own program. You focus on teaching."
        },
        {
          q: "What do I (the partner) provide?",
          a: "You provide the teaching/instruction, your teaching space, kiln access and firing workflow (bisque + glaze), and customer support after class (piece pickup/shipping, answering questions). You're the face of the experience for your local students."
        },
        {
          q: "How do I get paid?",
          a: "Payment structure varies by arrangement. You earn revenue from class bookings and keep all finishing fees ($5 for bisque firing, $10 for glaze finish per piece). Contact us for specific partnership terms."
        },
        {
          q: "What are finishing fees?",
          a: "After the wheel-throwing class, students need their pieces fired and glazed. You charge students directly for this service — typically $5 for bisque firing and $10 for a basic glaze finish. These fees cover your kiln costs and time, and they belong to you (not CCF)."
        }
      ]
    },
    {
      category: "Teaching & Classes",
      questions: [
        {
          q: "What kind of classes will I teach?",
          a: "Primarily wheel-throwing date night classes. These are 2-hour sessions focused on teaching couples or small groups the basics of centering and throwing simple forms (bowls, cups). Fun, relaxed, beginner-friendly atmosphere."
        },
        {
          q: "How often will I teach?",
          a: "It depends on demand in your area and your availability. You set your schedule (which days/times you're available), and we send you bookings when customers reserve classes in your region. Some partners teach 1-2 times per week, others more or less."
        },
        {
          q: "What if a student's piece cracks or fails?",
          a: "It happens! Part of teaching beginners is managing expectations and helping them understand that not every piece survives. We provide guidance on how to handle these situations gracefully. Most students appreciate the learning experience."
        },
        {
          q: "Do I need to follow a specific curriculum?",
          a: "We provide a recommended class structure and teaching flow, but you have flexibility to adapt based on your style and student needs. The core goals are: teach centering, create 1-2 simple forms, and ensure students have fun."
        }
      ]
    },
    {
      category: "Logistics",
      questions: [
        {
          q: "How do students get their finished pieces?",
          a: "You coordinate directly with students. Common options: in-person pickup at your studio (set pickup hours), local delivery (if you offer it), or shipping (student pays shipping costs). You handle the logistics that work best for your situation."
        },
        {
          q: "What supplies do I need to provide?",
          a: "CCF ships you clay and glazes. You provide basic pottery tools (ribs, trimming tools, sponges, wire cutters), aprons for guests, and workspace setup (wheels, wedging surface, water buckets). Most instructors already have these from their own practice."
        },
        {
          q: "What if I need to cancel a class?",
          a: "Life happens. Give us as much notice as possible, and we'll work to reschedule or reassign the booking. Repeated last-minute cancellations can affect your partnership standing, so we ask for reliability."
        },
        {
          q: "Is there a contract?",
          a: "Yes, we'll formalize the partnership agreement once you're approved. It covers expectations, payment terms, supply arrangements, and partnership guidelines. Everything is transparent and designed to protect both parties."
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
