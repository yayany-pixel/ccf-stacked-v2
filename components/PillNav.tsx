import Link from "next/link";

export default function PillNav({
  items
}: {
  items: Array<{ id: string; label: string; href?: string }>;
}) {
  return (
    <nav className="flex max-w-[70vw] items-center gap-2 overflow-x-auto py-1">
      {items.map((it) => (
        <Link
          key={it.id}
          href={it.href || `#${it.id}`}
          className="whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/75 hover:bg-white/10 hover:text-white"
        >
          {it.label}
        </Link>
      ))}
    </nav>
  );
}
