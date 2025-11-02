# 🌍 Internationalization (i18n) Guide

## Overview

This project uses **react-i18next** for multilingual support across the entire website. Currently supporting:
- 🇬🇧 English (en)
- 🇮🇳 हिन्दी - Hindi (hi)
- 🇮🇳 தமிழ் - Tamil (ta)
- 🇪🇸 Español - Spanish (es)
- 🇫🇷 Français - French (fr)

## 📁 File Structure

```
src/
├── i18n/
│   └── config.js          # i18n configuration and translations
├── main.jsx               # Imports i18n config
└── components/
    └── Settings.jsx       # Example: Settings page with i18n
```

## 🚀 Quick Start

### 1. Using i18next in Components

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();

  // Use t() function to translate
  return (
    <div>
      <h1>{t('settings.title')}</h1>
      <p>{t('settings.subtitle')}</p>
    </div>
  );
}
```

### 2. Changing Language

```jsx
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang); // Persist selection
  };

  return (
    <select 
      value={i18n.language} 
      onChange={(e) => changeLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="hi">हिन्दी</option>
      <option value="ta">தமிழ்</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
    </select>
  );
}
```

### 3. Dynamic Translation Keys

```jsx
// For dynamic values like themes
const theme = "light"; // or "dark", "system"
<span>{t(`settings.theme.${theme}`)}</span>

// For arrays
{["one", "two", "all"].map((option) => (
  <button key={option}>
    {t(`settings.assessment.${option}`)}
  </button>
))}
```

## 📝 Translation Key Convention

Our translation keys follow this structure:

```
category.subcategory.item
```

Examples:
- `nav.home` - Navigation: Home
- `settings.title` - Settings page title
- `settings.theme.light` - Theme option: Light
- `common.save` - Common button: Save
- `error.network` - Error message: Network error

## 📚 Available Translation Categories

### Navigation (`nav.*`)
```jsx
t('nav.home')
t('nav.dashboard')
t('nav.chat')
t('nav.appointments')
t('nav.analysis')
t('nav.journals')
t('nav.settings')
t('nav.logout')
```

### Common UI (`common.*`)
```jsx
t('common.goBack')
t('common.loading')
t('common.save')
t('common.cancel')
t('common.edit')
t('common.delete')
t('common.search')
t('common.submit')
t('common.close')
```

### Branding (`brand.*`)
```jsx
t('brand.name')        // "The MindMates"
t('brand.tagline')     // "Your Mental Wellness Companion"
t('brand.footer')      // "Made with ❤️ for mental wellness"
```

### Settings (`settings.*`)
```jsx
// Main
t('settings.title')
t('settings.subtitle')

// Appearance
t('settings.appearance')
t('settings.theme')
t('settings.theme.light')
t('settings.theme.dark')
t('settings.theme.system')

// Language
t('settings.language')
t('settings.language.subtitle')

// Experience
t('settings.experience')
t('settings.quotes')
t('settings.sound')
t('settings.autoDownload')

// Notifications
t('settings.notifications')
t('settings.push')
t('settings.email')

// Privacy
t('settings.privacy')
t('settings.analytics')
t('settings.privacyPolicy')
t('settings.terms')

// Account
t('settings.account')
t('settings.changePassword')
```

### Dashboard (`dashboard.*`)
```jsx
t('dashboard.welcome')
t('dashboard.overview')
t('dashboard.todayMood')
t('dashboard.weeklyProgress')
t('dashboard.achievements')
t('dashboard.quickActions')
t('dashboard.startChat')
t('dashboard.trackMood')
```

### Chat (`chat.*`)
```jsx
t('chat.title')
t('chat.selectPersona')
t('chat.wallet')
t('chat.addFunds')
t('chat.timeRemaining')
t('chat.typing')
t('chat.sendMessage')
```

### Appointments (`appointments.*`)
```jsx
t('appointments.title')
t('appointments.upcoming')
t('appointments.past')
t('appointments.book')
t('appointments.reschedule')
t('appointments.cancel')
```

### Error Messages (`error.*`)
```jsx
t('error.generic')
t('error.network')
t('error.auth')
t('error.notFound')
```

## 🎨 Example: Converting a Component

### Before (Hardcoded Text):
```jsx
function Dashboard() {
  return (
    <div>
      <h1>Welcome back</h1>
      <p>Your Mental Wellness Overview</p>
      <button>Start Chat</button>
      <button>Track Mood</button>
    </div>
  );
}
```

### After (With i18n):
```jsx
import { useTranslation } from 'react-i18next';

function Dashboard() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <p>{t('dashboard.overview')}</p>
      <button>{t('dashboard.startChat')}</button>
      <button>{t('dashboard.trackMood')}</button>
    </div>
  );
}
```

## ➕ Adding New Translations

To add new translations, edit `/src/i18n/config.js`:

```javascript
const resources = {
  en: {
    translation: {
      // Add your new keys here
      "myNewFeature.title": "My Feature",
      "myNewFeature.description": "Feature description",
    }
  },
  hi: {
    translation: {
      "myNewFeature.title": "मेरी सुविधा",
      "myNewFeature.description": "सुविधा विवरण",
    }
  },
  // ... other languages
};
```

## 🔄 Language Detection & Persistence

The app automatically:
1. Detects user's browser language on first visit
2. Falls back to English if language not supported
3. Saves language preference to localStorage
4. Loads saved language on app restart

```javascript
// In i18n/config.js
i18n.init({
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage'],
  },
});
```

## 🎯 Best Practices

### ✅ Do:
- Use descriptive, hierarchical keys: `dashboard.quickActions.startChat`
- Keep translation keys consistent across languages
- Use the same translation key for the same text across components
- Test all languages after adding new translations

### ❌ Don't:
- Don't hardcode text strings in JSX
- Don't use overly generic keys like `text1`, `text2`
- Don't forget to add translations for all supported languages
- Don't use HTML in translation strings (use components instead)

## 🛠️ Integration with Settings

The Settings page demonstrates the complete integration:

```jsx
// Language changes update i18n and persist to localStorage
const updateSetting = (key, value) => {
  if (key === 'language') {
    i18n.changeLanguage(value);
    localStorage.setItem('language', value);
  }
  // ... save other settings
};
```

## 🌐 Adding More Languages

To add a new language (e.g., German):

1. Add translation resource in `i18n/config.js`:
```javascript
de: {
  translation: {
    "nav.home": "Startseite",
    "nav.dashboard": "Dashboard",
    // ... all keys
  }
}
```

2. Add option in Settings language selector:
```jsx
<option value="de">🇩🇪 Deutsch (German)</option>
```

## 📊 Current Implementation Status

| Component | Status | Priority |
|-----------|--------|----------|
| Settings.jsx | ✅ Complete | High |
| Dashboard.jsx | ⏳ Pending | High |
| ChatBot.jsx | ⏳ Pending | High |
| FullChat.jsx | ⏳ Pending | High |
| Navbar.jsx | ⏳ Pending | High |
| AnalysisPage.jsx | ⏳ Pending | Medium |
| JournalsPage.jsx | ⏳ Pending | Medium |
| AppointmentsPage.jsx | ⏳ Pending | Medium |
| GamifiedDashboard.jsx | ⏳ Pending | Medium |

## 🎓 Resources

- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)
- [Language Codes (ISO 639-1)](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)

## 🐛 Troubleshooting

### Translation not showing?
1. Check if key exists in `i18n/config.js`
2. Verify key spelling: `t('settings.title')` (case-sensitive)
3. Ensure `useTranslation()` hook is called
4. Check browser console for i18n errors

### Language not persisting?
1. Check localStorage for `language` key
2. Verify `i18n.changeLanguage()` is called
3. Ensure settings are saved to localStorage

### New language not working?
1. Add complete translation resource in config
2. Restart dev server after config changes
3. Clear browser cache/localStorage if needed

---

**Happy Translating! 🌍✨**
