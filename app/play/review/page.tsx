import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mobile layout review", robots: { index: false, follow: false } };

/** A real narrow iframe viewport for preview QA; unavailable in production. */
export default function MobileReview() {
  if (!process.env.CCF_DEPLOY_ORIGIN?.startsWith("https://deploy-preview-")) notFound();
  return <main id="main-content" style={{ minHeight: "100vh", padding: 24, background: "#e0e0dc", color: "#333" }}>
    <h1 style={{ fontSize: 18, marginBottom: 8 }}>Curiosity Studio · 390px layout review</h1>
    <p style={{ fontSize: 12, marginBottom: 18 }}>This review page is only available on Netlify deploy previews.</p>
    <iframe title="Mobile preview" src="/play" width="390" height="844" style={{ display: "block", border: "1px solid #aaa", maxWidth: "100%", background: "#f6f1e7" }}/>
  </main>;
}
