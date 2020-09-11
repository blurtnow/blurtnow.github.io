import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import XHR from "i18next-xhr-backend";
import { initReactI18next } from 'react-i18next';

import translationEng from "./locales/en/translation.json";
import translationJap from "./locales/jp/translation.json";

// the translations
// (tip move them in a JSON file and import them)

i18n
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translations: translationEng
      },
      jp: {
        translations: translationJap
      }
    },
    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",
    lng: "en",

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;