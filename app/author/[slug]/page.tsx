import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
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
    author.description ?? author.bio ??
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

  const posts = getBlogPostsByAuthor(author.slug);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: getAuthorUrl(author.slug),
    ...(author.role ? { jobTitle: author.role } : {}),
    ...(author.bio ? { description: author.bio } : {}),
    ...(author.image
      ? {
          image: author.image.startsWith("http")
            ? author.image
            : `${BASE}${author.image}`,
        }
      : {}),
    ...(author.sameAs && author.sameAs.length > 0
      ? { sameAs: author.sameAs }
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
        name: author.name,
        item: getAuthorUrl(author.slug),
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

      <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-primary">
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-8 sm:px-10">
          <nav aria-label="Profile navigation" className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6 text-sm">
            <Link href="/" className="font-semibold hover:underline">Color Cocktail Factory</Link>
            <div className="flex gap-5">
              <Link href="/activities" className="hover:underline">Workshops</Link>
              <Link href="/blog" className="hover:underline">Studio journal</Link>
            </div>
          </nav>

          <header className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/65">Meet the founder</p>
              <h1 className="mt-5 font-serif text-5xl font-medium leading-[1.05] sm:text-7xl">{author.name}</h1>
              {author.role && <p className="mt-5 max-w-md text-lg leading-relaxed text-primary/75">{author.role}</p>}
              <p className="mt-8 max-w-md font-serif text-2xl leading-relaxed">A life in art. A place for you to make something.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/chicago" className="rounded-full bg-btn px-6 py-3 text-sm font-semibold text-btn-text transition hover:opacity-90">Explore Chicago classes</Link>
                <Link href="/eugene" className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold transition hover:bg-surface-secondary">Explore Eugene classes</Link>
              </div>
            </div>
            <aside aria-label="Education and experience" className="self-start rounded-3xl border border-border bg-surface p-7 sm:p-9">
              <h2 className="font-serif text-2xl">Education &amp; experience</h2>
              {author.credentials && <ul className="mt-6 divide-y divide-border">
                {author.credentials.map((credential) => <li key={credential} className="py-4 text-sm leading-relaxed first:pt-0 last:pb-0">{credential}</li>)}
              </ul>}
            </aside>
          </header>

          <section aria-labelledby="about-yahya" className="grid gap-6 border-t border-border py-12 md:grid-cols-[1fr_2fr] md:gap-12">
            <h2 id="about-yahya" className="font-serif text-3xl">About Yahya</h2>
            <p className="max-w-2xl text-lg leading-relaxed text-primary/80">{author.bio}</p>
          </section>

          {author.profileSections && <div className="grid gap-8 border-t border-border py-12 md:grid-cols-3">
            {author.profileSections.map((section) => <section key={section.title}>
              <h2 className="font-serif text-2xl">{section.title}</h2>
              <p className="mt-4 text-sm leading-7 text-primary/80">{section.text}</p>
            </section>)}
          </div>}

          <section aria-labelledby="studio-contact" className="rounded-3xl border border-border bg-surface-secondary p-7 sm:p-9">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 id="studio-contact" className="font-serif text-3xl">Come make something.</h2>
                <p className="mt-3 max-w-xl leading-relaxed text-primary/80">Explore the studio's workshops, see what guests are making, or get in touch about a class or collaboration.</p>
              </div>
              <Link href="/activities" className="shrink-0 self-start rounded-full bg-btn px-6 py-3 text-sm font-semibold text-btn-text hover:opacity-90 md:self-center">Find your next class</Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <a href="https://www.instagram.com/colorcocktailfactory/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Studio Instagram</a>
              <a href="mailto:support@colorcocktailfactory.com" className="break-all underline underline-offset-4">support@colorcocktailfactory.com</a>
            </div>
          </section>

          <section aria-labelledby="author-articles" className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="author-articles" className="font-serif text-3xl">Articles by {author.name}</h2>
              <Link href="/blog" className="text-sm underline underline-offset-4">Visit the studio journal</Link>
            </div>
            {posts.length === 0 ? <p className="mt-4 text-primary/70">No articles yet.</p> : <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {posts.map((post) => <Link key={post.slug} href={`/blog/${post.slug}`} className="block rounded-2xl border border-border bg-surface p-6 transition hover:bg-surface-secondary">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary/60">{post.category}</p>
                <h3 className="mt-2 font-serif text-xl">{post.title}</h3>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-primary/70">{post.description}</p>
              </Link>)}
            </div>}
          </section>
        </div>
      </main>
    </>
  );
}
