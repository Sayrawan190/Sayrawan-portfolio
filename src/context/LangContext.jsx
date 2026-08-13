import { createContext, useContext, useEffect, useState } from "react";
import { loadJSON, saveJSON } from "../utils/storage";

const LANG_KEY = "portfolio_lang_v1";
const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => loadJSON(LANG_KEY, "en"));

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    saveJSON(LANG_KEY, lang);
  }, [lang]);

  const toggleLang = () => setLangState((prev) => (prev === "ar" ? "en" : "ar"));
  const setLang = (value) => setLangState(value === "ar" ? "ar" : "en");

  return (
    <LangContext.Provider value={{ lang, toggleLang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}
