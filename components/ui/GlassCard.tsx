import { cn } from "@/lib/utils";

export default function GlassCard({
  className,
  children,
  interactive = false
}: {
  className?: string;
  children: React.ReactNode;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/5 shadow-glass backdrop-blur-xl",
        interactive && "glass-card-interactive",
        className
      )}
    >
      {children}
    </div>
  );
}
