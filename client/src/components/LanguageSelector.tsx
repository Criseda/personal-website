import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLanguageChange = (lang: 'en' | 'ro') => {
    setLanguage(lang);
    
    // Update URL based on selected language
    if (lang === 'en') {
      navigate('/');
    } else if (lang === 'ro') {
      navigate('/ro');
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-2 py-1 rounded transition-colors ${
          language === 'en' 
            ? 'bg-neutral-300 dark:bg-neutral-700 text-white' 
            : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange('ro')}
        className={`px-2 py-1 rounded transition-colors ${
          language === 'ro' 
            ? 'bg-neutral-300 dark:bg-neutral-700 text-white' 
            : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
        }`}
        aria-label="Switch to Romanian"
      >
        RO
      </button>
    </div>
  );
}