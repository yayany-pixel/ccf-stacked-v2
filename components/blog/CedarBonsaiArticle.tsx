import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blogPosts";
import { getPostImage, getPostImageAlt } from "@/lib/blogPosts";
import { getAuthorBySlug } from "@/lib/authors";
import AuthorBio from "@/components/blog/AuthorBio";

const CARE_GUIDE = "https://www.bonsaiempire.com/tree-species/japanese-cedar";

export default function CedarBonsaiArticle({ post }: { post: BlogPost }) {
  const author = getAuthorBySlug(post.authorSlug);

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900">
      <div className="mx-auto max-w-5xl px-5 pb-20 pt-10 sm:px-6 sm:pt-16">
        <nav aria-label="Breadcrumb" className="text-sm text-white/60">
          <Link href="/" className="hover:text-white">Home</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <Link href="/blog" className="hover:text-white">Blog</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span className="text-white/90">Japanese Cedar Bonsai</span>
        </nav>

        <article className="mt-10">
          <header className="mx-auto max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-white/60">
              <span className="rounded-full border border-purple-400/30 bg-purple-400/10 px-3 py-1 font-semibold text-purple-200">{post.category}</span>
              <time dateTime={post.publishedAt}>October 31, 2026</time>
              <span>{post.readTime}</span>
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">{post.title}</h1>
            {author && <p className="mt-5 text-sm text-white/60">By <Link href={`/author/${author.slug}`} className="text-purple-200 hover:text-white">{author.name}</Link></p>}
          </header>

          <figure className="my-10">
            <Image
              src={getPostImage(post)}
              alt={getPostImageAlt(post)}
              width={1672}
              height={941}
              priority
              sizes="(max-width: 1024px) 100vw, 976px"
              className="h-auto w-full rounded-2xl border border-white/10"
            />
            <figcaption className="mt-3 text-center text-xs leading-5 text-white/50">A warrior-inspired bonsai against misty mountains. AI-generated ink-and-watercolor illustration.</figcaption>
          </figure>

          <div className="mx-auto max-w-3xl space-y-6 text-lg leading-8 text-white/85 sm:leading-9">
            <p className="font-serif text-2xl leading-relaxed text-white sm:text-3xl">Imagine an entire forest reduced to one tree—and that tree looks like it’s guarding something.</p>
            <p>That’s the appeal of a Japanese cedar bonsai with a warrior-inspired shape. A strong trunk. Deliberate branches. Enough space between the foliage to see its structure. You can picture it standing on a mountainside, taking whatever the weather throws at it.</p>
            <p className="font-semibold text-white">Except it fits in a pot.</p>
            <p>Japanese cedar, known as <em>sugi</em>, brings fine green needles and textured bark to the composition. It’s often styled upright, echoing the way it grows in nature. That natural posture makes a compelling starting point for a tree with a watchful, almost defiant presence. <a href={CARE_GUIDE} className="text-purple-200 underline decoration-purple-300/40 underline-offset-4 hover:text-white">Bonsai Empire</a></p>
            <p>“Warrior” here is a creative theme. Think of a lone sentry: feet planted, shoulders balanced, completely still. You can suggest that feeling through the tree’s shape without adding a single miniature sword.</p>
            <p className="font-serif text-2xl leading-relaxed text-white">The hardest part? Knowing when to leave it alone.</p>
            <p>With bonsai, it’s tempting to keep adjusting. Trim this. Bend that. Make it look older by next Tuesday. But a convincing tree develops slowly. A branch needs time to thicken. Fresh growth needs room. Sometimes the best decision you make all week is putting the scissors down.</p>
            <p>That’s where the hobby gets interesting. You start noticing things you used to walk past: a new shoot, a patch of bark, the way morning light catches the needles. Checking on a little tree somehow becomes a reason to step outside.</p>
            <p className="font-semibold text-white">Of course, your tiny warrior still gets thirsty.</p>
            <p>Japanese cedar bonsai needs close attention to watering; its rootball shouldn’t dry out completely. It benefits from partial shade during intense summer heat, and its roots need protection from freezing in a shallow pot. Older branches can also be brittle, so dramatic styling requires patience and care. <a href={CARE_GUIDE} className="text-purple-200 underline decoration-purple-300/40 underline-offset-4 hover:text-white">Bonsai Empire care guide</a></p>
            <p>Choose a simple pot. Give it an uncluttered outdoor setting suited to its needs. Let the trunk and branches do the talking.</p>
            <p className="font-semibold text-white">Then take a photo.</p>
            <p>A year from now, take another. The difference between those two pictures—the growth, the choices, the occasional mistake—is where this tree’s story really begins.</p>
          </div>
        </article>

        <div className="mx-auto mt-14 max-w-3xl space-y-10">
          <aside className="rounded-3xl border border-purple-400/20 bg-purple-500/10 p-7 sm:p-9" aria-labelledby="bonsai-workshop-heading">
            <h2 id="bonsai-workshop-heading" className="font-serif text-2xl font-bold text-white">Start your own bonsai story</h2>
            <p className="mt-3 leading-7 text-white/75">Explore Color Cocktail Factory’s bonsai workshop and check the available dates and project details.</p>
            <Link href="/activities/bonsai" className="mt-5 inline-flex rounded-full bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-500">Explore the bonsai workshop →</Link>
          </aside>
          {author && <AuthorBio author={author} />}
          <Link href="/blog" className="inline-block text-sm font-semibold text-purple-200 hover:text-white">← Back to all articles</Link>
        </div>
      </div>
    </main>
  );
}
