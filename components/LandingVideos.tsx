"use client";

import { useState } from "react";
import Reveal from "@/components/motion/Reveal";

interface Video {
  id: string;
  label: string;
  ratio: "9/16" | "16/9";
  title: string;
  duration?: number;
}

const videos: Video[] = [
  { 
    id: "5w_Di8PsIks", 
    label: "Studio Short", 
    ratio: "9/16",
    title: "Color Cocktail Factory Studio Short"
  },
  { 
    id: "Mfs8xj765VI", 
    label: "Full Video", 
    ratio: "16/9",
    title: "Color Cocktail Factory Full Video",
    duration: 45
  }
];

export default function LandingVideos() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const activeVideo = videos[activeVideoIndex];

  const goToNext = () => {
    setActiveVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const getEmbedUrl = (video: Video) => {
    let url = `https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1&playsinline=1`;
    
    if (video.duration) {
      url += `&end=${video.duration}`;
    }
    
    return url;
  };

  return (
    <div className="mt-8 border-t border-white/10 pt-8">
      <Reveal variant="fade-up">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold">See Our Studio in Action</h3>
          <p className="mt-1 text-sm text-white/60">Watch what makes our workshops special</p>
        </div>
      </Reveal>

      <Reveal variant="fade-up" delay={100}>
        {/* Video Container with Overlay Next Button */}
        <div 
          className="group relative mx-auto overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 ease-in-out"
          style={{
            aspectRatio: activeVideo.ratio,
            maxWidth: activeVideo.ratio === "9/16" ? "520px" : "720px"
          }}
        >
          <iframe
            key={activeVideo.id}
            src={getEmbedUrl(activeVideo)}
            title={activeVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
          />
          
          {/* Next Button Overlay */}
          <button
            onClick={goToNext}
            className="absolute bottom-4 right-4 z-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 font-semibold text-white shadow-xl opacity-0 transition-all duration-300 hover:scale-110 hover:shadow-2xl group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label="Next video"
          >
            Next →
          </button>
        </div>
      </Reveal>

      {/* Scroll cue */}
      <Reveal variant="fade-up" delay={200}>
        <div className="mt-6 text-center">
          <a 
            href="#explore"
            className="inline-flex items-center gap-2 text-sm text-purple-300/80 hover:text-purple-200 transition-colors group focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-2 py-1"
            onClick={(e) => {
              e.preventDefault();
              const target = document.getElementById('explore') || document.querySelector('[id*="date-night"]') || document.querySelector('section:has([id])');
              target?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }}
          >
            <span>Keep scrolling — workshops & details are below</span>
            <svg 
              className="w-4 h-4 animate-bounce group-hover:translate-y-0.5 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </Reveal>
    </div>
  );
}
