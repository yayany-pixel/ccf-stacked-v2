import { cn } from "@/lib/utils";

export default function TagPill({
  children,
  subtle
}: {
  children: React.ReactNode;
  subtle?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide transition-all",
        subtle
          ? "border-pink-400/20 bg-pink-400/10 text-pink-300/90 hover:bg-pink-400/15"
          : "border-cyan-400/30 bg-cyan-400/15 text-cyan-200 hover:bg-cyan-400/20 shadow-sm shadow-cyan-500/20"
      )}
    >
      {children}
    </span>
  );
}
