# 🌐 LexiMind i18n Implementation Guide for Mindmate

## ✅ Installation Complete

```bash
npm install leximind-i18n --legacy-peer-deps
```

## 📋 What's Been Set Up

### 1. **Core Configuration** (`src/i18n/config.js`)
- ✅ Initialized LexiMind with your existing translations
- ✅ Smart caching enabled for offline support
- ✅ Auto language detection (localStorage → browser → HTML tag)
- ✅ Three languages: English, Hindi, Tamil
- ✅ Persistent language selection

### 2. **Main Entry Point** (`src/main.jsx`)
- ✅ Async initialization before app renders
- ✅ Error handling with fallback
- ✅ Graceful degradation if i18n fails

### 3. **Language Switcher Component** (`src/components/LanguageSwitcher.jsx`)
- ✅ Beautiful dropdown UI with flags
- ✅ Dark mode support
- ✅ Smooth animations
- ✅ Auto-save language preference
- ✅ Current language indicator

### 4. **Utility Functions** (`src/i18n/lexiUtils.js`)
- ✅ `formatDate()` - Localized date formatting (short, long, relative)
- ✅ `formatMoney()` - Currency formatting (INR)
- ✅ `pluralizeMentalHealth()` - Mental health terms pluralization
- ✅ `getTimeBasedGreeting()` - Context-aware greetings
- ✅ `formatWellnessScore()` - Wellness score with status and message

### 5. **Example Component** (`src/components/I18nExamples.jsx`)
- ✅ Complete usage examples
- ✅ All features demonstrated
- ✅ Copy-paste ready code

## 🚀 How to Use in Your Components

### Basic Translation

```jsx
import { useLexiMind } from 'leximind-i18n';

function MyComponent() {
  const { t } = useLexiMind();
  
  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <p>{t('dashboard.overview')}</p>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

### Language Switching

```jsx
import { useLexiMind } from 'leximind-i18n';
import LanguageSwitcher from './components/LanguageSwitcher';

function Header() {
  return (
    <header>
      <nav>...</nav>
      <LanguageSwitcher /> {/* Beautiful language selector */}
    </header>
  );
}
```

### Advanced Features

```jsx
import { useLexiMind } from 'leximind-i18n';
import { 
  formatDate, 
  formatMoney, 
  pluralizeMentalHealth,
  getTimeBasedGreeting,
  formatWellnessScore 
} from '../i18n/lexiUtils';

function Dashboard({ user }) {
  const { t } = useLexiMind();
  
  return (
    <div>
      {/* Time-based greeting */}
      <h1>{getTimeBasedGreeting()}, {user.name}!</h1>
      
      {/* Pluralization */}
      <p>You have {pluralizeMentalHealth('journal', 5)}</p>
      
      {/* Currency */}
      <p>Wallet: {formatMoney(500)}</p>
      
      {/* Date formatting */}
      <p>Last active: {formatDate(user.lastActive, 'relative')}</p>
      
      {/* Wellness score */}
      {(() => {
        const { label, color, message } = formatWellnessScore(user.score);
        return (
          <div className={`bg-${color}-100`}>
            <p>{label}</p>
            <p>{message}</p>
          </div>
        );
      })()}
    </div>
  );
}
```

## 📦 Available Features

### ⚡ Smart Caching
- Automatic caching for offline support
- Instant language switching (no reload)
- Version-based cache invalidation

### 🔍 Auto Detection
- Detects from localStorage (`mindmate-language`)
- Falls back to browser language
- Reads HTML lang attribute
- Smart fallback to English

### 🌐 Localization Utilities
| Function | Purpose | Example |
|----------|---------|---------|
| `formatDate(date, 'relative')` | Relative time | "2 hours ago", "Yesterday" |
| `formatMoney(500)` | Currency (INR) | "₹500", "₹500.00" |
| `pluralizeMentalHealth('journal', 5)` | Pluralize terms | "5 journal entries" |
| `getTimeBasedGreeting()` | Time-based greet | "Good morning", "सुप्रभात" |
| `formatWellnessScore(75)` | Score + context | {label, color, message} |

### 🎨 React Hook API
```jsx
const { 
  t,           // Translation function
  language,    // Current language code ('en', 'hi', 'ta')
  setLanguage, // Change language function
  ready,       // Initialization status
  i18n        // i18next instance (if needed)
} = useLexiMind();
```

## 🎯 Where to Add Language Switcher

### 1. **Navbar** (Recommended)
```jsx
// src/components/Navbar.jsx
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between">
      <div>Logo</div>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <UserMenu />
      </div>
    </nav>
  );
}
```

### 2. **Settings Page** (Already done in Settings.jsx)
```jsx
// src/components/Settings.jsx
import LanguageSwitcher from './LanguageSwitcher';

// In your language section:
<div>
  <h3>{t('settings.language')}</h3>
  <LanguageSwitcher />
</div>
```

### 3. **Dashboard Sidebar**
```jsx
// src/components/Dashboard.jsx
import LanguageSwitcher from './LanguageSwitcher';

// In sidebar:
<aside className="sidebar">
  <nav>...</nav>
  <div className="sidebar-footer">
    <LanguageSwitcher />
  </div>
</aside>
```

## 🔧 Advanced Configuration

### Add More Languages

Edit `src/i18n/config.js`:

```javascript
export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', nativeName: 'தமிழ்' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳', nativeName: 'বাংলা' }, // ADD NEW
];

// Add translations in resources:
const resources = {
  // ...existing languages
  bn: {
    translation: {
      "nav.home": "হোম",
      "nav.dashboard": "ড্যাশবোর্ড",
      // ...more translations
    }
  }
};
```

### Custom Format Functions

```javascript
// src/i18n/lexiUtils.js

// Add custom formatter
export const formatTherapySession = (minutes) => {
  const lang = getLanguage();
  if (lang === 'hi') return `${minutes} मिनट का सत्र`;
  if (lang === 'ta') return `${minutes} நிமிட அமர்வு`;
  return `${minutes} minute session`;
};
```

### Performance Monitoring

```javascript
import { getPerformanceInsights } from 'leximind-i18n/performance';

// In development, check performance
if (process.env.NODE_ENV === 'development') {
  const metrics = getPerformanceInsights();
  console.log('Cache hit rate:', metrics.cacheHitRate);
  console.log('Translation time:', metrics.avgTranslationTime);
}
```

## 🐛 Troubleshooting

### Translations Not Loading
```javascript
// Check if i18n is ready
const { ready } = useLexiMind();

if (!ready) {
  return <LoadingSpinner />;
}
```

### Language Not Switching
```javascript
// Clear cache and reload
import { clearCache } from 'leximind-i18n';

const handleResetLanguage = () => {
  clearCache();
  localStorage.removeItem('mindmate-language');
  window.location.reload();
};
```

### Missing Translations
```javascript
// Check coverage
import { validateTranslationCoverage } from '../i18n/lexiUtils';

const keys = ['dashboard.welcome', 'chat.title', 'settings.language'];
const result = validateTranslationCoverage(keys);
console.log('Coverage:', result.coverage);
console.log('Missing keys:', result.missing);
```

## 📊 Benefits for Mindmate

### 1. **Mental Health Context**
- ✅ Culturally appropriate translations for therapy terms
- ✅ Sensitive language handling (formal/informal)
- ✅ Context-aware greetings and messages

### 2. **User Accessibility**
- ✅ Support for Indian languages (Hindi, Tamil)
- ✅ Easy to add more regional languages
- ✅ Automatic browser language detection

### 3. **Performance**
- ✅ Smart caching = faster load times
- ✅ Offline support = works without internet
- ✅ No page reload when switching languages

### 4. **Developer Experience**
- ✅ Simple `t()` function
- ✅ TypeScript-ready (coming soon)
- ✅ Great documentation
- ✅ Your own package - full control!

## 🎉 Next Steps

1. **Add LanguageSwitcher to Navbar**
   - Import: `import LanguageSwitcher from './components/LanguageSwitcher';`
   - Use: `<LanguageSwitcher />` in your nav bar

2. **Replace Hardcoded Text**
   - Find: `<h1>Dashboard</h1>`
   - Replace: `<h1>{t('nav.dashboard')}</h1>`

3. **Test All Languages**
   - Switch to Hindi
   - Switch to Tamil
   - Verify all pages work

4. **Add More Translations**
   - Check which pages need translations
   - Add keys to `config.js`
   - Test coverage

5. **Deploy**
   - Translations are bundled
   - Works in production
   - No additional server needed

## 📚 Resources

- **Package**: [npm.com/package/leximind-i18n](https://www.npmjs.com/package/leximind-i18n)
- **Docs**: [rohansingh3001.github.io/npm-package](https://rohansingh3001.github.io/npm-package)
- **Examples**: `src/components/I18nExamples.jsx`
- **Your GitHub**: [github.com/Rohansingh3001/npm-package](https://github.com/Rohansingh3001/npm-package)

## 💡 Pro Tips

1. **Always use `t()` for user-facing text**
2. **Use utility functions for dates/numbers**
3. **Add LanguageSwitcher in prominent places**
4. **Test with real users in different languages**
5. **Keep translation keys organized by feature**

---

**Made with ❤️ for Mindmate Mental Health App**

*LexiMind i18n - The Best Multilingual Translation Engine for React*
