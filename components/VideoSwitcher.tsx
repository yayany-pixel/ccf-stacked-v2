"use client";

import { useState } from "react";

interface Video {
  id: string;
  label: string;
  ratio: "9/16" | "16/9";
  title: string;
  duration?: number; // Duration in seconds (if we want to cut it short)
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
    duration: 58 // Cut 2 seconds before the end (assuming ~60 second video)
  }
];

export default function VideoSwitcher() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const activeVideo = videos[activeVideoIndex];

  const goToNext = () => {
    setActiveVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const getEmbedUrl = (video: Video) => {
    let url = `https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1&playsinline=1`;
    
    // If duration is specified, add the end parameter to cut the video short
    if (video.duration) {
      url += `&end=${video.duration}`;
    }
    
    return url;
  };

  return (
    <div className="mx-auto max-w-3xl px-6">
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
        
        {/* Next Button Overlay - appears on hover */}
        <button
          onClick={goToNext}
          className="absolute bottom-4 right-4 z-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 font-semibold text-white shadow-xl opacity-0 transition-all duration-300 hover:scale-110 hover:shadow-2xl group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          aria-label="Next video"
        >
          Next →
        </button>
      </div>

      {/* Optional caption */}
      <p className="mt-4 text-center text-sm text-white/60">
        Watch to see what makes our creative workshops special
      </p>
    </div>
  );
}
