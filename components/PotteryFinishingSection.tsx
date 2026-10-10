import React from "react";

export default function PotteryFinishingSection() {
  return (
    <section className="my-12" aria-labelledby="pottery-finishing-title">
      <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-6 sm:p-8 backdrop-blur-sm">
        <h2 id="pottery-finishing-title" className="font-serif text-2xl font-bold text-white">
          Optional Firing &amp; Glazing
        </h2>
        <p className="mt-3 text-base leading-relaxed text-white/80">
          Your workshop includes the instruction, clay, and tools needed for the experience. Firing and glazing are optional and are not included in the class price. At the end of your session, you can choose whether to have your piece professionally finished.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm text-white/90">
            <caption className="sr-only">Approved pottery firing and glazing pricing</caption>
            <thead>
              <tr className="border-b border-white/15 text-xs font-semibold uppercase tracking-wider text-white/60">
                <th scope="col" className="pb-3 pr-4">Finishing Service</th>
                <th scope="col" className="pb-3 pl-4 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              <tr>
                <td className="py-3.5 pr-4 font-medium">Bisque firing</td>
                <td className="py-3.5 pl-4 text-right font-semibold text-amber-300">$10 per piece</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-medium">Regular solid-color glaze</td>
                <td className="py-3.5 pl-4 text-right font-semibold text-amber-300">$20 per piece</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-medium">Specialty/fancy glaze</td>
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
          Finished pieces are generally ready for pickup in approximately three weeks. Completion times are estimates, not guarantees.
        </p>
      </div>
    </section>
  );
}
