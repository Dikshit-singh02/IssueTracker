import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector'; // Optional, install if needed

i18n
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: 'Welcome to CCMS PNGRB',
          login: 'Login',
          register: 'Register',
          dashboard: 'Dashboard',
          newComplaint: 'New Complaint'
        }
      },
      hi: {
        translation: {
          welcome: 'CCMS PNGRB में आपका स्वागत है',
          login: 'लॉगिन',
          register: 'रजिस्टर',
          dashboard: 'डैशबोर्ड',
          newComplaint: 'नई शिकायत'
        }
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
