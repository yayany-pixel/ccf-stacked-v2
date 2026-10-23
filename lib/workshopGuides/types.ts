export type WorkshopGuideSection = {
  heading: string;
  paragraphs: string[];
  tips?: string[];
};

export type WorkshopGuideFAQ = {
  question: string;
  answer: string;
};

export type WorkshopGuide = {
  slug: string;
  title: string;
  description: string;
  activitySlug: string;
  city: "chicago" | "eugene" | null;
  category: string;
  keywords: string[];
  intro: string[];
  sections: WorkshopGuideSection[];
  faqs: WorkshopGuideFAQ[];
};
