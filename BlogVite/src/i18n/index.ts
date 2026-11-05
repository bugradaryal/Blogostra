import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLanguage, setLanguage, type Language } from '../utils/language';

import hometableEn from './locales/en/hometable-en.json';
import hometableTr from './locales/tr/hometable-tr.json';
import registertableEn from './locales/en/registertable-en.json';
import registertableTr from './locales/tr/registertable-tr.json';
import accounttableEn from './locales/en/accounttable-en.json';
import accounttableTr from './locales/tr/accounttable-tr.json';
import logintableEn from './locales/en/logintable-en.json';
import logintableTr from './locales/tr/logintable-tr.json';
import homepagetableEn from './locales/en/homepagetable-en.json';
import homepagetableTr from './locales/tr/homepagetable-tr.json';
import emailtableEn from './locales/en/emailtable-en.json';
import emailtableTr from './locales/tr/emailtable-tr.json';
import contacttableEn from './locales/en/contacttable-en.json';
import contacttableTr from './locales/tr/contacttable-tr.json';
import blogtableEn from './locales/en/blogtable-en.json';
import blogtableTr from './locales/tr/blogtable-tr.json';
import abouttableEn from './locales/en/abouttable-en.json';
import abouttableTr from './locales/tr/abouttable-tr.json';
import bodyimagetableEn from './locales/en/bodyimagetable-en.json';
import bodyimagetableTr from './locales/tr/bodyimagetable-tr.json';
import admintableEn from './locales/en/admintable-en.json';
import admintableTr from './locales/tr/admintable-tr.json';
import cookietableEn from './locales/en/cookietable-en.json';
import cookietableTr from './locales/tr/cookietable-tr.json';

const resources = {
  en: {
    hometable: hometableEn,
    registertable: registertableEn,
    accounttable: accounttableEn,
    logintable: logintableEn,
    homepagetable: homepagetableEn,
    emailtable: emailtableEn,
    contacttable: contacttableEn,
    blogtable: blogtableEn,
    abouttable: abouttableEn,
    bodyimagetable: bodyimagetableEn,
    admintable: admintableEn,
    cookietable: cookietableEn,
  },
  tr: {
    hometable: hometableTr,
    registertable: registertableTr,
    accounttable: accounttableTr,
    logintable: logintableTr,
    homepagetable: homepagetableTr,
    emailtable: emailtableTr,
    contacttable: contacttableTr,
    blogtable: blogtableTr,
    abouttable: abouttableTr,
    bodyimagetable: bodyimagetableTr,
    admintable: admintableTr,
    cookietable: cookietableTr,
  },
};

const language = getLanguage();

i18n.use(initReactI18next).init({
  resources,
  lng: language,
  fallbackLng: 'en',
  defaultNS: 'hometable',
  interpolation: { escapeValue: false },
});

document.documentElement.lang = language;

export const changeLanguage = (next: Language) => {
  setLanguage(next);
  document.documentElement.lang = next;
  return i18n.changeLanguage(next);
};

export default i18n;
