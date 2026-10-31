import Image from "next/image";
import { BOOKING_PARTNERS, WORKSHOP_ORGANIZATIONS, type Collaboration } from "@/lib/collaborations";

function OrganizationCard({ organization }: { organization: Collaboration }) {
  return (
    <li className="min-w-0">
      <a
        href={organization.homepage}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${organization.name} homepage (opens in a new tab)`}
        className="group flex h-full flex-col items-center rounded-xl border border-white/15 bg-white/[0.04] p-3 text-center transition-colors hover:border-purple-300/60 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-300"
      >
        <span className={`flex h-20 w-full items-center justify-center rounded-lg px-3 py-2 ${organization.darkLogoBackground ? "bg-slate-800" : "bg-white"}`}>
          <Image
            src={`/images/collaborations/${organization.logo}`}
            alt={`${organization.name} logo`}
            width={180}
            height={64}
            unoptimized
            className="h-full w-full object-contain"
          />
        </span>
        <span className="mt-3 text-xs font-semibold leading-relaxed text-white/90 group-hover:text-white">
          {organization.name}
        </span>
        {organization.detail && (
          <span className="mt-1 text-[11px] leading-relaxed text-white/60">{organization.detail}</span>
        )}
      </a>
    </li>
  );
}

export default function FooterCollaborations() {
  return (
    <section id="our-collaborations" aria-labelledby="collaborations-heading" className="mb-12 border-b border-white/10 pb-12">
      <div className="mx-auto mb-7 max-w-2xl text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-purple-300">Made together</p>
        <h2 id="collaborations-heading" className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Creative experiences for teams &amp; communities
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          Teams and groups from these organizations have booked experiences at Color Cocktail Factory.
        </p>
      </div>

      <ul aria-label="Organizations that booked creative experiences" className="collaboration-grid grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {WORKSHOP_ORGANIZATIONS.map((organization) => <OrganizationCard key={organization.name} organization={organization} />)}
      </ul>

      <div className="mt-8">
        <h3 className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Booking partners</h3>
        <ul aria-label="Workshop booking partners" className="collaboration-grid mx-auto grid max-w-2xl grid-cols-1 gap-3 min-[360px]:grid-cols-3">
          {BOOKING_PARTNERS.map((organization) => <OrganizationCard key={organization.name} organization={organization} />)}
        </ul>
      </div>
    </section>
  );
}
