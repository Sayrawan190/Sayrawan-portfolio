// Content fields throughout the app are stored as { en: "...", ar: "..." }.
// This helper reads the current language and falls back to English (then Arabic)
// so a card never renders blank just because one language wasn't filled in yet.
export function L(field, lang) {
  if (field == null) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.en || field.ar || "";
}

export function emptyLocalized() {
  return { en: "", ar: "" };
}
