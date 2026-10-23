import type { LocalFeature, LocalArticleIdea, LocalArticleLink } from "./types";

export type FeatureDraft = {
  slug: string;
  title: string;
  description: string;
  city: "chicago" | "eugene" | null;
  category: string;
  keywords: string[];
  intro: [string, string];
  opening: { heading: string; paragraphs: [string, string] };
  list: { heading: string; intro: string; ideas: Array<[title: string, detail: string, url?: string]> };
  planning: { heading: string; paragraphs: [string, string] };
  tips: [string, string, string];
  faqs: [question: string, answer: string][];
  relatedActivitySlugs: string[];
  relatedPostSlugs: string[];
  sources?: LocalArticleLink[];
};

export function feature(draft: FeatureDraft): LocalFeature {
  if (draft.list.ideas.length < 3) throw new Error(`No substantive list for ${draft.slug}`);
  if (draft.faqs.length < 2) throw new Error(`Missing FAQs in ${draft.slug}`);
  if (draft.intro.some(p => p.length < 90)) throw new Error(`Brief intro in ${draft.slug}`);
  if (draft.opening.paragraphs.some(p => p.length < 90)) throw new Error(`Brief contextual discussion in ${draft.slug}`);
  if (draft.planning.paragraphs.some(p => p.length < 90)) throw new Error(`Brief practical section in ${draft.slug}`);
  if (draft.list.ideas.some(([,detail]) => detail.length < 55)) throw new Error(`Thin idea in ${draft.slug}`);
  return {
    slug: draft.slug,
    title: draft.title,
    description: draft.description,
    city: draft.city,
    category: draft.category,
    keywords: draft.keywords,
    intro: [...draft.intro],
    sections: [
      { heading: draft.opening.heading, paragraphs: [...draft.opening.paragraphs] },
      {
        heading: draft.list.heading,
        paragraphs: [draft.list.intro],
        ideas: draft.list.ideas.map(([title,detail,url]): LocalArticleIdea => ({title,detail,url})),
      },
      { heading: draft.planning.heading, paragraphs: [...draft.planning.paragraphs] },
    ],
    tips: [...draft.tips],
    faqs: draft.faqs.map(([question, answer])=>({question,answer})),
    relatedActivitySlugs: draft.relatedActivitySlugs,
    relatedPostSlugs: draft.relatedPostSlugs,
    sources: draft.sources,
  };
}
