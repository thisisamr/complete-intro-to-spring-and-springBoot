import config from "../course.json";

const DEFAULT_CONFIG = {
  author: {
    name: "Amr Soliman",
    company: "Code Skool",
  },
  title: "Complete intro to spring and spring boot",
  subtitle: "Master the Fundamentals the most widely used java framework",
  youtubelink: "https://www.youtube.com/@thisis3mr",
  description:
    "This comprehensive course guides you from the very basics of JavaScript, including variables, data types, and operators, through essential concepts like the Document Object Model (DOM), functions, and control flow. You'll gain practical experience with arrays, objects, asynchronous programming, and modern JavaScript features, equipping you to build dynamic and interactive web applications.",
  keywords: [
    "java",
    "object oriented design",
    "spring",
    "backend",
    "spring boot",
    "inversion of control",
  ],
  social: {
    linkedin: "thisisamr",
    github: "thisisamr",
    twitter: "thisisamr",
    bluesky: "thisisamr.bsky.social",
  },
  productionBaseUrl: "/",
};

export default function getCourseConfig() {
  return Object.assign({}, DEFAULT_CONFIG, config);
}
