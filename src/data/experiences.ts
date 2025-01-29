export type ColorType = 'primary' | 'secondary' | 'tertiary';
export type LocationType = 'remote' | 'on-site';

export interface Tag {
  label: string;
  colorType: ColorType;
}

export interface DateInfo {
  month: number; // 1-12
  year: number;
}

export interface Testimonial {
  quote: string;
  author: string;
  title: string;
}

export interface Experience {
  title: string;
  company: string;
  tags: Tag[];
  startDate: DateInfo;
  endDate: DateInfo | null;
  location: LocationType;
  description: string[];
  testimonial?: Testimonial;
}

export const experiences: Experience[] = [
  {
    title: "Lead Dev",
    company: "AudioWizard",
    tags: [
      { label: "Current", colorType: "primary" },
      { label: "Full-time", colorType: "secondary" }
    ],
    startDate: { month: 6, year: 2023 },
    endDate: null,
    location: "remote",
    description: [
      "Managing a team of 6 developers, making them grow and ensuring they have the right tools and environment to be happy and productive",
      "Working hand in hand with the Product to deliver features that meets our high quality standards and brings a lot of value to our clients the most efficient way possible",
      "Managing our infrastructure and introducing security measures across all departments to make sure our clients' data are safe",
      "Made it to 1M€ ARR !"
    ]
  },
  {
    title: "Open Source Developer",
    company: "PrestaShop",
    tags: [
      { label: "Freelance", colorType: "tertiary" }
    ],
    startDate: { month: 10, year: 2022 },
    endDate: { month: 6, year: 2023 },
    location: "remote",
    description: [
      "Migrating legacy parts of PrestaShop to Symfony",
      "Squashing bugs, improving some parts of the application",
      "Reviewing PRs on GitHub sent by other employees and the open-source community"
    ],
    testimonial: {
      quote: "I have been managing Antonin for 9 months in PrestaShop open source developer team. Antonin has demonstrated skills, team spirit and motivation and was able to find workarounds and innovative solutions when faced with obstacles. He has also brought up a fresh and different perspective on the PrestaShop project that allowed us to improve how we work.",
      author: "Mathieu Ferment",
      title: "Engineering Manager - PrestaShop"
    }
  },
  {
    title: "Back-End Engineer",
    company: "CoachHub",
    tags: [
      { label: "Freelance", colorType: "tertiary" }
    ],
    startDate: { month: 8, year: 2021 },
    endDate: { month: 8, year: 2022 },
    location: "remote",
    description: [
      "Symfony (DDD, CQRS) until 2022 then NestJS & TypeScript (Kafka, GraphQL)",
      "Maintaining and designing then developing new features for the backend micro-services API in collaboration with front-end developers",
      "Debugged errors related to Google Calendar APIs for the booking micro-service"
    ],
    testimonial: {
      quote: "Anto was really involved, doing a good job and was very patient with all the impediments he faced.",
      author: "Sylvain Leray",
      title: "Engineering Manager - CoachHub"
    }
  },
  {
    title: "Co-Founder, President & CTO",
    company: "LeBlueWall",
    tags: [
      { label: "Volunteer", colorType: "secondary" }
    ],
    startDate: { month: 7, year: 2021 },
    endDate: { month: 9, year: 2022 },
    location: "remote",
    description: [
      "Co-founded, been the president and the CTO of the biggest ever esports' fan association : LeBlueWall",
      "In the first year of the association we achieved a total of 667 members, over 5400 unique accounts and tens of thousands of followers across our social medias",
      "We revolutionized the esports scene by bringing together fans at viewing parties to support Karmine Corp all across France and even over the borders in Belgium, Switzerland and Canada. We also handled sales of hundreds of events tickets to our members, for tens of thousands of euros"
    ]
  },
  {
    title: "Studies and development engineer",
    company: "Darkmira",
    tags: [
      { label: "Full-time", colorType: "secondary" }
    ],
    startDate: { month: 5, year: 2021 },
    endDate: { month: 2, year: 2022 },
    location: "remote",
    description: [
      "Contributed to Symfony & Symfony Doc sponsored by Darkmira",
      "Participated in security audits with the CTO then joined MoovOne (later acquired by CoachHub) as reinforcement.",
      "Also live-studied for the Symfony certification on Twitch to bring visibility to Darkmira"
    ],
    testimonial: {
      quote: "Working as acting CTO in a small service company, it has been a pleasure working with Antonin. Interested and independent, Antonin has been able to work on the multiple missions (short to long) we asked him to work on. I have been able to enjoy his dedication while working closely with him on the security audits. I would work with him again anytime if the opportunity presents itself.",
      author: "Thomas Dutrion",
      title: "CTO - Darkmira"
    }
  },
  {
    title: "Web Developer",
    company: "ProWebCE (Edenred)",
    tags: [
      { label: "Full-time", colorType: "secondary" }
    ],
    startDate: { month: 12, year: 2017 },
    endDate: { month: 5, year: 2021 },
    location: "on-site",
    description: [
      "Evolutions & maintenance of the e-commerce website and its back-office",
      "Participated in the rework of the back-office in micro-services API"
    ],
    testimonial: {
      quote: "I worked with Antonin for a few years, I was impressed by his ability to learn. He meets all the challenges, both technical and functional, and always manages them. If you have the opportunity to work with him do not hesitate it will necessarily be beneficial for you.",
      author: "Hugues Gobet",
      title: "Tech Lead - PROWEBCE"
    }
  }
]; 