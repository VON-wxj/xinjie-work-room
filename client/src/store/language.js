import { create } from 'zustand';
import { zh, en } from '../i18n/translations';

const translations = { zh, en };

const useLanguage = create((set, get) => ({
  lang: localStorage.getItem('lang') || 'zh',

  t: (key) => {
    const { lang } = get();
    return translations[lang]?.[key] || translations.zh[key] || key;
  },

  setLang: (lang) => {
    localStorage.setItem('lang', lang);
    set({ lang });
  },

  toggleLang: () => {
    const next = get().lang === 'zh' ? 'en' : 'zh';
    localStorage.setItem('lang', next);
    set({ lang: next });
  },
}));

export default useLanguage;
