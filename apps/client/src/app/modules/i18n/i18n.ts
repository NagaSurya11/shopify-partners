// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend'; // Load translations via HTTP (from files)
import LanguageDetector from 'i18next-browser-languagedetector'; // Detect the user's language

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next) // Connects i18next with react-i18next
  .init({ 
    fallbackLng: 'en-US', // Fallback to English if translation not found
    debug: false, // Debug mode to see language change logs in console
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    backend: {
      loadPath: '/assets/i18n/{{lng}}.json', // Path to load translation files
    },
    supportedLngs: ['en-US', 'de-DE'], // Add languages as needed
  });

export default i18n;
