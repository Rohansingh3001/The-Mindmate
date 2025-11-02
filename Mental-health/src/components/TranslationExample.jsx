import React from 'react';
import { useAppTranslation, LanguageSwitcher } from '../hooks/useAppTranslation';

/**
 * Example component demonstrating i18n usage
 * This shows different ways to use translations in your components
 */
function TranslationExample() {
  const { t, currentLang, changeLang, getLanguageName, getLanguageFlag } = useAppTranslation();

  return (
    <div className="p-6 space-y-6">
      
      {/* Example 1: Basic Translation */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">{t('dashboard.welcome')}</h2>
        <p className="text-slate-600 dark:text-slate-400">
          {t('dashboard.overview')}
        </p>
      </section>

      {/* Example 2: Translation with Dynamic Keys */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Theme Options</h3>
        <div className="flex gap-3">
          {['light', 'dark', 'system'].map((theme) => (
            <button
              key={theme}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              {t(`settings.theme.${theme}`)}
            </button>
          ))}
        </div>
      </section>

      {/* Example 3: Language Switcher (Select) */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Select Language (Dropdown)</h3>
        <LanguageSwitcher variant="select" />
      </section>

      {/* Example 4: Language Switcher (Buttons) */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Select Language (Buttons)</h3>
        <LanguageSwitcher variant="buttons" />
      </section>

      {/* Example 5: Current Language Info */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Current Language Info</h3>
        <div className="space-y-2 text-slate-700 dark:text-slate-300">
          <p>Language Code: <strong>{currentLang}</strong></p>
          <p>Language Name: <strong>{getLanguageName()}</strong></p>
          <p>Language Flag: <strong className="text-2xl">{getLanguageFlag()}</strong></p>
        </div>
      </section>

      {/* Example 6: Manual Language Change */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Programmatic Language Change</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => changeLang('en')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Switch to English
          </button>
          <button
            onClick={() => changeLang('hi')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            हिन्दी में बदलें
          </button>
          <button
            onClick={() => changeLang('ta')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            தமிழில் மாற்று
          </button>
        </div>
      </section>

      {/* Example 7: Common UI Elements */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Common UI Translations</h3>
        <div className="flex gap-2 flex-wrap">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
            {t('common.save')}
          </button>
          <button className="px-4 py-2 bg-slate-600 text-white rounded-lg">
            {t('common.cancel')}
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg">
            {t('common.submit')}
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg">
            {t('common.delete')}
          </button>
        </div>
      </section>

      {/* Example 8: Error Messages */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Error Messages</h3>
        <div className="space-y-2">
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            {t('error.generic')}
          </div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-700 dark:text-yellow-300">
            {t('error.network')}
          </div>
        </div>
      </section>

      {/* Example 9: Branding */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Branding Elements</h3>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">
            {t('brand.name')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {t('brand.tagline')}
          </p>
          <p className="text-sm text-slate-500">
            {t('brand.footer')}
          </p>
        </div>
      </section>

    </div>
  );
}

export default TranslationExample;

/**
 * QUICK REFERENCE FOR YOUR COMPONENTS:
 * 
 * 1. Import the hook:
 *    import { useAppTranslation } from '../hooks/useAppTranslation';
 * 
 * 2. Use in component:
 *    const { t } = useAppTranslation();
 * 
 * 3. Replace hardcoded text:
 *    Before: <h1>Welcome back</h1>
 *    After:  <h1>{t('dashboard.welcome')}</h1>
 * 
 * 4. For dynamic keys:
 *    <span>{t(`settings.theme.${themeValue}`)}</span>
 * 
 * 5. Add new translations in src/i18n/config.js
 */
