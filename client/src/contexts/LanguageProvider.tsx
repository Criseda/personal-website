import { useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LanguageContext } from '@/contexts/LanguageContext';
import { Language, translations } from '@/contexts/translations';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const initialLanguage: Language = location.pathname.includes('/ro') ? 'ro' : 'en';
  const [language, setLanguage] = useState<Language>(initialLanguage);

  // Update document metadata when language changes
  useEffect(() => {
    // Update document title
    document.title = translations[language].title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', translations[language].description);
    }
    
    // Update html lang attribute
    document.documentElement.lang = language;
    
  }, [language]);

  const t = (key: keyof typeof translations['en']): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}