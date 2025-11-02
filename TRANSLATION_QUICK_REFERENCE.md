# i18n Translation Quick Reference

## 🎯 Most Commonly Used Translation Keys

### Common Actions (Already Available)
```javascript
t('common.save')       // Save / सहेजें
t('common.cancel')     // Cancel / रद्द करें  
t('common.close')      // Close / बंद करें
t('common.submit')     // Submit / जमा करें
t('common.delete')     // Delete / हटाएं
t('common.edit')       // Edit / संपादित करें
t('common.loading')    // Loading... / लोड हो रहा है...
```

### Navigation (Already Available)
```javascript
t('nav.settings')      // Settings / सेटिंग्स
t('nav.logout')        // Logout / लॉगआउट
t('nav.dashboard')     // Dashboard / डैशबोर्ड
t('nav.chat')          // Chat / चैट
t('nav.appointments')  // Appointments / अपॉइंटमेंट
t('nav.analysis')      // Analysis / विश्लेषण
t('nav.journals')      // Journals / जर्नल
```

### Brand (Already Available)
```javascript
t('brand.name')        // The MindMates / द माइंडमेट्स
t('brand.tagline')     // Your Mental Wellness Companion
```

### Wallet (Already Available)
```javascript
t('wallet.balance')    // Wallet / वॉलेट
t('wallet.recharge')   // Recharge / रिचार्ज
t('wallet.addFunds')   // Add Funds / फंड जोड़ें
```

### Chat (Already Available - COMPLETE SET)
```javascript
t('chat.assistant')           // AI Assistant / एआई सहायक
t('chat.support')             // MindMates Support / माइंडमेट्स सपोर्ट
t('chat.active')              // Active / सक्रिय
t('chat.paused')              // Paused / रुका हुआ
t('chat.topUp')               // Top Up / टॉप अप
t('chat.toggleTheme')         // Toggle Theme / थीम बदलें
t('chat.fullScreen')          // Full Screen Chat / पूर्ण स्क्रीन चैट
t('chat.closeChat')           // Close Chat / चैट बंद करें
t('chat.typeMessage')         // Type your message... / अपना संदेश लिखें...
t('chat.send')                // Send / भेजें
t('chat.toast.balanceDepleted')       // Toast for balance depleted
t('chat.toast.insufficientBalance')   // Toast for insufficient balance
```

### Dashboard (Keys Ready - Need to Apply)
```javascript
t('dashboard.welcome')         // Welcome back / वापसी पर स्वागत है
t('dashboard.level')           // Level / स्तर
t('dashboard.xp')              // XP / अनुभव अंक
t('dashboard.streak')          // Day Streak / दिन की लकीर
t('dashboard.quickAccess')     // Quick Access / त्वरित पहुंच
t('dashboard.mentalHealth')    // Mental Health / मानसिक स्वास्थ्य
t('dashboard.score')           // Score / स्कोर
t('dashboard.recentJournals')  // Recent Journals / हाल की जर्नल
t('dashboard.noJournals')      // No journal entries yet / अभी तक कोई जर्नल प्रविष्टि नहीं
```

### Appointments (Keys Ready - Need to Apply)
```javascript
t('appointments.date')         // Date / तारीख
t('appointments.time')         // Time / समय
t('appointments.doctor')       // Doctor / डॉक्टर
t('appointments.type')         // Type / प्रकार
t('appointments.status')       // Status / स्थिति
t('appointments.confirmed')    // Confirmed / पुष्टि की गई
t('appointments.pending')      // Pending / लंबित
t('appointments.completed')    // Completed / पूर्ण
t('appointments.cancelled')    // Cancelled / रद्द
```

### Journals (Keys Ready - Need to Apply)
```javascript
t('journals.writeHere')    // Write your thoughts here... / अपने विचार यहाँ लिखें...
t('journals.save')         // Save / सहेजें
t('journals.saved')        // Saved / सहेजा गया
t('journals.noEntries')    // No journal entries / कोई जर्नल प्रविष्टि नहीं
```

### Analysis (Keys Ready - Need to Apply)
```javascript
t('analysis.score')            // Score / स्कोर
t('analysis.date')             // Date / तारीख
t('analysis.noData')           // No analysis data available
t('analysis.startAssessment')  // Start Assessment / मूल्यांकन शुरू करें
```

---

## 📝 How to Use in Components

### Basic Usage:
```jsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

### With Dynamic Content:
```jsx
// For interpolation (if needed later)
t('welcome.message', { name: 'John' })
// Config: "welcome.message": "Hello, {{name}}!"
```

---

## 🌍 Supported Languages

1. **English (en)** - Default
2. **Hindi (hi)** - हिंदी
3. **Tamil (ta)** - தமிழ்
4. **Spanish (es)** - Español
5. **French (fr)** - Français

---

## ✅ Completed Components

- ✅ **Navbar.jsx** - All navigation, wallet, notifications, settings
- ✅ **Settings.jsx** - All settings UI, toggles, sections
- ✅ **ChatBot.jsx** - All chat UI, buttons, toasts, status indicators

---

## 🎯 Next to Translate (In Order)

1. **Dashboard.jsx** - Main user interface (HIGHEST PRIORITY)
2. **FullChat.jsx** - Full chat experience
3. **Home.jsx** - Landing page
4. **AppointmentsPage.jsx** - Appointment management
5. **JournalsPage.jsx** - Journal entries
6. **AnalysisPage.jsx** - Mental health analysis

---

## 🔍 Finding Hardcoded Text

### Method 1: Visual Inspection
Open the component and look for text in quotes:
```jsx
<h1>"Welcome"</h1>  ← This needs translation
<button>"Click Me"</button>  ← This needs translation
```

### Method 2: Use grep
```bash
grep -n '"[A-Za-z]' src/components/Dashboard.jsx
```

### Method 3: Search for common patterns
Look for:
- Button labels
- Headings (h1, h2, h3)
- Placeholder text
- Toast/alert messages
- Modal titles
- Error messages

---

## 🚨 Important Rules

1. **NEVER** translate:
   - CSS classes
   - Variable names
   - Function names
   - Import paths
   - HTML attributes (except user-visible ones like `placeholder`, `title`, `alt`)

2. **ALWAYS** translate:
   - Button text
   - Headings & titles
   - Descriptions & subtitles
   - Placeholder text
   - Toast/Alert messages
   - Error messages
   - Success messages

3. **DOUBLE CHECK**:
   - Translation key exists in config.js
   - Translation exists in ALL 5 languages
   - useTranslation hook is imported
   - t() is destructured from useTranslation()

---

## 💾 Save Points

After translating each component:
1. ✅ Save the file
2. ✅ Check for errors: `npm run dev`
3. ✅ Test language switching in Settings
4. ✅ Verify all text updates correctly

---

## 🎨 Example: Complete Component Translation

**Before:**
```jsx
function Dashboard() {
  return (
    <div>
      <h1>Welcome back</h1>
      <p>Your mental health score: 85</p>
      <button>View Details</button>
    </div>
  );
}
```

**After:**
```jsx
import { useTranslation } from "react-i18next";

function Dashboard() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <p>{t('dashboard.scoreText')}: 85</p>
      <button>{t('dashboard.viewDetails')}</button>
    </div>
  );
}
```

---

## 📞 Quick Debugging

**Problem:** Text not changing when language switches
- ✅ Check: Is useTranslation imported?
- ✅ Check: Is t() destructured?
- ✅ Check: Does key exist in config.js?
- ✅ Check: Does key exist in ALL languages?

**Problem:** Error "Missing translation"
- ✅ Check spelling of key in component
- ✅ Check spelling of key in config.js
- ✅ Make sure key is in quotes: `t('key.name')`

---

## 📚 Further Reading

See `TRANSLATION_GUIDE.md` for:
- Complete component list
- Detailed translation patterns
- Adding new translation keys
- Multi-language workflow

---

**Remember:** Every piece of visible text should use `t('translation.key')` format!
