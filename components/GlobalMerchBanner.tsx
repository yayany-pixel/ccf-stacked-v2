"use client";

import React, { useEffect, useState } from "react";
import NextImage from "next/image";

type ProductData = {
  price: number;
};

export default function GlobalMerchBanner() {
  const [productData, setProductData] = useState<ProductData | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch("https://shop.colorcocktailfactory.com/products/unisex-garment-dyed-heavyweight-t-shirt.js");
        if (!res.ok) return;
        const data = await res.json();
        setProductData(data);
      } catch (err) {
        // Silently fail if price can't be fetched, banner still works
      }
    }
    fetchProduct();
  }, []);

  const formattedPrice = productData ? (productData.price / 100).toFixed(2) : null;
  const checkoutUrl = "https://shop.colorcocktailfactory.com/products/unisex-garment-dyed-heavyweight-t-shirt";

  return (
    <div className="mb-12 overflow-hidden rounded-2xl border border-pink-500/20 bg-slate-900/80 shadow-xl transition-all hover:border-pink-500/40 group">
      <div className="flex flex-col sm:flex-row items-center">
        {/* Image Section */}
        <div className="relative h-48 w-full sm:h-32 sm:w-1/3 md:w-1/4 shrink-0 bg-black/40">
          <NextImage
            src="/images/merch-studio.png"
            alt="Pepper charcoal Good With My Hands pottery T-shirt with cream hands-and-bowl artwork, hanging in a sunlit pottery studio."
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 300px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent sm:bg-gradient-to-r" />
          <div className="absolute top-2 left-3 sm:top-auto sm:bottom-2">
            <span className="inline-block rounded-full bg-pink-500/90 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white backdrop-blur-sm shadow-sm shadow-pink-500/50">
              Studio Merch
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col sm:flex-row items-center justify-between p-5 gap-4 w-full">
          <div className="text-center sm:text-left flex-1">
            <h3 className="font-serif text-lg font-bold text-white leading-tight">
              Good With My Hands Tee
            </h3>
            <p className="mt-1 text-sm text-white/70 leading-relaxed max-w-lg">
              Take the creativity home. Premium garment-dyed cotton, original pottery artwork, and a relaxed unisex fit.
            </p>
          </div>

          <div className="flex flex-col sm:items-end items-center shrink-0">
            {formattedPrice && (
              <div className="text-lg font-bold text-amber-300 mb-2">
                ${formattedPrice}
              </div>
            )}
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition focus:outline-none hover:from-pink-600 hover:to-purple-700 hover:shadow-pink-500/40"
            >
              Shop Now →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
