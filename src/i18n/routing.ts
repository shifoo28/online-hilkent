// We’ll use routing.ts as a central place to define our routing configuration:
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "tm", "ru"],

  // Used when no locale matches
  defaultLocale: "tm",
});
