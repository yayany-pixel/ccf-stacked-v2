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

          <div className="space-y-5">
            <p>When we pick up a handmade bowl, we often notice its weight, its surface, and the way it fits our hands. We may think less about the history behind it: who worked with clay before us, whose knowledge survived, and whose names were never recorded.</p>
            <p>Colonoware asks us to pay attention to those questions. Understanding it helps us see American pottery within a fuller history of creativity, cultural exchange, colonization, and enslavement.</p>
          </div>

          <section aria-labelledby="what-is-colonoware" className="mt-11">
            <h2 id="what-is-colonoware" className="mb-5 font-serif text-3xl font-bold leading-snug text-white">What is colonoware?</h2>
            <div className="space-y-5">
              <p>Colonoware is a term archaeologists use for certain locally made, low-fired, usually unglazed earthenware vessels found at colonial-era and later sites. These pots were built by hand rather than thrown on a wheel. Examples include bowls and jars made for everyday use, with surfaces that could be smoothed, burnished, or decorated. In South Carolina, these wares are associated with African and Indigenous potters, both free and enslaved. <SourceLink href="https://southcarolinaparks.com/artifact-corner/ctl-Colonoware">South Carolina State Parks</SourceLink></p>
              <p>The term covers regional differences, so it should not suggest that every pot had the same maker, purpose, or cultural origin. At Mount Vernon, archaeologists describe colonoware forms drawing on Indigenous, African, and English examples. They have recovered vessels without finding evidence of manufacture on the estate, suggesting that pottery also circulated through regional exchange. A pot’s discovery site does not necessarily tell us where—or by whom—it was made. <SourceLink href="https://www.mountvernon.org/preservation/archaeology/archaeology-online/object/1721489">George Washington’s Mount Vernon</SourceLink></p>
            </div>
          </section>

          <section aria-labelledby="skill-behind-the-pot" className="mt-11">
            <h2 id="skill-behind-the-pot" className="mb-5 font-serif text-3xl font-bold leading-snug text-white">The skill behind an everyday pot</h2>
            <div className="space-y-5">
              <p>A useful pot requires decisions: how to prepare the clay, shape a stable vessel, finish its surface, and manage the firing. An unglazed bowl deserves attention to those choices just as a decorated vase does.</p>
              <p>Consider an eighteenth-century colonoware vessel from South Carolina’s Cooper River in the Smithsonian’s collection. Its rounded body, narrowed neck, and incised lines preserve evidence of deliberate making. The museum identifies its maker as unknown. The object survives; the person’s name does not appear in its record. <SourceLink href={COLONOWARE_SOURCE}>National Museum of African American History and Culture</SourceLink></p>
              <p>That gap matters. An unidentified maker was still a person with knowledge, experience, and intentions. Looking closely at the pot gives us a way to recognize their work without pretending we know everything about their life.</p>
            </div>
          </section>

          <section aria-labelledby="why-history-matters" className="mt-11">
            <h2 id="why-history-matters" className="mb-5 font-serif text-3xl font-bold leading-snug text-white">Why this history matters today</h2>
            <div className="space-y-5">
              <p>American pottery sits in relation to histories like this, even when a contemporary maker is not directly continuing a colonoware tradition. The relationship involves the stories we teach, the objects we collect, and the people we recognize as artists.</p>
              <p>Learning about colonoware invites us to question a history of ceramics centered only on celebrated workshops and signed pieces. It makes room for everyday vessels and for makers whose contributions require archaeological investigation to understand.</p>
              <p>Other ceramic histories deepen that conversation. The exhibition <em>Hear Me Now: The Black Potters of Old Edgefield, South Carolina</em> brought nineteenth-century vessels by enslaved Black potters into dialogue with contemporary artistic responses. Edgefield stoneware is a different ceramic tradition from colonoware, but the exhibition demonstrates how historical pottery can remain part of a living artistic conversation. <SourceLink href="https://www.metmuseum.org/exhibitions/edgefield">The Metropolitan Museum of Art</SourceLink></p>
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
              <p>For those of us learning, teaching, or enjoying pottery today, this history offers a practice of attention. We can name the traditions we study, acknowledge what remains uncertain, and ask whose work is missing from the stories we repeat.</p>
              <p>A handmade bowl can bring pleasure to everyday life. Understanding colonoware adds another dimension to that pleasure: an awareness of the people, labor, and knowledge that belong in the history of American clay.</p>
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
