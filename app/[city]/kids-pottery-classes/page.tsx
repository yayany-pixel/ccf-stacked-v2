import { notFound } from "next/navigation";
import { KidsCityPage } from "@/components/kids/KidsPage";
import { kidsMetadata } from "@/lib/kids";
export const dynamicParams = false;
export function generateStaticParams() { return [{ city: "chicago" }, { city: "eugene" }]; }
export function generateMetadata({ params }: { params: { city: string } }) {
  if (params.city !== "chicago" && params.city !== "eugene") notFound();
  return kidsMetadata(params.city, false);
}
export default function Page({ params }: { params: { city: string } }) {
  if (params.city !== "chicago" && params.city !== "eugene") notFound();
  return <KidsCityPage city={params.city} birthday={false} />;
}
