import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blogPosts";
import { getPostImage, getPostImageAlt } from "@/lib/blogPosts";
import { getAuthorBySlug } from "@/lib/authors";
import AuthorBio from "@/components/blog/AuthorBio";
import RelatedArticles from "@/components/blog/RelatedArticles";

const FOLKLORE_SOURCE = "https://source.museum.ie/en-IE/News/2023/Ghost-turnips%2C-pucas%2C-fortune-telling-and-evil-abd";
const PHOTO_SOURCE = "https://unsplash.com/photos/pink-ceramic-ghost-and-pumpkin-decor-iee2q--L5Q4";

export default function HalloweenPotteryArticle({ post }: { post: BlogPost }) {
  const author = getAuthorBySlug(post.authorSlug);

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-[#261c2d] text-[#fff7ee]">
      <div className="mx-auto max-w-5xl px-5 pb-20 pt-10 sm:px-6 sm:pt-16">
        <nav aria-label="Breadcrumb" className="text-sm text-white/65">
          <Link href="/" className="hover:text-white">Home</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <Link href="/blog" className="hover:text-white">Studio Journal</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span className="text-[#f1bdc7]">Halloween &amp; Pottery</span>
        </nav>

        <article className="mt-10">
          <header className="mx-auto max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-white/65">
              <span className="rounded-full border border-[#f1bdc7]/30 bg-[#f1bdc7]/10 px-3 py-1 font-semibold text-[#f1bdc7]">{post.category}</span>
              <time dateTime={post.publishedAt}>October 31, 2026</time>
              <span>{post.readTime}</span>
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{post.title}</h1>
            <p className="mt-5 text-xl leading-8 text-[#f1bdc7]">Four bowls. One blindfold. A questionable party game.</p>
            {author && <p className="mt-5 text-sm text-white/65">By <Link href={`/author/${author.slug}`} className="text-[#f1bdc7] hover:text-white">{author.name}</Link></p>}
          </header>

          <figure className="my-10">
            <Image
              src={getPostImage(post)}
              alt={getPostImageAlt(post)}
              width={1400}
              height={939}
              priority
              sizes="(max-width: 1024px) 100vw, 976px"
              className="h-auto w-full rounded-2xl border border-white/10"
            />
            <figcaption className="mt-3 text-center text-xs leading-5 text-white/60">
              A little Halloween pottery inspiration. Photo by <a href={PHOTO_SOURCE} className="underline underline-offset-4 hover:text-white">Barney Goodman / Unsplash</a>.
            </figcaption>
          </figure>

          <div className="mx-auto max-w-3xl space-y-6 text-lg leading-8 text-white/85 sm:leading-9">
            <p className="font-serif text-2xl leading-relaxed text-[#fff7ee] sm:text-3xl">You are blindfolded. In front of you sit four bowls.</p>
            <p>One holds a ring. One holds water. One holds food. One holds clay.</p>
            <p>Choose the ring, and marriage is supposedly coming. Water means emigration. Food promises prosperity.</p>
            <p>Choose the clay?</p>
            <p className="font-serif text-4xl text-[#f1bdc7]">Death.</p>
            <p className="font-semibold text-[#fff7ee]">Welcome to an Irish Halloween party. Hopefully, you enjoyed the snacks.</p>
            <p>This fortune-telling game is documented by the <a href={FOLKLORE_SOURCE} className="text-[#f1bdc7] underline underline-offset-4 hover:text-white">National Museum of Ireland</a>. People used ordinary objects to predict extraordinary things: who would marry, who would leave, who would prosper, who would die. And there, among the possible futures, sat a bowl of clay.</p>
            <p>For a potter, that is a deliciously uncomfortable detail. The stuff we turn into coffee mugs once had a role in delivering the worst party news imaginable.</p>
            <p>It also gives us a much more interesting place to begin connecting pottery and Halloween than putting an orange glaze on everything and calling it October.</p>
            <p className="font-serif text-2xl text-[#f1bdc7]">Because clay can get weird. Beautifully weird.</p>
            <p>Hold a lump in your palm. Squeeze it. Push two holes into it with your thumbs. Suddenly, something is looking back at you.</p>
            <p>You barely did anything. Yet your brain has already decided this object has a face, possibly an attitude, and perhaps a small grievance against you.</p>
            <p>Add a mouth. Now it looks hungry.</p>
            <p>Close the mouth. Now it knows something.</p>
            <p>That moment—when an ordinary material seems to acquire a personality—is where Halloween and pottery become very good friends.</p>
            <p>Think about a jack-o’-lantern. Its entire power comes from a few decisions: the angle of an eye, the width of a grin, the amount of darkness left inside. The <a href={FOLKLORE_SOURCE} className="text-[#f1bdc7] underline underline-offset-4 hover:text-white">National Museum of Ireland describes</a> the Irish tradition of carving frightening lanterns from turnips; pumpkins became the American development of that idea.</p>
            <p>Clay lets you play with the same unsettling possibilities. A hollow vessel becomes a head. Cut openings into its walls, place a battery-operated light inside the finished piece, and its expression changes when the room goes dark.</p>
            <p className="font-serif text-2xl text-[#f1bdc7]">The face you made in daylight might have other intentions after sunset.</p>
            <p>And unlike a pumpkin, it can return next October. Your little household monster gets a recurring role.</p>
            <p>Of course, we should keep the history honest. The fortune-telling game is documented. So are the vegetable lanterns. An ancient Halloween tradition of couples booking pottery classes is not. Nobody has uncovered a Celtic flyer advertising “Bring Your Own Mead.”</p>
            <p>The workshop is our invention. The folklore gives us something worth imagining.</p>
            <p>And imagination gets much more interesting when you stop demanding that everything turn out pretty.</p>
            <p>Anyone who has tried the pottery wheel knows the negotiation. You want a tall, graceful vase. The clay is considering a shallow, emotionally exhausted bowl.</p>
            <p>Usually, you try to correct it.</p>
            <p>For Halloween, you might ask a different question: what could this become?</p>
            <p>That sagging rim could be a creature’s lip. The swollen side could belong to a miniature cauldron. A handle could curl into a tail. A row of little clay teeth could turn an innocent planter into something you would hesitate to water.</p>
            <p>Technique still matters. But a strange shape gives you something to respond to. You can follow it somewhere unexpected.</p>
            <p>This is especially entertaining when you make pottery with someone you thought you knew.</p>
            <div className="space-y-4 border-l-2 border-[#d78455] pl-6 font-serif text-2xl leading-relaxed text-[#f1bdc7]">
              <p>Your sensible friend produces a cup with six eyes.</p>
              <p>Your partner spends forty minutes sculpting a single perfect fang.</p>
              <p>The quiet person at the table makes the most disturbing object in the room and politely asks where the carving tools go.</p>
            </div>
            <p className="font-semibold text-[#fff7ee]">You learn things.</p>
            <p>A Halloween pottery night can become a small exercise in inventing your own mythology. Make a creature that guards your keys. A bowl that eats your bad ideas. A ghost whose only unfinished business is finding its matching sock.</p>
            <p>Give the object a job. Give it a weakness. Give it a ridiculous name.</p>
            <p>Suddenly, you have a story you can hold.</p>
            <p>At Color Cocktail Factory, that is the kind of Halloween we want to make room for: people gathered around clay, surprising themselves, laughing at what appears beneath their hands.</p>
            <p>The old fortune-telling bowls offer another starting point. What would you put in a vessel to represent your future? What shape would you give a wish? What would a container for courage look like?</p>
            <p>Those are contemporary questions inspired by the folklore. Your answers can be funny, tender, grotesque, or all three.</p>
            <p>Perhaps your finished piece will sit beside the front door every autumn. Perhaps it will hold candy. Perhaps its expression will make visitors ask, “What is that supposed to be?”</p>
            <p>Excellent. Now you get to tell them.</p>
            <p>Once, at a Halloween gathering, choosing clay supposedly meant your story was ending.</p>
            <p className="font-serif text-2xl leading-relaxed text-[#f1bdc7] sm:text-3xl">At your pottery table, it can be where a very strange one begins.</p>
          </div>
        </article>

        <div className="mx-auto mt-14 max-w-3xl space-y-10">
          <aside className="rounded-3xl border border-[#f1bdc7]/25 bg-[#f1bdc7]/10 p-7 sm:p-9" aria-labelledby="halloween-workshop-heading">
            <h2 id="halloween-workshop-heading" className="font-serif text-3xl font-bold text-[#fff7ee]">Make something wonderfully strange.</h2>
            <p className="mt-4 leading-7 text-white/80">Explore <Link href="/activities/cauldron-pottery" className="text-[#f1bdc7] underline underline-offset-4">cauldron pottery</Link>, <Link href="/activities/handbuilding" className="text-[#f1bdc7] underline underline-offset-4">handbuilding</Link>, or <Link href="/activities/date-night-wheel" className="text-[#f1bdc7] underline underline-offset-4">date night on the wheel</Link>. Choose your studio to check available dates, project details, and finishing options.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/chicago" className="inline-flex rounded-full bg-[#f1bdc7] px-6 py-3 font-semibold text-[#34233c] hover:bg-[#f6d2d9]">Explore Chicago classes →</Link>
              <Link href="/eugene" className="inline-flex rounded-full border border-[#f1bdc7]/50 px-6 py-3 font-semibold text-[#f1bdc7] hover:bg-white/10">Explore Eugene classes →</Link>
            </div>
          </aside>
          {author && <AuthorBio author={author} />}
          <RelatedArticles slugs={post.relatedPostSlugs} />
          <Link href="/blog" className="inline-block text-sm font-semibold text-[#f1bdc7] hover:text-white">← Back to the Studio Journal</Link>
        </div>
      </div>
    </main>
  );
}
