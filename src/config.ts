import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://arach.io/", // replace this with your deployed domain
  author: "Arach Tchoupani",
  desc: "Arach Tchoupani - Engineer & Entrepreneur",
  title: "Arach.io",
  ogImage: "assets/arach-io-screenshot.png",
  lightAndDarkMode: true,
  postPerPage: 8,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: true,
  svg: false,
  width: 100,
  height: 48,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/arach",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Facebook",
    href: "https://facebook.com/arach",
    linkTitle: `${SITE.title} on Facebook`,
    active: true,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/arach",
    linkTitle: `${SITE.title} on Instagram`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/arach",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:arach@tchoupani.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/arach",
    linkTitle: `${SITE.title} on Twitter`,
    active: false,
  },
];

export const GA_ID = {
  id: "G-995N2YP1J0",
};
