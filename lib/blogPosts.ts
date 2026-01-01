export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  image: string;
  keywords: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "pottery-101-beginners-guide",
    title: "Pottery 101: A Beginner's Guide to Getting Started with Ceramics",
    description: "Everything you need to know to start your pottery journey - from choosing clay to mastering the wheel. Perfect for complete beginners!",
    date: "2025-01-15",
    author: "Color Cocktail Factory",
    category: "Pottery Basics",
    readTime: "8 min read",
    image: "/images/blog/pottery-101.jpg",
    keywords: [
      "pottery for beginners",
      "how to start pottery",
      "pottery wheel basics",
      "pottery classes chicago",
      "pottery classes eugene",
      "ceramic pottery tutorial",
      "beginner pottery tips",
      "pottery throwing techniques"
    ]
  },
  {
    slug: "chicago-date-night-ideas",
    title: "10 Unique Date Night Ideas in Chicago (Beyond Dinner & Movies)",
    description: "Discover the best creative date night experiences in Chicago, from pottery classes to glass fusion workshops. Make memories that last!",
    date: "2025-01-10",
    author: "Color Cocktail Factory",
    category: "Date Night Ideas",
    readTime: "6 min read",
    image: "/images/blog/date-night-chicago.jpg",
    keywords: [
      "date night chicago",
      "unique date ideas chicago",
      "couples activities chicago",
      "romantic things to do chicago",
      "pottery date night",
      "chicago date night workshops",
      "pilsen date night",
      "creative date ideas chicago"
    ]
  },
  {
    slug: "eugene-date-night-ideas",
    title: "10 Romantic Date Night Ideas in Eugene, Oregon (Creative & Unique)",
    description: "Explore the best creative date experiences in Eugene - from pottery workshops to glass art. Perfect for couples seeking unique, hands-on activities!",
    date: "2025-01-08",
    author: "Color Cocktail Factory",
    category: "Date Night Ideas",
    readTime: "6 min read",
    image: "/images/blog/date-night-eugene.jpg",
    keywords: [
      "date night eugene oregon",
      "unique date ideas eugene",
      "couples activities eugene",
      "romantic things to do eugene",
      "pottery date night eugene",
      "eugene oregon date night",
      "downtown eugene date ideas",
      "creative date ideas eugene",
      "whiteaker date night"
    ]
  },
  {
    slug: "pilsen-student-guide",
    title: "Student Guide to Chicago's Pilsen Neighborhood: What to Do Before & After Class",
    description: "Discover the best coffee shops, murals, restaurants, and nightlife in Pilsen. Your complete guide to exploring Chicago's most vibrant artistic neighborhood.",
    date: "2025-01-02",
    author: "Color Cocktail Factory",
    category: "Neighborhood Guides",
    readTime: "12 min read",
    image: "/images/blog/pilsen-guide.jpg",
    keywords: [
      "pilsen chicago guide",
      "things to do in pilsen",
      "pilsen coffee shops",
      "pilsen murals",
      "pilsen restaurants",
      "pilsen neighborhood chicago",
      "18th street chicago",
      "pilsen student guide",
      "chicago art district",
      "pilsen nightlife",
      "national museum of mexican art",
      "pilsen street art"
    ]
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
