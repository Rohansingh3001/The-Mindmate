# Translation Template

Use this template when translating a new component.

## Step 1: Add to Component File

```jsx
// At the top with other imports
import { useTranslation } from "react-i18next";

// Inside your component function (after any hooks like useState)
const { t } = useTranslation();
```

## Step 2: Replace Text Examples

### Headings
```jsx
// Before:
<h1>Dashboard</h1>

// After:
<h1>{t('dashboard.title')}</h1>
```

### Buttons
```jsx
// Before:
<button>Save</button>

// After:
<button>{t('common.save')}</button>
```

### Paragraphs
```jsx
// Before:
<p>Welcome to your mental health journey</p>

// After:
<p>{t('dashboard.welcomeMessage')}</p>
```

### Placeholders
```jsx
// Before:
<input placeholder="Type here..." />

// After:
<input placeholder={t('common.typePlaceholder')} />
```

### Title Attributes
```jsx
// Before:
<button title="Click to open">...</button>

// After:
<button title={t('common.clickToOpen')}>...</button>
```

### Toast Messages
```jsx
// Before:
toast.success("Saved successfully!");

// After:
toast.success(t('common.toast.saveSuccess'));
```

---

## Step 3: Add Keys to config.js

### Template for Adding New Keys:

```javascript
// In English (en) section:
"category.item": "English Text Here",
"category.anotherItem": "More English Text",

// In Hindi (hi) section:
"category.item": "यहाँ हिंदी पाठ",
"category.anotherItem": "अधिक हिंदी पाठ",

// In Tamil (ta) section:
"category.item": "தமிழ் உரை இங்கே",
"category.anotherItem": "மேலும் தமிழ் உரை",

// In Spanish (es) section:
"category.item": "Texto en español aquí",
"category.anotherItem": "Más texto en español",

// In French (fr) section:
"category.item": "Texte français ici",
"category.anotherItem": "Plus de texte français",
```

---

## Quick Copy-Paste Sections

### Common Button Labels (already in config.js)
```jsx
{t('common.save')}
{t('common.cancel')}
{t('common.submit')}
{t('common.close')}
{t('common.edit')}
{t('common.delete')}
{t('common.loading')}
```

### Common Placeholders
```jsx
placeholder={t('common.search')}
placeholder={t('common.typePlaceholder')}
```

### Navigation Items (already in config.js)
```jsx
{t('nav.dashboard')}
{t('nav.chat')}
{t('nav.appointments')}
{t('nav.analysis')}
{t('nav.journals')}
{t('nav.settings')}
```

---

## Translation Workflow Checklist

For each new component:

1. [ ] Open the component file
2. [ ] Add import: `import { useTranslation } from "react-i18next";`
3. [ ] Add hook: `const { t } = useTranslation();`
4. [ ] Identify all hardcoded text strings
5. [ ] Check if keys exist in config.js
6. [ ] If not, add keys to all 5 languages in config.js
7. [ ] Replace each text string with `{t('key.name')}`
8. [ ] Save and test
9. [ ] Switch language in Settings
10. [ ] Verify all text updates correctly

---

## Example: Full Component Before/After

### BEFORE:
```jsx
function AppointmentCard() {
  return (
    <div className="card">
      <h2>Upcoming Appointment</h2>
      <p>Date: {date}</p>
      <p>Doctor: {doctorName}</p>
      <button>Reschedule</button>
      <button>Cancel</button>
    </div>
  );
}
```

### AFTER:
```jsx
import { useTranslation } from "react-i18next";

function AppointmentCard() {
  const { t } = useTranslation();
  
  return (
    <div className="card">
      <h2>{t('appointments.upcoming')}</h2>
      <p>{t('appointments.date')}: {date}</p>
      <p>{t('appointments.doctor')}: {doctorName}</p>
      <button>{t('appointments.reschedule')}</button>
      <button>{t('common.cancel')}</button>
    </div>
  );
}
```

### KEYS IN CONFIG.JS:
```javascript
// English
"appointments.upcoming": "Upcoming Appointment",
"appointments.date": "Date",
"appointments.doctor": "Doctor",
"appointments.reschedule": "Reschedule",

// Hindi
"appointments.upcoming": "आगामी अपॉइंटमेंट",
"appointments.date": "तारीख",
"appointments.doctor": "डॉक्टर",
"appointments.reschedule": "पुनर्निर्धारित करें",

// (Add to Tamil, Spanish, French similarly)
```

---

## Common Mistakes to Avoid

### ❌ DON'T:
```jsx
// Don't forget curly braces
<h1>t('dashboard.title')</h1>

// Don't use quotes inside JSX
<h1>{t("common.save")}</h1>  // Works but inconsistent

// Don't translate class names
<div className={t('card-class')}>

// Don't translate variable names
const {t('userName')} = user;
```

### ✅ DO:
```jsx
// Use curly braces
<h1>{t('dashboard.title')}</h1>

// Use single quotes for keys
<h1>{t('common.save')}</h1>

// Only translate user-visible text
<div className="card-class">

// Keep variable names in English
const {userName} = user;
```

---

## Quick Translation Reference

### Using Google Translate for Batch Translation:

1. **Collect all English strings**
2. **Go to**: https://translate.google.com
3. **Select language**: English → [Target Language]
4. **Paste strings** (one per line)
5. **Copy translated output**
6. **Add to config.js** with proper formatting

### Alternative: DeepL (More Accurate)
https://www.deepl.com/translator

---

## Testing Your Translation

```bash
# Start dev server
cd Mental-health
npm run dev

# Open browser
# Go to Settings → Language
# Switch between languages
# Check every translated component
# Verify text updates instantly
```

---

## Need Help?

1. Check `TRANSLATION_GUIDE.md` for detailed instructions
2. Check `TRANSLATION_QUICK_REFERENCE.md` for key lookup
3. Look at `Navbar.jsx`, `Settings.jsx`, or `ChatBot.jsx` for working examples
4. Use `./find-untranslated-text.sh` to find hardcoded strings

---

**Remember**: Every piece of user-visible text should use `t('translation.key')`!
