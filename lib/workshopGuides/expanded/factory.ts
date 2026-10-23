import type { WorkshopGuide } from "../types";

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

function locationLabel(city: ActivityEditorialSeries["city"]): string {
  if (city === "chicago") return "Chicago";
  if (city === "eugene") return "Eugene";
  return "the available Chicago, Eugene, or online location listed for the specific session";
}

function bookingParagraph(series: ActivityEditorialSeries, title: string, description: string): string {
  const loc = locationLabel(series.city);
  if (series.activitySlug === "glass-blowing") {
    return `Color Cocktail Factory currently labels its glass-blowing offering as coming soon. This is an educational article, not a claim that classes are taking bookings. Use the Glass Blowing activity page to check the current launch and waitlist information; do not book a different glass workshop assuming it is glass blowing. The distinction matters when planning ${description.toLowerCase()}.`;
  }
  if (series.activitySlug === "gift-cards") {
    return `For a gift connected to ${title.toLowerCase()}, start with Color Cocktail Factory's Gift Cards page and follow the actual checkout terms. Check the recipient's city, available workshop selection, card amount, any redemption restrictions, and separate pottery-finishing charges before buying. This article is inspiration rather than a promise of a specific class price or future schedule.`;
  }
  if (series.activitySlug === "private-parties") {
    return `If this approach sounds right for your group, submit a private-event inquiry to Color Cocktail Factory with your preferred city, realistic headcount, event type, and possible dates. A request is not a confirmed reservation. Ask the studio to verify available instructors, activities, accessibility, age limits, setup needs, and pricing before announcing a plan to guests.`;
  }
  if (["paper-pigment", "painting", "handbuilding", "parent-and-me"].includes(series.activitySlug)) {
    return `This is an overview of a family of creative sessions rather than a promise that one identical class runs every day. Start on the relevant Color Cocktail Factory activity page, choose your city, and confirm the actual upcoming project and age requirements. The exact materials, technique, duration, capacity, and price belong to the individual booking, so check the listing before making other plans in ${loc}.`;
  }
  return `At Color Cocktail Factory, the corresponding activity page is the best place to verify sessions for ${loc}. Select the correct studio or online format and check the live booking calendar, ticket unit, current price, age policy, and included supplies. If your project uses clay, kiln firing and glazing may be separately priced; check finishing and pickup terms before paying. ${series.city ? "Local availability is not a guarantee that a second studio runs the same workshop." : "Schedules can differ by location and over time."}`;
}

function twoRelatedQuestions(series: ActivityEditorialSeries): { question: string; answer: string }[] {
  if (series.activitySlug === "glass-blowing") return [
    { question: "Can I book this glass-blowing class now?", answer: "Not from this article. The activity is listed as coming soon; check its actual waitlist and availability before making plans." },
    { question: "Is glass fusion the same as glass blowing?", answer: "No. Glass fusion heats arranged compatible glass in a kiln; glass blowing shapes hot glass using specialized equipment." },
  ];
  if (series.activitySlug === "gift-cards") return [
    { question: "Can I assume a gift card covers every extra fee?", answer: "No. Check the card terms and the selected workshop's additional fees before purchasing." },
    { question: "Should I choose a city before buying?", answer: "Yes. Check where the recipient is likely to book, and confirm the gift card's scope and redemption options." },
  ];
  if (series.activitySlug === "private-parties") return [
    { question: "Does sending a request reserve a date?", answer: "No. A private event is not booked until the studio confirms an arrangement." },
    { question: "Can a large group pick any workshop?", answer: "Not automatically. Capacity, supplies, age rules, and instructor availability differ by activity." },
  ];
  if (["pipe-and-ashtray", "boobs-mug"].includes(series.activitySlug)) return [
    { question: "Is this workshop for adults?", answer: "Yes. The current activity registry identifies this workshop as 21+; confirm the actual booking requirements." },
    { question: "Are sculpted ceramics certified for specialized use?", answer: "No such certification should be assumed. Workshop pieces should be treated as decorative unless their materials, design, and intended use have been verified." },
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
    { question: "Does a class ticket include a shipped kit?", answer: "Do not assume it does. Confirm required materials, shipping, and time zones with the current listing." },
  ];
  if (series.activitySlug === "parent-and-me") return [
    { question: "Are all creative activities appropriate for every age?", answer: "No. Check the individual workshop's minimum age, materials, supervision, and any heat or sharp-tool requirements." },
    { question: "Does a ticket cover both parent and child?", answer: "Ticket units differ. Confirm the exact booking details before purchase." },
  ];
  return [
    { question: "Can a complete beginner participate?", answer: "Start with the current listing and its stated experience level. Guided beginner sessions teach core steps, but an exact finished result is never guaranteed." },
    { question: "Are all finishing materials and take-home services included?", answer: "Not necessarily. Verify ticket inclusions, any optional fees, and pickup or curing needs on the actual booking page." },
  ];
}

export function buildActivityEditorialGuides(series: ActivityEditorialSeries): WorkshopGuide[] {
  if (series.ideas.length !== 5 || series.notes.length !== 5) {
    throw new Error(`Every activity must contain exactly five editorial ideas and five subject notes: ${series.activitySlug}`);
  }

  return series.ideas.map((idea, index) => {
    const noteA = series.notes[index];
    const noteB = series.notes[(index + 2) % 5];
    return {
      slug: idea.slug,
      title: idea.title,
      description: idea.description,
      activitySlug: series.activitySlug,
      city: series.city,
      category: series.category,
      keywords: idea.keywords,
      intro: [idea.opening],
      sections: [
        { heading: idea.sections[0].heading, paragraphs: [idea.sections[0].text, noteA] },
        { heading: idea.sections[1].heading, paragraphs: [idea.sections[1].text] },
        { heading: idea.sections[2].heading, paragraphs: [idea.sections[2].text, noteB] },
        { heading: "Put the idea into practice", paragraphs: [bookingParagraph(series, idea.title, idea.description)] },
      ],
      faqs: [
        { question: idea.question, answer: idea.answer },
        ...twoRelatedQuestions(series),
      ],
    };
  });
}
