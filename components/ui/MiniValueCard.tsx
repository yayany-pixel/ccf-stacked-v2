export default function MiniValueCard({
  label,
  title,
  body
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface-secondary p-4">
      <div className="text-[11px] font-semibold tracking-wide text-primary/60">{label}</div>
      <div className="mt-2 text-sm font-semibold text-primary/90">{title}</div>
      <div className="mt-1 text-xs leading-relaxed text-primary/70">{body}</div>
    </div>
  );
}
