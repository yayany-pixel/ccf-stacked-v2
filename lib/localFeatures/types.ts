export type LocalArticleLink = { label: string; url: string };
export type LocalArticleIdea = { title: string; detail: string; url?: string };
export type LocalArticleSection = {
  heading: string;
  paragraphs: string[];
  ideas?: LocalArticleIdea[];
};
export type LocalFeature = {
  slug: string;
  title: string;
  description: string;
  city: "chicago" | "eugene" | null;
  category: string;
  keywords: string[];
  intro: string[];
  sections: LocalArticleSection[];
  tips: string[];
  faqs: Array<{ question: string; answer: string }>;
  relatedActivitySlugs: string[];
  relatedPostSlugs: string[];
  sources?: LocalArticleLink[];
};

export const LOCAL_FEATURE_PUBLISHED_AT = "2026-10-23";

export function localFeatureWordCount(article: LocalFeature): number {
  return [
    ...article.intro,
    ...article.sections.flatMap(section => [
      section.heading, ...section.paragraphs,
      ...(section.ideas || []).flatMap(idea => [idea.title, idea.detail]),
    ]),
    ...article.tips,
    ...article.faqs.flatMap(faq => [faq.question, faq.answer]),
  ].join(" ").trim().split(/\s+/).length;
}
