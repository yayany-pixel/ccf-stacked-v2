import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";
import Breadcrumbs from "@/components/blog/Breadcrumbs";
import {
  getAllAuthors,
  getAuthorBySlug,
  getAuthorUrl,
} from "@/lib/authors";
import { getBlogPostsByAuthor } from "@/lib/blogPosts";

type Props = { params: { slug: string } };

const BASE = "https://colorcocktailfactory.com";

export function generateStaticParams() {
  return getAllAuthors().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = getAuthorBySlug(params.slug);
  if (!author) return { title: "Author Not Found" };

  const title = `${author.name}${author.role ? ` — ${author.role}` : ""}`;
  const description =
    author.bio ??
    `Posts by ${author.name} on the Color Cocktail Factory blog.`;
  const url = getAuthorUrl(author.slug);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "profile",
      siteName: "Color Cocktail Factory",
      locale: "en_US",
      images: [{ url: author.image ?? "/og-image.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [author.image ?? "/og-image.jpg"],
    },
  };
}

export default function AuthorProfilePage({ params }: Props) {
  const author = getAuthorBySlug(params.slug);
  if (!author) notFound();

  const posts = getBlogPostsByAuthor(author!.slug);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author!.name,
    url: getAuthorUrl(author!.slug),
    ...(author!.role ? { jobTitle: author!.role } : {}),
    ...(author!.bio ? { description: author!.bio } : {}),
    ...(author!.image
      ? {
          image: author!.image.startsWith("http")
            ? author!.image
            : `${BASE}${author!.image}`,
        }
      : {}),
    ...(author!.sameAs && author!.sameAs.length > 0
      ? { sameAs: author!.sameAs }
      : {}),
    worksFor: {
      "@type": "Organization",
      name: "Color Cocktail Factory",
      url: BASE,
    },
  };

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: author!.name,
        item: getAuthorUrl(author!.slug),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900">
        <div className="sparkle-noise absolute inset-0 opacity-20" />

        <div className="relative mx-auto max-w-4xl px-6 py-20">
          <Reveal variant="fade-up">
            <Breadcrumbs
              items={[
                { name: "Home", href: "/" },
                { name: "Blog", href: "/blog" },
                { name: author!.name },
              ]}
            />
          </Reveal>

          <Reveal delay={100} variant="fade-up">
            <div className="mt-8">
              <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                <div
                  aria-hidden
                  className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 font-serif text-4xl font-bold text-white/80"
                >
                  {author!.name.charAt(0)}
                </div>
                <div>
                  <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
                    {author!.name}
                  </h1>
                  {author!.role ? (
                    <p className="mt-2 text-lg text-white/75">{author!.role}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </Reveal>

          {author!.bio ? (
            <Reveal delay={150} variant="fade-up">
              <GlassCard className="mt-8">
                <div className="p-6 sm:p-8">
                  <h2 className="font-serif text-2xl font-bold">About</h2>
                  <p className="mt-3 leading-relaxed text-white/80">
                    {author!.bio}
                  </p>
                  {author!.credentials && author!.credentials.length > 0 ? (
                    <ul className="mt-5 space-y-1 text-sm text-white/70">
                      {author!.credentials.map((c) => (
                        <li key={c}>• {c}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </GlassCard>
            </Reveal>
          ) : null}

          <Reveal delay={200} variant="fade-up">
            <section className="mt-12">
              <h2 className="font-serif text-2xl font-bold">
                Articles by {author!.name}
              </h2>
              {posts.length === 0 ? (
                <p className="mt-4 text-white/70">No articles yet.</p>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {posts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/25 hover:bg-white/10"
                    >
                      <div className="text-xs font-semibold uppercase tracking-wide text-purple-300">
                        {post.category}
                      </div>
                      <div className="mt-1 font-semibold text-white">
                        {post.title}
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-white/70">
                        {post.description}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </Reveal>
        </div>
      </main>
    </>
  );
}
