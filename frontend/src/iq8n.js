import i18next from "i18next";
import { initReactI18next } from "react-i18next";

i18next
  .use(initReactI18next)
  .init({
    resources: {},

    lng: localStorage.getItem("lang") || "en",

    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },

    returnObjects: true,
  });

export default i18next;