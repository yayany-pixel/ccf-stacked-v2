"use client";

import { useState } from "react";

interface Video {
  id: string;
  label: string;
  ratio: "9/16" | "16/9";
  title: string;
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
    title: "Color Cocktail Factory Full Video"
  }
];

export default function VideoSwitcher() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const activeVideo = videos[activeVideoIndex];

  const getEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
  };

  return (
    <div className="mx-auto max-w-3xl px-6">
      {/* Video Controls */}
      <div className="mb-6 flex justify-center gap-3">
        {videos.map((video, index) => (
          <button
            key={video.id}
            onClick={() => setActiveVideoIndex(index)}
            className={`
              rounded-full px-6 py-3 font-semibold transition-all duration-300
              ${
                activeVideoIndex === index
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                  : "border-2 border-white/20 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }
              focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900
            `}
            aria-pressed={activeVideoIndex === index}
            aria-label={`Switch to ${video.label}`}
          >
            {video.label}
          </button>
        ))}
      </div>

      {/* Video Container */}
      <div 
        className="relative mx-auto overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 ease-in-out"
        style={{
          aspectRatio: activeVideo.ratio,
          maxWidth: activeVideo.ratio === "9/16" ? "520px" : "720px"
        }}
      >
        <iframe
          key={activeVideo.id}
          src={getEmbedUrl(activeVideo.id)}
          title={activeVideo.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>

      {/* Optional caption */}
      <p className="mt-4 text-center text-sm text-white/60">
        Watch to see what makes our creative workshops special
      </p>
    </div>
  );
}
