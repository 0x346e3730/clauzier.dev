// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Antonin CLAUZIER - clauzier.dev";
export const SITE_DESCRIPTION =
  "Antonin CLAUZIER - clauzier.dev";
export const TWITTER_HANDLE = "@0x346e3730";
export const MY_NAME = "0x346e3730";

// setup in astro.config.mjs
const BASE_URL = new URL(import.meta.env.SITE);
export const SITE_URL = BASE_URL.origin;
