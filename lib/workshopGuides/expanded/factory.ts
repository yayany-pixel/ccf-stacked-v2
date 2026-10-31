import type { WorkshopGuide } from "../types";
import { getActivityDetailBySlug } from "../../activityRegistry";

export type GuideIdea = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  opening: string;
  /** Three article-specific lessons. Distinct editorial text for every post. */
  sections: [
    { heading: string; text: string },
    { heading: string; text: string },
    { heading: string; text: string },
  ];
  question: string;
  answer: string;
};

export type ActivityEditorialSeries = {
  activitySlug: string;
  category: string;
  city: "chicago" | "eugene" | null;
  /** Five workshop-specific notes that are rotated across articles, not repeated wholesale. */
  notes: [string, string, string, string, string];
  ideas: [GuideIdea, GuideIdea, GuideIdea, GuideIdea, GuideIdea];
};

function bookingParagraph(series: ActivityEditorialSeries): string {
  const name = getActivityDetailBySlug(series.activitySlug)?.title || series.activitySlug;
  const link = `[${name}](/activities/${series.activitySlug})`;
  return series.activitySlug === "glass-blowing"
    ? `Glass blowing is coming soon; visit the ${link} page for waitlist updates.`
    : `See current dates and prices on the ${link} page.`;
}

function twoRelatedQuestions(series: ActivityEditorialSeries): { question: string; answer: string }[] {
  if (series.activitySlug === "glass-blowing") return [
    { question: "Is glass fusion the same as glass blowing?", answer: "No. Glass fusion heats arranged compatible glass in a kiln; glass blowing shapes hot glass using specialized equipment." },
  ];
  if (["gift-cards", "private-parties"].includes(series.activitySlug)) return [];
  if (["pipe-and-ashtray", "boobs-mug"].includes(series.activitySlug)) return [
    { question: "Is this workshop for adults?", answer: "Yes. This workshop is for adults aged 21 and over." },
    { question: "Are sculpted ceramics certified for specialized use?", answer: "Treat workshop pieces as decorative unless their materials, design, and intended use have been verified for that purpose." },
  ];
  if (["bonsai", "vip-date-night-bonsai"].includes(series.activitySlug)) return [
    { question: "Does every tree need the same watering schedule?", answer: "No. Species, pot, soil, season, and light conditions determine how often it needs water." },
    { question: "Should I prune and repot on the same day?", answer: "Major simultaneous stresses may harm a tree. Follow species-specific instructor guidance and allow recovery when appropriate." },
  ];
  if (series.activitySlug.includes("terrarium")) return [
    { question: "Should a terrarium sit in direct midday sun?", answer: "Usually not. Glass containers can overheat; check the plants' actual light requirements." },
    { question: "Do closed terrariums need the same care as open ones?", answer: "No. Moisture, airflow, and plant selection should be matched to the design." },
  ];
  if (series.activitySlug.includes("candle") || series.activitySlug === "oogie-boogie") return [
    { question: "Is every handmade container safe for a lit candle?", answer: "No. Use a vessel and wick system designed and tested for the heat of a burning candle; never assume decorative objects are flame-safe." },
    { question: "Can a candle burn unattended?", answer: "No. Follow product instructions, keep flames clear of combustibles, and never leave a lit candle unattended." },
  ];
  if (series.activitySlug === "soap") return [
    { question: "Is melt-and-pour the same as cold-process soap?", answer: "No. Melt-and-pour starts with an already-saponified base; cold-process soap involves lye and requires specialized safeguards." },
    { question: "Can every fragrance oil go in soap?", answer: "No. Use only skin-safe additives at levels specified by their suppliers." },
  ];
  if (series.activitySlug === "online-cauldron") return [
    { question: "Do I need a kiln at home?", answer: "Check the current session's materials and finishing plan. Air-dry clay is not equivalent to fired ceramic clay." },
  ];
  if (series.activitySlug === "parent-and-me") return [
    { question: "Are all creative activities appropriate for every age?", answer: "No. Check the individual workshop's minimum age, materials, supervision, and any heat or sharp-tool requirements." },
  ];
  return [];
}

export function buildActivityEditorialGuides(series: ActivityEditorialSeries): WorkshopGuide[] {
  if (series.ideas.length !== 5 || series.notes.length !== 5) {
    throw new Error(`Every activity must contain exactly five editorial ideas and five subject notes: ${series.activitySlug}`);
  }

  return series.ideas.map((idea, index) => {
    const noteA = series.notes[index];
    const noteB = series.notes[(index + 2) % 5];
    const uniqueDetail = idea.sections[0].text.split(/[.!?]/)[0].trim();
    const descriptionDraft = idea.description.length >= 105
      ? idea.description
      : `${idea.description} ${uniqueDetail}.`;
    const description = descriptionDraft.length > 158
      ? `${descriptionDraft.slice(0, 154).replace(/\s+\S*$/, "").trim()}…`
      : descriptionDraft;
    return {
      slug: idea.slug,
      title: idea.title,
      description,
      activitySlug: series.activitySlug,
      city: series.city,
      category: series.category,
      keywords: idea.keywords,
      intro: [idea.opening],
      sections: [
        { heading: idea.sections[0].heading, paragraphs: [idea.sections[0].text, noteA] },
        { heading: idea.sections[1].heading, paragraphs: [idea.sections[1].text] },
        { heading: idea.sections[2].heading, paragraphs: [idea.sections[2].text, noteB] },
        { heading: "Put the idea into practice", paragraphs: [bookingParagraph(series)] },
      ],
      faqs: [
        { question: idea.question, answer: idea.answer },
        ...twoRelatedQuestions(series),
      ],
    };
  });
}
