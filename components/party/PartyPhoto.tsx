import Image from "next/image";

const photos = {
  wheel: ["approved-07-Go6xn9-08daf172fdf1.webp", "A couple working together on clay at a pottery wheel"],
  handbuilding: ["approved-05-9-c5wW-833640afcace.webp", "A participant handbuilding pottery at a studio table"],
  lamp: ["approved-28-k53Mrx-cda788618ed1.webp", "Two workshop guests with colorful mosaic lamps"],
  mosaic: ["approved-32-rW3n0V-cadbf04e7dff.webp", "Two guests showing their colorful mosaic creations"],
  terrarium: ["approved-16-be3SrC-424e14c07efd.webp", "Two guests arranging plants in terrarium containers"],
  bonsai: ["approved-01-HsW-Hv-48dba9a4f983.webp", "Two workshop guests holding their finished bonsai trees"],
  candle: ["approved-03-3xOd0G-3b868ddea3a9.webp", "A candle-making instructor helping guests at a studio worktable"],
} as const;

export type PartyPhotoKind = keyof typeof photos;

export default function PartyPhoto({ kind, hero = false }: { kind: PartyPhotoKind; hero?: boolean }) {
  const [file, alt] = photos[kind];
  return <div className={hero ? "relative mx-auto mt-6 h-24 w-full max-w-3xl overflow-hidden rounded-2xl min-[375px]:h-36 sm:h-64" : "relative mb-5 aspect-[4/3] w-full overflow-hidden rounded-xl"}>
    <Image src={`/images/classes/${file}`} alt={alt} fill sizes={hero ? "(max-width: 768px) 100vw, 768px" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"} className="object-cover" priority={hero} />
  </div>;
}
