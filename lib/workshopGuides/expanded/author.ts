import type { GuideIdea } from "./factory";

/**
 * Keep editorial copy easy to review while enforcing three distinct lessons
 * per guide. A lesson uses "Heading :: paragraph", with a real paragraph
 * authored specifically for that article.
 */
export function idea(
  slug: string,
  title: string,
  description: string,
  opening: string,
  first: string,
  second: string,
  third: string,
  question: string,
  answer: string,
): GuideIdea {
  function section(value: string): { heading: string; text: string } {
    const separator = value.indexOf(" :: ");
    if (separator === -1) throw new Error(`Guide ${slug} has a malformed section`);
    const heading = value.slice(0, separator).trim();
    const text = value.slice(separator + 4).trim();
    if (heading.length < 4 || text.length < 90) {
      throw new Error(`Guide ${slug} needs a substantive authored lesson: ${heading}`);
    }
    return { heading, text };
  }
  return {
    slug,
    title,
    description,
    opening,
    sections: [section(first), section(second), section(third)],
    question,
    answer,
    keywords: [title.toLowerCase(), description.toLowerCase().slice(0, 80)],
  };
}
