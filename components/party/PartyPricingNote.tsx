import Link from "next/link";

export default function PartyPricingNote() {
  return <p className="mt-4 text-sm leading-relaxed">
    <Link href="/group-pricing" className="font-semibold underline underline-offset-4">Compare exact adult group totals for 10 &amp; 20 guests →</Link>
    {" "}Pottery firing and glazing are optional; pickup is about three weeks later when selected. Other group sizes receive a custom quote.
  </p>;
}
