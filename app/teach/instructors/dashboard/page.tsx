import type { Metadata } from "next";
import InstructorPortalNotice from "@/components/teach/InstructorPortalNotice";

export const metadata: Metadata = {
  title: "Instructor Portal — Coming Soon",
  description: "The instructor portal is not available yet. Contact your studio manager for scheduling and resources.",
  robots: { index: false, follow: false },
};

export default function InstructorDashboardPage() {
  return <InstructorPortalNotice />;
}
