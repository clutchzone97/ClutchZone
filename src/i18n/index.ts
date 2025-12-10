import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './ar.json';
import en from './en.json';

const STORAGE_KEY = 'cz_lang';
const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
const defaultLng = saved === 'en' ? 'en' : 'ar';

export const applyHtmlDirLang = (lng: string) => {
  const html = document.documentElement;
  if (!html) return;
  const isAr = lng === 'ar';
  html.setAttribute('lang', isAr ? 'ar' : 'en');
  html.setAttribute('dir', isAr ? 'rtl' : 'ltr');
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    lng: defaultLng,
    fallbackLng: 'ar',
    interpolation: { escapeValue: false },
  });

applyHtmlDirLang(i18n.language);

i18n.on('languageChanged', (lng) => {
  try { localStorage.setItem(STORAGE_KEY, lng); } catch {}
  applyHtmlDirLang(lng);
});

export default i18n;
