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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-[11px] font-semibold tracking-wide text-white/60">{label}</div>
      <div className="mt-2 text-sm font-semibold text-white/90">{title}</div>
      <div className="mt-1 text-xs leading-relaxed text-white/70">{body}</div>
    </div>
  );
}
