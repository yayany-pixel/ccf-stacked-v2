import Link from "next/link";
import type { Author } from "@/lib/authors";
import GlassCard from "@/components/ui/GlassCard";

/**
 * Author byline card shown at the top or bottom of a blog post.
 * Only renders fields that are populated on the Author record — no
 * fabricated placeholder text.
 */
export default function AuthorBio({ author }: { author: Author }) {
  return (
    <GlassCard>
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:gap-5">
        <div
          aria-hidden
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/10 font-serif text-2xl font-bold text-white/80"
        >
          {author.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-white/50">
            Written by
          </div>
          <Link
            href={`/author/${author.slug}`}
            className="mt-0.5 inline-block font-serif text-xl font-semibold text-white hover:underline"
          >
            {author.name}
          </Link>
          {author.role ? (
            <div className="mt-1 text-sm text-white/70">{author.role}</div>
          ) : null}
          {author.bio ? (
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              {author.bio}
            </p>
          ) : null}
          {author.credentials && author.credentials.length > 0 ? (
            <ul className="mt-3 space-y-1 text-xs text-white/60">
              {author.credentials.map((c) => (
                <li key={c}>• {c}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </GlassCard>
  );
}
