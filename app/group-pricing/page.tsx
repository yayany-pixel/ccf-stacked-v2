import type { Metadata } from "next";
import Link from "next/link";
import { potteryGroups, otherGroups, specialGroups, requestPotteryGroups, usd, type GroupActivity } from "@/lib/adultGroupPricing";

export const metadata: Metadata = {
  title: "Adult Group Pricing for 10 & 20 Guests",
  description: "Compare private adult workshop prices for 10 or 20 guests: pottery with or without firing, Turkish lamps, bonsai, painting and more in Chicago and Eugene.",
  alternates: { canonical: "https://colorcocktailfactory.com/group-pricing" },
};

function Price({ amount, guests, label }: { amount: number; guests: number; label: string }) {
  return <div><dt className="text-xs text-primary/65">{label}</dt><dd className="mt-1 text-xl font-semibold tabular-nums">{usd(amount * guests)} <span className="block text-sm font-normal text-primary/70">{usd(amount)} per person</span></dd></div>;
}

function Menu({ items, pottery = false }: { items: GroupActivity[]; pottery?: boolean }) {
  return <div className="mt-6 space-y-3">{items.map(item => <article key={item.name} className="grid gap-5 rounded-2xl border border-white/15 bg-surface-secondary p-5 sm:grid-cols-[1.4fr_1fr_1fr] sm:p-6">
    <div><h3 className="text-lg font-semibold">{item.name}</h3>{item.note && <p className="mt-2 text-sm leading-relaxed text-primary/70">{item.note}</p>}</div>
    {([10, 20] as const).map(guests => {
      const base = guests === 10 ? item.ten : item.twenty;
      return <div key={guests} className="border-t border-border pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0"><h4 className="mb-3 font-semibold text-purple-200">{guests} adults</h4><dl className="grid grid-cols-2 gap-3 sm:grid-cols-1"><Price amount={base} guests={guests} label={pottery ? "Without firing" : "Group total"} />{pottery && <Price amount={base + (item.finishing ?? 20)} guests={guests} label="Fired + glazed" />}</dl></div>;
    })}
  </article>)}</div>;
}

export default function AdultGroupPricingPage() {
  return <main id="main-content" tabIndex={-1} className="min-h-screen pb-20 pt-28">
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <Link href="/private-events" className="text-sm text-purple-200 underline underline-offset-4">Private events</Link>
      <header className="max-w-3xl py-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-purple-200">Chicago &amp; Eugene · Adults only</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-6xl">Your people. Your project. Your private party.</h1>
        <p className="mt-6 text-lg leading-relaxed text-primary/80">Straightforward group quotes for 10 or 20 adults. Pick a creative experience, compare the total, and tell us your preferred city and date.</p>
        <p className="mt-4 text-sm leading-relaxed text-primary/65">All prices are in USD for in-studio private workshops. Activities vary by city. We confirm your project, space, instructor, equipment, and availability before booking. These are adult packages; individual activities may have additional age requirements.</p>
        <div className="mt-6 flex flex-wrap gap-3"><Link href="/private-events?city=chicago#inquiry-form" className="rounded-full bg-purple-200 px-5 py-3 font-semibold text-slate-950">Request Chicago dates</Link><Link href="/private-events?city=eugene#inquiry-form" className="rounded-full border border-white/30 px-5 py-3 font-semibold">Request Eugene dates</Link></div>
      </header>
      <nav aria-label="Pricing categories" className="flex flex-wrap gap-3 border-y border-white/15 py-5 text-sm">{[["pottery", "Pottery"], ["other", "Lamps, plants & painting"], ["special", "Special requests"], ["details", "What’s included"]].map(([id, label]) => <a key={id} href={`#${id}`} className="rounded-full bg-surface-secondary px-4 py-2 hover:bg-surface-secondary">{label}</a>)}</nav>
      <section id="pottery" className="scroll-mt-28 py-12">
        <h2 className="font-serif text-3xl sm:text-4xl">Pottery: choose your finish</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-white/15 p-5"><h3 className="font-semibold">Without firing</h3><p className="mt-2 text-sm leading-relaxed text-primary/75">Instruction, clay, tools, and cleanup. Any clay piece taken home is unfired, fragile, and not food-safe. Paint Your Own Pottery uses a ceramic blank, but its glaze remains unfinished without firing.</p></div><div className="rounded-2xl border border-purple-300/30 bg-btn/10 p-5"><h3 className="font-semibold">Fired + glazed</h3><p className="mt-2 text-sm leading-relaxed text-primary/75">The workshop plus the required kiln firings and a standard solid-color or clear glaze. One standard-size piece per person unless listed otherwise. Pickup is generally around three weeks later; timing is an estimate.</p></div></div>
        <Menu items={potteryGroups} pottery />
        <p className="mt-5 text-sm leading-relaxed text-primary/70">Standard finishing adds $20 per piece. Mug &amp; Bowl, Pipe &amp; Ashtray, and Plate Set include two pieces, adding $40 per person. Charcuterie board finishing is $25 per board; chess finishing is $80 per shared set, excluding a ceramic board. Bisque-only firing is available by request at $10 per standard piece. Specialty finishes and extra pieces are quoted separately.</p>
      </section>
      <section id="other" className="scroll-mt-28 border-t border-white/15 py-12">
        <h2 className="font-serif text-3xl sm:text-4xl">Lamps, plants, painting &amp; more</h2><p className="mt-4 text-primary/75">Instruction, standard materials, and cleanup are included. Glass fusion also includes kiln processing and later pickup.</p>
        <Menu items={otherGroups} />
        <p className="mt-5 text-sm leading-relaxed text-primary/70">Date Night Candle Making, Terrarium, Watercolor, and Bonsai use the corresponding per-person group rates above when each guest receives their own project.</p>
      </section>
      <section id="special" className="scroll-mt-28 border-t border-white/15 py-12">
        <h2 className="font-serif text-3xl sm:text-4xl">Special requests</h2><p className="mt-4 text-primary/75">Ask about these formats when sending your inquiry. We confirm the instructor, materials, and city availability before accepting a booking.</p>
        <Menu items={specialGroups} /><Menu items={requestPotteryGroups} pottery />
      </section>
      <section id="details" className="scroll-mt-28 rounded-3xl border border-white/15 bg-surface-secondary p-6 sm:p-9">
        <h2 className="font-serif text-3xl">What your group quote includes</h2>
        <ul className="mt-5 list-disc space-y-3 pl-5 leading-relaxed text-primary/80">
          <li>A reserved workshop area, standard materials, tools, cleanup, and instruction, except Open Studio, which includes supervision rather than a beginner lesson.</li>
          <li>A standard session of up to two hours. Longer projects, extra time, and full-studio exclusivity are quoted separately.</li>
          <li>The 20-person rate requires 20 paid participants and one organizer payment. Coupons and additional discounts do not stack. Other group sizes receive a custom quote.</li>
          <li>Individual-wheel packages require a wheel for each guest. Shared-wheel Date Night uses one wheel per pair. We confirm equipment and instructor coverage before accepting a group of 20.</li>
          <li>Pottery finishing applies only when the fired-and-glazed package is selected. This private-group menu has its own inclusions, separate from public-class offers.</li>
          <li>Wheel throwing is a learning experience; a successful finished piece is not guaranteed. Kiln results can vary.</li>
          <li>Catering, shipping, and applicable tax are excluded. Bring your preferred activity and finishing choice to the inquiry form.</li>
        </ul>
        <div className="mt-7 flex flex-wrap gap-4"><Link href="/private-events#inquiry-form" className="rounded-full bg-purple-200 px-6 py-3 font-semibold text-slate-950">Plan your adult group event</Link><Link href="/kids#birthdays" className="self-center text-sm text-purple-200 underline underline-offset-4">Looking for kids’ birthday parties?</Link></div>
      </section>
    </div>
  </main>;
}
