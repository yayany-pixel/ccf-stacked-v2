import type { Metadata } from "next";
import CuriosityStudio from "@/components/play/CuriosityStudio";

export const metadata: Metadata = {
  title: "The Curiosity Studio | Color Cocktail Factory",
  description: "A little clay. A little curiosity. Find your next creative class in Chicago, Eugene, or online. Spin the wheel, meet your maker match, and embrace the beautifully imperfect.",
  alternates: { canonical: "https://colorcocktailfactory.com/play" },
  openGraph: { title: "What will you get your hands into?", description: "Come play at the Color Cocktail Factory Curiosity Studio.", url: "https://colorcocktailfactory.com/play", images: [{ url: "/images/play/studio.webp", width: 1536, height: 1024, alt: "A wonderfully imperfect clay vase, colored pencils, and a tiny bonsai" }] },
};

export default function PlayPage() { return <CuriosityStudio />; }
