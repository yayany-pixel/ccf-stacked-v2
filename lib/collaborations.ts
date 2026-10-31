export type Collaboration = {
  name: string;
  homepage: string;
  logo: string;
  detail?: string;
  darkLogoBackground?: boolean;
};

export const WORKSHOP_ORGANIZATIONS: Collaboration[] = [
  { name: "Google", homepage: "https://www.google.com/", logo: "google.png", detail: "Chicago health team" },
  { name: "fairlife", homepage: "https://fairlife.com/", logo: "fairlife.svg", detail: "Workshop via Now Plus One" },
  { name: "University of Illinois Chicago", homepage: "https://www.uic.edu/", logo: "uic.svg", detail: "Family & Community Medicine" },
  { name: "University of Chicago", homepage: "https://www.uchicago.edu/", logo: "uchicago.svg", detail: "YK Lab" },
  { name: "Ferrara", homepage: "https://www.ferrara.com/us/en", logo: "ferrara.svg" },
  { name: "Miller Cooper & Co.", homepage: "https://millercooper.com/", logo: "miller-cooper.png", darkLogoBackground: true },
  { name: "Rush University", homepage: "https://www.rushu.rush.edu/", logo: "rush.svg" },
  { name: "National Museum of Mexican Art", homepage: "https://nationalmuseumofmexicanart.org/", logo: "nmma.svg" },
  { name: "One Million Degrees", homepage: "https://onemilliondegrees.org/", logo: "omd.svg" },
  { name: "Metropolitan Family Services", homepage: "https://www.metrofamily.org/", logo: "mfs.jpg" },
  { name: "Advanced Dermatology & Aesthetic Medicine", homepage: "https://advanceddermchi.com/", logo: "advanced-derm.avif" },
  { name: "Neighborhood Loans", homepage: "https://neighborhoodloans.com/", logo: "neighborhood-loans.svg", detail: "The Butler Group" },
  { name: "Groundwaves", homepage: "https://www.groundwaveshiphop.com/", logo: "groundwaves.png", detail: "Via Supply & Demand Music" },
  { name: "El Hogar del Niño", homepage: "https://www.elhogardelnino.org/", logo: "el-hogar.png", detail: "Now part of Brightpoint" },
  { name: "Brideside", homepage: "https://brideside.com/", logo: "brideside.png" },
];

export const BOOKING_PARTNERS: Collaboration[] = [
  { name: "Groupon", homepage: "https://www.groupon.com/", logo: "groupon.png" },
  { name: "Classpop!", homepage: "https://www.classpop.com/", logo: "classpop.png" },
  { name: "CourseHorse", homepage: "https://coursehorse.com/", logo: "coursehorse.png" },
];
