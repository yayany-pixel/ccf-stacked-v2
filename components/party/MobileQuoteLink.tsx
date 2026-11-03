import Link from "next/link";

export default function MobileQuoteLink({ href = "#inquiry-form" }: { href?: string }) {
  return <Link href={href} className="fixed inset-x-4 bottom-3 z-50 rounded-full bg-pink-600 px-5 py-3 text-center text-sm font-bold text-white shadow-xl md:hidden" style={{ marginBottom: "env(safe-area-inset-bottom)" }}>Get my party quote</Link>;
}
