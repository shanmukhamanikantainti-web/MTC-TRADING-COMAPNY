import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../services/i18n';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(localStorage.getItem('mtc_lang') || null);
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('mtc_user');
    return saved ? JSON.parse(saved) : null;
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('mtc_lang', lang);
  };

  const identifyUser = (name, identifier) => {
    const profile = { name, identifier, phone: identifier };
    setUserProfile(profile);
    localStorage.setItem('mtc_user', JSON.stringify(profile));
  };

  const t = (path) => {
    if (!path) return "";
    try {
      const keys = path.split('.');
      let result = translations[language] || translations['en'] || {};
      for (const key of keys) {
        result = result ? result[key] : null;
      }
      return result || path;
    } catch (e) {
      console.warn("Translation Error on path:", path, e);
      return path;
    }
  };

  const value = {
    language,
    setLanguage,
    userProfile,
    identifyUser,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
