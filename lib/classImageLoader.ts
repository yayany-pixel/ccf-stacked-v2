/** Netlify caches each size and negotiates WebP/AVIF with the browser. */
export function classImageLoader({ src, width, quality }: {
  src: string;
  width: number;
  quality?: number;
}) {
  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${Math.min(width, 1200)}&q=${quality ?? 75}`;
}
