export const dateLocale: Record<string, string> = {
  us: "en-EN", // English
  ru: "ru-RU", // Russian
  tm: "tk-TM", // Turkmen
};

export const databaseLocale: Record<string, string> = {
  us: "US", // English
  ru: "RU", // Russian
  tm: "TM", // Turkmen
};

export function getDateLocale(lang: string): string {
  return dateLocale[lang] || "tk-TM";
}

export function getDatabaseLocale(lang: string): string {
  return databaseLocale[lang] || "TM";
}
