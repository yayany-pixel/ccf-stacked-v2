import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { BlogPost } from "@/lib/blogPosts";
import { getAuthorBySlug } from "@/lib/authors";
import AuthorBio from "@/components/blog/AuthorBio";
import RelatedArticles from "@/components/blog/RelatedArticles";

const COLONOWARE_SOURCE = "https://www.si.edu/object/colonoware-pot-cooper-river-charleston-county-sc%3Anmaahc_2017.108.1.3";
const DRAKE_SOURCE = "https://nmaahc.si.edu/object/nmaahc_2011.69";

function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} className="text-purple-200 underline decoration-purple-300/50 underline-offset-4 hover:text-white">{children}</a>;
}

export default function ColonowareArticle({ post }: { post: BlogPost }) {
  const author = getAuthorBySlug(post.authorSlug);
  const published = new Date(`${post.publishedAt}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
  });

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900">
      <div className="mx-auto max-w-4xl px-5 pb-20 pt-10 sm:px-6 sm:pt-16">
        <nav aria-label="Breadcrumb" className="text-sm text-white/65">
          <Link href="/" className="hover:text-white">Home</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <Link href="/blog" className="hover:text-white">Blog</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span className="text-white/90">Pottery History</span>
        </nav>

        <article className="mt-9 text-base leading-8 text-white/85 sm:text-lg">
          <header>
            <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-white/65">
              <span className="rounded-full border border-purple-400/30 bg-purple-400/10 px-3 py-1 font-semibold text-purple-200">{post.category}</span>
              <time dateTime={post.publishedAt}>{published}</time>
              <span>{post.readTime}</span>
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">{post.title}</h1>
            {author && <p className="mt-5 text-sm text-white/65">By <Link href={`/author/${author.slug}`} className="text-purple-200 underline underline-offset-4">{author.name}</Link></p>}
          </header>

          <div className="mt-8 space-y-5">
            <p className="text-xl leading-9 text-white sm:text-2xl sm:leading-10">The pot below is missing a large piece of its body. Its maker’s name is missing, too.</p>
            <p>Look at what remains: a rounded belly, a neck that draws inward, lines cut into the clay around the shoulder. Someone made those decisions. Someone knew how to persuade wet earth to hold this shape.</p>
            <p>The Smithsonian dates this colonoware pot to the eighteenth century and lists its maker as unidentified. We can study the person’s work in remarkable detail while knowing almost nothing about the person. <SourceLink href={COLONOWARE_SOURCE}>Museum record</SourceLink></p>
            <p>That is a good place to begin a different conversation about American pottery.</p>
          </div>

          <figure className="my-9">
            <Image
              src="/images/blog/colonoware/cooper-river-colonoware.jpg"
              alt={post.imageAlt || "Colonoware pot from Cooper River, South Carolina"}
              width={1600}
              height={1280}
              sizes="(max-width: 896px) 100vw, 848px"
              priority
              className="h-auto w-full rounded-2xl"
            />
            <figcaption className="mt-3 text-sm leading-6 text-white/65">
              Colonoware pot, eighteenth century, Cooper River, Charleston County, South Carolina. Maker unidentified.
              Collection of the Smithsonian National Museum of African American History and Culture, 2017.108.1.3. Public domain. {" "}
              <SourceLink href={COLONOWARE_SOURCE}>Museum record</SourceLink>.
            </figcaption>
          </figure>

          <section aria-labelledby="what-is-colonoware" className="mt-11">
            <h2 id="what-is-colonoware" className="mb-5 font-serif text-3xl font-bold leading-snug text-white">What is colonoware?</h2>
            <div className="space-y-5">
              <p>Colonoware is an archaeological term for certain locally made, low-fired earthenware vessels found at colonial-era and later sites. Think bowls and jars shaped by hand, usually without glaze. Their surfaces might be smoothed, polished by burnishing, or marked with decoration.</p>
              <p>In South Carolina, these wares are attributed to African and Indigenous potters, both free and enslaved. Their forms and techniques vary by place and community. “Colonoware” names a category of pottery; it does not give every vessel the same cultural identity. <SourceLink href="https://southcarolinaparks.com/artifact-corner/ctl-Colonoware">South Carolina State Parks</SourceLink></p>
              <p>That distinction matters. A pot can carry knowledge from more than one tradition, but its appearance alone cannot tell us its maker’s ancestry—or whether that person was free.</p>
            </div>
          </section>

          <section aria-labelledby="skill-behind-the-pot" className="mt-11">
            <h2 id="skill-behind-the-pot" className="mb-5 font-serif text-3xl font-bold leading-snug text-white">Try keeping a clay wall even</h2>
            <div className="space-y-5">
              <p>If you have ever pinched a bowl until one side collapsed, you already have a useful way into this history.</p>
              <p>You know how much judgment a small vessel takes. Press here and the wall thins. Add height too quickly and the form sags. The rim has to work with the body. The clay has to dry and survive firing. A quiet-looking pot can contain a great deal of experience.</p>
              <p>Keep that in mind when you encounter the word “utilitarian.” A pot made for daily use still deserves a close look at its proportions, surface, and construction. Usefulness gives us more to examine.</p>
            </div>
          </section>

          <section aria-labelledby="whose-hands" className="mt-11">
            <h2 id="whose-hands" className="mb-5 font-serif text-3xl font-bold leading-snug text-white">Finding a pot is only the beginning</h2>
            <div className="space-y-5">
              <p>At Mount Vernon, archaeologists have recovered colonoware without finding evidence that it was made on the estate. They suggest the vessels arrived through regional trade or exchange. Their forms draw on Indigenous, African, and English examples. <SourceLink href="https://www.mountvernon.org/preservation/archaeology/archaeology-online/object/1721489">George Washington’s Mount Vernon</SourceLink></p>
              <p>That complicates the easy story: a pot found on a plantation was not necessarily made there. To understand it, we have to ask who made it, who moved it, and who used it.</p>
              <p>We also have to keep the conditions of that work in view. Cultural exchange in a society shaped by colonization and enslavement did not happen on equal terms. Admiring a maker’s ingenuity should bring us closer to that history, including its violence.</p>
            </div>
          </section>

          <section aria-labelledby="a-name-in-clay" className="mt-11">
            <h2 id="a-name-in-clay" className="mb-5 font-serif text-3xl font-bold leading-snug text-white">A name scratched into the clay</h2>
            <div className="space-y-5">
              <p>Now look at the second vessel. On its shoulder, you can read a name: Dave.</p>
              <p>David Drake signed and dated this storage jar August 9, 1852. It belongs to the Edgefield stoneware tradition, which is distinct from colonoware. Here, the maker’s name survives on the object itself. <SourceLink href={DRAKE_SOURCE}>Smithsonian museum record</SourceLink></p>
            </div>

            <figure className="my-9">
              <Image
                src="/images/blog/colonoware/david-drake-storage-jar.jpg"
                alt="Brown glazed stoneware storage jar with two small handles and David Drake’s incised signature and date, August 9, 1852."
                width={1515}
                height={1600}
                sizes="(max-width: 640px) 100vw, 576px"
                className="mx-auto h-auto w-full max-w-xl rounded-2xl"
              />
              <figcaption className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/65">
                Stoneware storage jar by David Drake, signed and dated August 9, 1852. This is Edgefield stoneware, a different tradition from colonoware.
                Collection of the Smithsonian National Museum of African American History and Culture, 2011.69. Public domain. {" "}
                <SourceLink href={DRAKE_SOURCE}>Museum record</SourceLink>.
              </figcaption>
            </figure>

            <div className="space-y-5">
              <p>Drake made pottery while enslaved. The exhibition <em>Hear Me Now: The Black Potters of Old Edgefield, South Carolina</em> placed his work and that of other historical Black potters in conversation with contemporary artistic responses. That pairing makes a powerful proposition: these makers belong in the discussion of what ceramics means now. <SourceLink href="https://www.metmuseum.org/exhibitions/edgefield">The Metropolitan Museum of Art</SourceLink></p>
              <p>Seeing the two pots together also raises a question worth sitting with: how much does knowing a name change the attention we give a piece?</p>
            </div>
          </section>

          <section aria-labelledby="why-history-matters" className="mt-11">
            <h2 id="why-history-matters" className="mb-5 font-serif text-3xl font-bold leading-snug text-white">What we bring back to the studio</h2>
            <div className="space-y-5">
              <p>Today’s American pottery has many histories. Colonoware is one of them; it is not the ancestor of every contemporary cup or bowl. Its importance reaches beyond a direct line of technique.</p>
              <p>It changes what we pay attention to. In a class, that might mean naming the communities behind a technique we discuss. In a museum, it might mean spending longer with an unsigned cooking vessel. In our own work, it might mean asking where an admired form comes from before calling it our invention.</p>
              <p>There is still room for the pleasure of making a bowl that feels good in your hands. Knowing this history gives that pleasure more depth.</p>
              <p>The next time you turn a handmade pot over to look for a signature, think about the first vessel on this page. Someone made it. We can give the work our attention even when we cannot give its maker a name.</p>
            </div>
          </section>
        </article>

        <div className="mt-14 space-y-7 border-t border-white/10 pt-10">
          <RelatedArticles slugs={post.relatedPostSlugs} heading="Keep exploring pottery" />
          {author && <AuthorBio author={author} />}
        </div>
      </div>
    </main>
  );
}
