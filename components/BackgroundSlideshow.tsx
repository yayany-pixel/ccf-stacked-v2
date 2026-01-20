"use client";

import { useState, useEffect } from "react";
import NextImage from "next/image";

export default function BackgroundSlideshow({ 
  images,
  overlayClass 
}: { 
  images: string[];
  overlayClass: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Image layers with crossfade */}
      {images.map((image, index) => (
        <div
          key={image}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0
          }}
        >
          <NextImage
            src={image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-30"
            priority={index === 0}
          />
        </div>
      ))}
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" style={{ zIndex: 2 }} />
      
      {/* Color gradient overlay */}
      <div className={`absolute inset-0 ${overlayClass}`} style={{ zIndex: 3 }} />
      
      {/* Grain texture */}
      <div className="ccf-grain absolute inset-0" style={{ zIndex: 4 }} />
      
      {/* Top gradient fade */}
      <div 
        className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/25 to-transparent" 
        style={{ zIndex: 5 }} 
      />
      
      {/* Bottom gradient fade */}
      <div 
        className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" 
        style={{ zIndex: 5 }} 
      />
    </div>
  );
}
