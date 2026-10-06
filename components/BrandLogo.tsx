import Image from "next/image";

/** The studio's approved ClassBento profile logo, hosted with the site. */
export default function BrandLogo({ className = "h-10 w-10 shrink-0 rounded-md object-contain" }: { className?: string }) {
  return (
    <Image
      src="/images/brand/color-cocktail-factory-logo.jpg"
      alt="Color Cocktail Factory logo"
      width={40}
      height={40}
      className={className}
      // The 350px source is only 13 KB and stays sharp on high-density screens.
      unoptimized
    />
  );
}
