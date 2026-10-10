import React from "react";

export default function PotteryFinishingSection() {
  return (
    <section className="my-12" aria-labelledby="pottery-finishing-title">
      <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-6 sm:p-8 backdrop-blur-sm">
        <h2 id="pottery-finishing-title" className="font-serif text-2xl font-bold text-white">
          Optional Firing &amp; Glazing
        </h2>
        <p className="mt-3 text-base leading-relaxed text-white/80">
          Your class ticket includes the instruction, clay, and tools described above. Firing and glazing are optional and are not included in the class ticket. At the end of your session, you can choose whether to have your piece fired or glazed and select your preferred finish.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm text-white/90">
            <caption className="sr-only">Optional pottery firing and glazing pricing</caption>
            <thead>
              <tr className="border-b border-white/15 text-xs font-semibold uppercase tracking-wider text-white/60">
                <th scope="col" className="pb-3 pr-4">Finishing service</th>
                <th scope="col" className="pb-3 pl-4 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              <tr>
                <td className="py-3.5 pr-4 font-medium">Simple / bisque firing</td>
                <td className="py-3.5 pl-4 text-right font-semibold text-amber-300">$10 per piece</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-medium">Regular solid-color glaze</td>
                <td className="py-3.5 pl-4 text-right font-semibold text-amber-300">$20 per piece</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-medium">Fancy / specialty glaze</td>
                <td className="py-3.5 pl-4 text-right font-semibold text-amber-300">$35 per piece</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-medium">Gold glaze, when available</td>
                <td className="py-3.5 pl-4 text-right font-semibold text-amber-300">$50 per piece</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-white/70 border-t border-white/10 pt-4">
          Pieces left for firing or glazing are generally ready about three weeks after the workshop. This is an approximate turnaround, not a guaranteed collection date.
        </p>
      </div>
    </section>
  );
}
