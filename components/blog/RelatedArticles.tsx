import Link from "next/link";
import {
  getBlogPostBySlug,
  type BlogPost,
} from "@/lib/blogPosts";
import GlassCard from "@/components/ui/GlassCard";

type Props = {
  slugs: string[];
  heading?: string;
};

/**
 * Grid of related blog post cards. Silently drops slugs that don't
 * resolve to a real post.
 */
export default function RelatedArticles({
  slugs,
  heading = "Keep Reading",
}: Props) {
  const items: BlogPost[] = slugs
    .map((s) => getBlogPostBySlug(s))
    .filter((p): p is BlogPost => Boolean(p));

  if (items.length === 0) return null;

  return (
    <GlassCard>
      <div className="p-6 sm:p-8">
        <h2 className="font-serif text-2xl font-bold">{heading}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {items.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="block rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-white/25 hover:bg-white/10"
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-purple-300">
                {p.category}
              </div>
              <div className="mt-1 font-semibold text-white">{p.title}</div>
              <p className="mt-1 line-clamp-2 text-sm text-white/70">
                {p.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
