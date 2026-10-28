"use client";

import React, { useEffect, useState } from "react";
import NextImage from "next/image";

type Variant = {
  id: number;
  title: string;
  price: number;
  available: boolean;
  options: string[]; // [Color, Size]
};

type ProductData = {
  title: string;
  price: number;
  variants: Variant[];
};

export default function MerchandiseCard() {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("Pepper");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch("https://shop.colorcocktailfactory.com/products/unisex-garment-dyed-heavyweight-t-shirt.js");
        if (!res.ok) throw new Error("Failed to load product");
        const data = await res.json();
        setProductData(data);
      } catch (err) {
        console.error("Failed to fetch merchandise", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6 h-96 w-full mt-8" />
    );
  }

  if (!productData) return null;

  const colors = Array.from(new Set(productData.variants.map((v) => v.options[0])));
  const sizes = Array.from(new Set(productData.variants.map((v) => v.options[1])));

  const selectedVariant = productData.variants.find(
    (v) => v.options[0] === selectedColor && v.options[1] === selectedSize
  );

  const priceToDisplay = selectedVariant ? selectedVariant.price : productData.price;
  const formattedPrice = (priceToDisplay / 100).toFixed(2);

  const checkoutUrl = selectedVariant 
    ? `https://shop.colorcocktailfactory.com/cart/${selectedVariant.id}:1`
    : "https://shop.colorcocktailfactory.com/products/unisex-garment-dyed-heavyweight-t-shirt";

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-pink-500/30 bg-slate-900/90 shadow-xl transition-all hover:border-pink-500/50 flex flex-col">
      {/* Image Section */}
      <div className="relative h-64 w-full shrink-0 bg-black/40">
        <NextImage
          src="/images/merch-studio.png"
          alt="Pepper charcoal Good With My Hands pottery T-shirt with cream hands-and-bowl artwork, hanging in a sunlit pottery studio."
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4">
          <span className="inline-block rounded-full bg-pink-500/90 px-2.5 py-1 text-xs font-bold tracking-wide text-white backdrop-blur-sm shadow-sm shadow-pink-500/50">
            Take the creativity home
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-between p-5 w-full">
        <div>
          <h3 className="font-serif text-xl font-bold text-white leading-tight">
            Good With My Hands
          </h3>
          <p className="mt-2 text-sm text-white/75 leading-relaxed">
            Your new favorite studio tee. Premium garment-dyed cotton, original pottery artwork, and a relaxed unisex fit.
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-lg font-bold text-amber-300">
              ${formattedPrice}
            </div>
          </div>

          {/* Selectors */}
          <div className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-white/50">
                Color
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                      selectedColor === color
                        ? "bg-pink-500 text-white"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-white/50">
                Size <span className="text-pink-400">*</span>
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-md px-3 py-1.5 text-[11px] font-semibold transition ${
                      selectedSize === size
                        ? "bg-white text-black"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col gap-3">
          <p className="text-xs text-white/50 text-center">
            Merchandise checkout is separate from your class booking.
          </p>
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition focus:outline-none focus:ring-2 focus:ring-pink-400 ${
              !selectedSize
                ? "bg-slate-700 text-white/50 cursor-not-allowed opacity-70"
                : "bg-gradient-to-r from-pink-500 to-purple-600 shadow-pink-500/25 hover:from-pink-600 hover:to-purple-700 hover:shadow-pink-500/40"
            }`}
            onClick={(e) => {
              if (!selectedSize) {
                e.preventDefault();
                alert("Please select a size first.");
              }
            }}
          >
            {selectedSize ? "Choose your tee — Shopify checkout" : "Select a size to purchase"}
          </a>
        </div>
      </div>
    </div>
  );
}
