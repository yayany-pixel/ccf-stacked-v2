import { cn } from "@/lib/utils";

export default function GlassCard({
  id,
  className,
  children,
  interactive = false,
  style
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  interactive?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      id={id}
      className={cn(
        "rounded-3xl border border-white/10 bg-white/5 shadow-glass backdrop-blur-xl",
        interactive && "glass-card-interactive",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
