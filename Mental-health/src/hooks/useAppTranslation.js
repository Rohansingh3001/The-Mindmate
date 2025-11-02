import { useTranslation } from 'react-i18next';

/**
 * Custom hook for easy translation access across components
 * Provides translation function and current language info
 * 
 * @example
 * const { t, currentLang, changeLang, isRTL } = useAppTranslation();
 * 
 * <h1>{t('dashboard.welcome')}</h1>
 * <button onClick={() => changeLang('hi')}>Switch to Hindi</button>
 */
export function useAppTranslation() {
  const { t, i18n } = useTranslation();

  /**
   * Change app language and persist to localStorage
   * @param {string} languageCode - Language code (en, hi, ta, es, fr)
   */
  const changeLang = (languageCode) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('languageChange', {
      detail: { language: languageCode }
    }));
  };

  /**
   * Check if current language is RTL (Right-to-Left)
   * Useful for Arabic, Hebrew, etc. (when added)
   */
  const isRTL = ['ar', 'he', 'ur'].includes(i18n.language);

  /**
   * Get language display name
   */
  const getLanguageName = (code = i18n.language) => {
    const names = {
      en: 'English',
      hi: 'हिन्दी',
      ta: 'தமிழ்',
      es: 'Español',
      fr: 'Français',
    };
    return names[code] || code;
  };

  /**
   * Get language flag emoji
   */
  const getLanguageFlag = (code = i18n.language) => {
    const flags = {
      en: '🇬🇧',
      hi: '🇮🇳',
      ta: '🇮🇳',
      es: '🇪🇸',
      fr: '🇫🇷',
    };
    return flags[code] || '🌐';
  };

  return {
    // Core translation function
    t,
    
    // Language management
    currentLang: i18n.language,
    changeLang,
    
    // Utility functions
    isRTL,
    getLanguageName,
    getLanguageFlag,
    
    // Available languages
    availableLanguages: [
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
      { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
    ],
  };
}

/**
 * Language Switcher Component
 * Drop-in component for changing language
 * 
 * @example
 * import { LanguageSwitcher } from './hooks/useAppTranslation';
 * <LanguageSwitcher />
 */
export function LanguageSwitcher({ variant = 'select', className = '' }) {
  const { currentLang, changeLang, availableLanguages } = useAppTranslation();

  if (variant === 'buttons') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {availableLanguages.map(({ code, flag }) => (
          <button
            key={code}
            onClick={() => changeLang(code)}
            className={`px-3 py-2 rounded-lg transition ${
              currentLang === code
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title={availableLanguages.find(l => l.code === code)?.name}
          >
            {flag}
          </button>
        ))}
      </div>
    );
  }

  // Default: select dropdown
  return (
    <select
      value={currentLang}
      onChange={(e) => changeLang(e.target.value)}
      className={`bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white ${className}`}
    >
      {availableLanguages.map(({ code, name, flag }) => (
        <option key={code} value={code}>
          {flag} {name}
        </option>
      ))}
    </select>
  );
}

export default useAppTranslation;
