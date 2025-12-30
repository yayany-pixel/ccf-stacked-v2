"use client";

import { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";

type Testimonial = {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  workshop: string;
  date: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah M.",
    location: "Chicago, IL",
    rating: 5,
    text: "Best date night ever! The pottery wheel class was so much fun and our instructor was incredibly patient. We made beautiful pieces and got to take them home. Highly recommend!",
    workshop: "Date Night Pottery",
    date: "2 weeks ago"
  },
  {
    id: 2,
    name: "James T.",
    location: "Eugene, OR",
    rating: 5,
    text: "Took my team here for a corporate event. The mosaic workshop was perfect - creative, engaging, and everyone left with something unique. Great for team building!",
    workshop: "Mosaic Workshop",
    date: "1 month ago"
  },
  {
    id: 3,
    name: "Emily R.",
    location: "Chicago, IL",
    rating: 5,
    text: "The Turkish lamp class exceeded all expectations! The instructor guided us through every step. My lamp is now the centerpiece of my living room. Worth every penny!",
    workshop: "Turkish Lamp Making",
    date: "3 weeks ago"
  },
  {
    id: 4,
    name: "Michael K.",
    location: "Eugene, OR",
    rating: 5,
    text: "Incredible experience! Never touched clay before but the beginner wheel throwing class made it so approachable. Can't wait to come back for another session.",
    workshop: "Beginner Wheel Throwing",
    date: "1 week ago"
  },
  {
    id: 5,
    name: "Lisa P.",
    location: "Chicago, IL",
    rating: 5,
    text: "Booked a private event for my daughter's 16th birthday. The staff was amazing, the space was beautiful, and all the girls had an absolute blast. Thank you CCF!",
    workshop: "Private Party",
    date: "2 months ago"
  },
  {
    id: 6,
    name: "David W.",
    location: "Eugene, OR",
    rating: 5,
    text: "The bonsai workshop was meditative and educational. I learned so much about the art form and left with a beautiful tree. The instructor's knowledge was impressive!",
    workshop: "Bonsai Workshop",
    date: "3 weeks ago"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Show 3 testimonials at a time on desktop, 1 on mobile
  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length]
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900/60 via-purple-900/40 to-pink-900/30 py-16">
      <div className="sparkle-noise absolute inset-0 opacity-30" />
      
      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal variant="fade-up">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-xl">
              <span className="text-yellow-400">★★★★★</span>
              <span>4.9/5 Rating</span>
            </div>
            <h2 className="mt-6 font-serif text-4xl font-bold sm:text-5xl">
              What Our Customers Say
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75">
              Join 150,000+ happy customers who've discovered their creative side
            </p>
          </div>
        </Reveal>

        {/* Desktop: 3 columns */}
        <div className="mt-12 hidden gap-6 md:grid md:grid-cols-3">
          {visibleTestimonials.map((testimonial, idx) => (
            <Reveal key={testimonial.id} delay={idx * 100} variant="fade-up">
              <GlassCard className="h-full">
                <div className="flex h-full flex-col p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-yellow-400">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span className="text-xs text-white/50">{testimonial.date}</span>
                  </div>
                  
                  <p className="mt-4 flex-1 leading-relaxed text-white/85">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="mt-1 text-sm text-white/60">{testimonial.location}</div>
                    <div className="mt-2 inline-block rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-200">
                      {testimonial.workshop}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>

        {/* Mobile: Single card with navigation */}
        <div className="mt-12 md:hidden">
          <Reveal variant="fade-up">
            <GlassCard>
              <div className="flex flex-col p-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-yellow-400">
                    {Array.from({ length: visibleTestimonials[0].rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span className="text-xs text-white/50">{visibleTestimonials[0].date}</span>
                </div>
                
                <p className="mt-4 leading-relaxed text-white/85">
                  "{visibleTestimonials[0].text}"
                </p>
                
                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="font-semibold text-white">{visibleTestimonials[0].name}</div>
                  <div className="mt-1 text-sm text-white/60">{visibleTestimonials[0].location}</div>
                  <div className="mt-2 inline-block rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-200">
                    {visibleTestimonials[0].workshop}
                  </div>
                </div>
              </div>
            </GlassCard>
          </Reveal>

          {/* Navigation buttons */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={prevTestimonial}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-xl transition-all hover:bg-white/20"
              aria-label="Previous testimonial"
            >
              ←
            </button>
            <div className="text-sm text-white/60">
              {currentIndex + 1} / {testimonials.length}
            </div>
            <button
              onClick={nextTestimonial}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-xl transition-all hover:bg-white/20"
              aria-label="Next testimonial"
            >
              →
            </button>
          </div>
        </div>

        {/* Desktop navigation dots */}
        <div className="mt-8 hidden justify-center gap-2 md:flex">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 w-2 rounded-full transition-all ${
                idx === currentIndex
                  ? "w-8 bg-purple-400"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
