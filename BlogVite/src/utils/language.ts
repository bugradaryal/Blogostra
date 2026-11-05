export type Language = 'tr' | 'en';

const STORAGE_KEY = 'i18n_lang';

export const getLanguage = (): Language =>
  localStorage.getItem(STORAGE_KEY) === 'tr' ? 'tr' : 'en';

export const setLanguage = (language: Language) => localStorage.setItem(STORAGE_KEY, language);
