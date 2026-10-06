import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";

export default function InstructorPortalNotice() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20">
      <GlassCard className="p-8 sm:p-12">
        <p className="mb-3 text-sm uppercase tracking-widest text-purple-300">For our instructors</p>
        <h1 className="mb-4 font-serif text-3xl">Your portal is coming soon.</h1>
        <p className="mb-4 leading-relaxed text-white/80">
          Online sign-in and dashboard access are not available yet. Please contact your studio manager for your schedule, class materials, and resources.
        </p>
        <p className="mb-8 text-sm text-white/60">This page does not collect passwords or provide access to instructor records.</p>
        <div className="flex flex-wrap gap-3">
          <ButtonPill href="mailto:support@colorcocktailfactory.com">Contact the studio</ButtonPill>
          <ButtonPill href="/teach/apply" variant="ghost">Apply to teach</ButtonPill>
        </div>
      </GlassCard>
    </div>
  );
}
