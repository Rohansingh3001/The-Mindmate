import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations } from './translations';

// Enhanced Translation resources with LexiMind caching - Indian Languages Focus
const resources = {
  en: {
    translation: {
      // Navigation & Common
      "nav.home": "Home",
      "nav.dashboard": "Dashboard",
      "nav.chat": "Chat",
      "nav.appointments": "Appointments",
      "nav.analysis": "Analysis",
      "nav.journals": "Journals",
      "nav.settings": "Settings",
      "nav.logout": "Logout",
      "common.goBack": "Go Back",
      "common.loading": "Loading...",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.edit": "Edit",
      "common.delete": "Delete",
      "common.search": "Search",
      "common.filter": "Filter",
      "common.clear": "Clear",
      "common.submit": "Submit",
      "common.close": "Close",
      
      // Branding
      "brand.name": "The MindMates",
      "brand.tagline": "Your Mental Wellness Companion",
      "brand.footer": "Made with ❤️ for mental wellness",
      
      // Settings Page
      "settings.title": "Settings",
      "settings.subtitle": "Customize your MindMates experience",
      "settings.editProfile": "Edit Profile",
      
      // Settings - Appearance
      "settings.appearance": "Appearance",
      "settings.appearance.subtitle": "Customize how MindMates looks",
      "settings.theme": "Theme Mode",
      "settings.theme.light": "Light",
      "settings.theme.dark": "Dark",
      "settings.theme.system": "System",
      "settings.language": "Language",
      "settings.language.subtitle": "Select your preferred language",
      
      // Settings - Experience
      "settings.experience": "Experience",
      "settings.experience.subtitle": "Personalize your interactions",
      "settings.assessment": "Assessment Plan",
      "settings.assessment.subtitle": "Choose how many tests to display",
      "settings.assessment.one": "1 Test",
      "settings.assessment.two": "2 Tests",
      "settings.assessment.all": "All Tests",
      "settings.quotes": "Motivational Quotes",
      "settings.quotes.desc": "Show inspiring quotes throughout the app",
      "settings.sound": "Sound Effects",
      "settings.sound.desc": "Play sounds for interactions and notifications",
      "settings.autoDownload": "Auto Download Reports",
      "settings.autoDownload.desc": "Automatically download assessment results",
      
      // Settings - Notifications
      "settings.notifications": "Notifications",
      "settings.notifications.subtitle": "Stay updated",
      "settings.notifications.opening": "Opening settings...",
      "settings.push": "Push Notifications",
      "settings.push.desc": "Get notified about important updates",
      "settings.email": "Email Updates",
      "settings.email.desc": "Receive weekly progress emails",
      
      // Settings - Privacy
      "settings.privacy": "Privacy & Data",
      "settings.privacy.subtitle": "Your data, your control",
      "settings.analytics": "Anonymous Analytics",
      "settings.analytics.desc": "Help us improve MindMates",
      "settings.privacyPolicy": "Privacy Policy",
      "settings.terms": "Terms of Service",
      
      // Settings - Account
      "settings.account": "Account",
      "settings.account.subtitle": "Manage your account",
      "settings.changePassword": "Change Password",
      
      // Dashboard
      "dashboard.welcome": "Welcome back",
      "dashboard.overview": "Your Mental Wellness Overview",
      "dashboard.todayMood": "Today's Mood",
      "dashboard.weeklyProgress": "Weekly Progress",
      "dashboard.achievements": "Achievements",
      "dashboard.quickActions": "Quick Actions",
      "dashboard.startChat": "Start Chat",
      "dashboard.trackMood": "Track Mood",
      "dashboard.viewReports": "View Reports",
      "dashboard.bookAppointment": "Book Appointment",
      "dashboard.level": "Level",
      "dashboard.xp": "XP",
      "dashboard.streak": "Day Streak",
      "dashboard.viewAll": "View All",
      "dashboard.quickAccess": "Quick Access",
      "dashboard.mentalHealth": "Mental Health",
      "dashboard.score": "Score",
      "dashboard.lastUpdated": "Last Updated",
      "dashboard.recentJournals": "Recent Journals",
      "dashboard.noJournals": "No journal entries yet",
      "dashboard.startJourney": "Start your wellness journey today",
      
      // Chat & ChatBot
      "chat.title": "AI Therapy Suite",
      "chat.selectPersona": "Select a Companion",
      "chat.wallet": "Wallet Balance",
      "chat.minimize": "Minimize",
      "chat.maximize": "Maximize",
      "chat.close": "Close",
      "chat.startConversation": "Start a conversation",
      "chat.selectCompanion": "Select a companion to start",
      "chat.lowBalance": "Low wallet balance",
      "chat.rechargeNow": "Recharge Now",
      "chat.sessionActive": "Session Active",
      "chat.sessionEnded": "Session Ended",
      "chat.assistant": "AI Assistant",
      "chat.support": "MindMates Support",
      "chat.toggleTheme": "Toggle Theme",
      "chat.fullScreen": "Full Screen Chat",
      "chat.closeChat": "Close Chat",
      "chat.active": "Active",
      "chat.paused": "Paused",
      "chat.topUp": "Top Up",
      "chat.timeRemaining": "Time Remaining",
      "chat.balanceDepleted": "Wallet balance depleted",
      "chat.fillNow": "Fill Now",
      "chat.typeMessage": "Type your message...",
      "chat.send": "Send",
      
      // Chat - Toast Messages
      "chat.toast.balanceDepleted": "⚠️ Wallet balance depleted! Please top up to continue.",
      "chat.toast.insufficientBalance": "💰 Insufficient balance! Please top up to continue chatting.",
      
      // Wallet
      "wallet.balance": "Wallet",
      "wallet.recharge": "Recharge",
      "wallet.addFunds": "Add Funds",
      
      // Notifications
      "notifications.none": "No notifications available",
      "notifications.new": "New notification",
      "chat.addFunds": "Add Funds",
      "chat.timeRemaining": "Time Remaining",
      "chat.typing": "Typing...",
      "chat.sendMessage": "Send a message...",
      "chat.online": "Online",
      "chat.offline": "Offline",
      
      // Appointments
      "appointments.title": "Appointments",
      "appointments.upcoming": "Upcoming Appointments",
      "appointments.past": "Past Appointments",
      "appointments.book": "Book New Appointment",
      "appointments.reschedule": "Reschedule",
      "appointments.cancel": "Cancel",
      "appointments.noAppointments": "No appointments scheduled",
      "appointments.date": "Date",
      "appointments.time": "Time",
      "appointments.doctor": "Doctor",
      "appointments.type": "Type",
      "appointments.status": "Status",
      "appointments.confirmed": "Confirmed",
      "appointments.pending": "Pending",
      "appointments.completed": "Completed",
      "appointments.cancelled": "Cancelled",
      
      // Analysis
      "analysis.title": "Mental Health Analysis",
      "analysis.overview": "Analysis Overview",
      "analysis.assessments": "Assessments",
      "analysis.results": "Results",
      "analysis.recommendations": "Recommendations",
      "analysis.takeTest": "Take Assessment",
      "analysis.viewHistory": "View History",
      "analysis.score": "Score",
      "analysis.date": "Date",
      "analysis.noData": "No analysis data available",
      "analysis.startAssessment": "Start your first assessment",
      
      // Journals
      "journals.title": "My Journals",
      "journals.new": "New Entry",
      "journals.today": "Today's Entry",
      "journals.recent": "Recent Entries",
      "journals.mood": "Mood",
      "journals.thoughts": "Thoughts",
      "journals.gratitude": "Gratitude",
      "journals.writeHere": "Write your thoughts here...",
      "journals.save": "Save Entry",
      "journals.saved": "Journal entry saved",
      "journals.noEntries": "No journal entries yet",
      "journals.startWriting": "Start writing your first entry",
      
      // Gamification
      "gamify.dashboard": "Wellness Journey",
      "gamify.level": "Level",
      "gamify.xp": "XP",
      "gamify.streak": "Day Streak",
      "gamify.quests": "Quests",
      "gamify.achievements": "Achievements",
      "gamify.rewards": "Rewards",
      "gamify.challenges": "Challenges",
      "gamify.progress": "Progress",
      
      // Error Messages
      "error.generic": "Something went wrong. Please try again.",
      "error.network": "Network error. Please check your connection.",
      "error.auth": "Authentication failed. Please log in again.",
      "error.notFound": "Page not found.",
    }
  },
  hi: {
    translation: {
      // Navigation & Common
      "nav.home": "होम",
      "nav.dashboard": "डैशबोर्ड",
      "nav.chat": "चैट",
      "nav.appointments": "अपॉइंटमेंट",
      "nav.analysis": "विश्लेषण",
      "nav.journals": "जर्नल",
      "nav.settings": "सेटिंग्स",
      "nav.logout": "लॉगआउट",
      "common.goBack": "वापस जाएं",
      "common.loading": "लोड हो रहा है...",
      "common.save": "सहेजें",
      "common.cancel": "रद्द करें",
      "common.edit": "संपादित करें",
      "common.delete": "हटाएं",
      "common.search": "खोजें",
      "common.filter": "फ़िल्टर",
      "common.clear": "साफ़ करें",
      "common.submit": "जमा करें",
      "common.close": "बंद करें",
      
      // Branding
      "brand.name": "द माइंडमेट्स",
      "brand.tagline": "आपका मानसिक स्वास्थ्य साथी",
      "brand.footer": "मानसिक कल्याण के लिए ❤️ के साथ बनाया गया",
      
      // Settings Page
      "settings.title": "सेटिंग्स",
      "settings.subtitle": "अपने माइंडमेट्स अनुभव को अनुकूलित करें",
      "settings.editProfile": "प्रोफ़ाइल संपादित करें",
      
      // Settings - Appearance
      "settings.appearance": "दिखावट",
      "settings.appearance.subtitle": "माइंडमेट्स का रूप अनुकूलित करें",
      "settings.theme": "थीम मोड",
      "settings.theme.light": "हल्का",
      "settings.theme.dark": "गहरा",
      "settings.theme.system": "सिस्टम",
      "settings.language": "भाषा",
      "settings.language.subtitle": "अपनी पसंदीदा भाषा चुनें",
      
      // Settings - Experience
      "settings.experience": "अनुभव",
      "settings.experience.subtitle": "अपनी बातचीत को वैयक्तिकृत करें",
      "settings.assessment": "मूल्यांकन योजना",
      "settings.assessment.subtitle": "प्रदर्शित करने के लिए परीक्षणों की संख्या चुनें",
      "settings.assessment.one": "1 परीक्षण",
      "settings.assessment.two": "2 परीक्षण",
      "settings.assessment.all": "सभी परीक्षण",
      "settings.quotes": "प्रेरक उद्धरण",
      "settings.quotes.desc": "पूरे ऐप में प्रेरणादायक उद्धरण दिखाएं",
      "settings.sound": "ध्वनि प्रभाव",
      "settings.sound.desc": "इंटरैक्शन और सूचनाओं के लिए ध्वनि चलाएं",
      "settings.autoDownload": "रिपोर्ट स्वतः डाउनलोड करें",
      "settings.autoDownload.desc": "मूल्यांकन परिणाम स्वचालित रूप से डाउनलोड करें",
      
      // Settings - Notifications
      "settings.notifications": "सूचनाएं",
      "settings.notifications.subtitle": "अपडेट रहें",
      "settings.notifications.opening": "सेटिंग्स खोली जा रही हैं...",
      "settings.push": "पुश सूचनाएं",
      "settings.push.desc": "महत्वपूर्ण अपडेट के बारे में सूचित करें",
      "settings.email": "ईमेल अपडेट",
      "settings.email.desc": "साप्ताहिक प्रगति ईमेल प्राप्त करें",
      
      // Settings - Privacy
      "settings.privacy": "गोपनीयता और डेटा",
      "settings.privacy.subtitle": "आपका डेटा, आपका नियंत्रण",
      "settings.analytics": "गुमनाम विश्लेषण",
      "settings.analytics.desc": "माइंडमेट्स को बेहतर बनाने में हमारी मदद करें",
      "settings.privacyPolicy": "गोपनीयता नीति",
      "settings.terms": "सेवा की शर्तें",
      
      // Settings - Account
      "settings.account": "खाता",
      "settings.account.subtitle": "अपना खाता प्रबंधित करें",
      "settings.changePassword": "पासवर्ड बदलें",
      
      // Dashboard
      "dashboard.welcome": "वापसी पर स्वागत है",
      "dashboard.overview": "आपका मानसिक स्वास्थ्य अवलोकन",
      "dashboard.todayMood": "आज का मूड",
      "dashboard.weeklyProgress": "साप्ताहिक प्रगति",
      "dashboard.achievements": "उपलब्धियां",
      "dashboard.quickActions": "त्वरित कार्य",
      "dashboard.startChat": "चैट शुरू करें",
      "dashboard.trackMood": "मूड ट्रैक करें",
      "dashboard.viewReports": "रिपोर्ट देखें",
      "dashboard.bookAppointment": "अपॉइंटमेंट बुक करें",
      "dashboard.level": "स्तर",
      "dashboard.xp": "अनुभव अंक",
      "dashboard.streak": "दिन की लकीर",
      "dashboard.viewAll": "सभी देखें",
      "dashboard.quickAccess": "त्वरित पहुंच",
      "dashboard.mentalHealth": "मानसिक स्वास्थ्य",
      "dashboard.score": "स्कोर",
      "dashboard.lastUpdated": "अंतिम अपडेट",
      "dashboard.recentJournals": "हाल की जर्नल",
      "dashboard.noJournals": "अभी तक कोई जर्नल प्रविष्टि नहीं",
      "dashboard.startJourney": "आज अपनी कल्याण यात्रा शुरू करें",
      
      // Chat & ChatBot
      "chat.title": "एआई थेरेपी सूट",
      "chat.selectPersona": "एक साथी चुनें",
      "chat.wallet": "वॉलेट बैलेंस",
      "chat.minimize": "छोटा करें",
      "chat.maximize": "बड़ा करें",
      "chat.close": "बंद करें",
      "chat.startConversation": "बातचीत शुरू करें",
      "chat.selectCompanion": "शुरू करने के लिए एक साथी चुनें",
      "chat.lowBalance": "वॉलेट बैलेंस कम है",
      "chat.rechargeNow": "अभी रिचार्ज करें",
      "chat.sessionActive": "सत्र सक्रिय",
      "chat.sessionEnded": "सत्र समाप्त",
      "chat.assistant": "एआई सहायक",
      "chat.support": "माइंडमेट्स सपोर्ट",
      "chat.toggleTheme": "थीम बदलें",
      "chat.fullScreen": "पूर्ण स्क्रीन चैट",
      "chat.closeChat": "चैट बंद करें",
      "chat.active": "सक्रिय",
      "chat.paused": "रुका हुआ",
      "chat.topUp": "टॉप अप",
      "chat.timeRemaining": "शेष समय",
      "chat.balanceDepleted": "वॉलेट बैलेंस समाप्त",
      "chat.fillNow": "अभी भरें",
      "chat.typeMessage": "अपना संदेश लिखें...",
      "chat.send": "भेजें",
      "chat.typing": "टाइप कर रहा है...",
      "chat.sendMessage": "एक संदेश भेजें...",
      "chat.online": "ऑनलाइन",
      "chat.offline": "ऑफ़लाइन",
      
      // Chat - Toast Messages
      "chat.toast.balanceDepleted": "⚠️ वॉलेट बैलेंस समाप्त! कृपया जारी रखने के लिए टॉप अप करें।",
      "chat.toast.insufficientBalance": "💰 अपर्याप्त बैलेंस! कृपया चैट जारी रखने के लिए टॉप अप करें।",
      
      // Wallet
      "wallet.balance": "वॉलेट",
      "wallet.recharge": "रिचार्ज",
      "wallet.addFunds": "फंड जोड़ें",
      
      // Notifications
      "notifications.none": "कोई सूचना उपलब्ध नहीं है",
      "notifications.new": "नई सूचना",
      
      // Appointments
      "appointments.title": "अपॉइंटमेंट",
      "appointments.upcoming": "आगामी अपॉइंटमेंट",
      "appointments.past": "पिछले अपॉइंटमेंट",
      "appointments.book": "नया अपॉइंटमेंट बुक करें",
      "appointments.reschedule": "पुनर्निर्धारित करें",
      "appointments.cancel": "रद्द करें",
      "appointments.noAppointments": "कोई अपॉइंटमेंट निर्धारित नहीं है",
      "appointments.date": "तारीख",
      "appointments.time": "समय",
      "appointments.doctor": "डॉक्टर",
      "appointments.type": "प्रकार",
      "appointments.status": "स्थिति",
      "appointments.confirmed": "पुष्टि की गई",
      "appointments.pending": "लंबित",
      "appointments.completed": "पूर्ण",
      "appointments.cancelled": "रद्द",
      
      // Analysis
      "analysis.title": "मानसिक स्वास्थ्य विश्लेषण",
      "analysis.overview": "विश्लेषण अवलोकन",
      "analysis.assessments": "मूल्यांकन",
      "analysis.results": "परिणाम",
      "analysis.recommendations": "सिफारिशें",
      "analysis.takeTest": "मूल्यांकन लें",
      "analysis.viewHistory": "इतिहास देखें",
      "analysis.score": "स्कोर",
      "analysis.date": "तारीख",
      "analysis.noData": "कोई विश्लेषण डेटा उपलब्ध नहीं",
      "analysis.startAssessment": "अपना पहला मूल्यांकन शुरू करें",
      
      // Journals
      "journals.title": "मेरी जर्नल",
      "journals.new": "नई प्रविष्टि",
      "journals.today": "आज की प्रविष्टि",
      "journals.recent": "हाल की प्रविष्टियां",
      "journals.mood": "मूड",
      "journals.thoughts": "विचार",
      "journals.gratitude": "कृतज्ञता",
      "journals.writeHere": "अपने विचार यहां लिखें...",
      "journals.save": "प्रविष्टि सहेजें",
      "journals.saved": "जर्नल प्रविष्टि सहेजी गई",
      "journals.noEntries": "अभी तक कोई जर्नल प्रविष्टि नहीं",
      "journals.startWriting": "अपनी पहली प्रविष्टि लिखना शुरू करें",
      
      // Gamification
      "gamify.dashboard": "कल्याण यात्रा",
      "gamify.level": "स्तर",
      "gamify.xp": "अनुभव अंक",
      "gamify.streak": "दिन की लकीर",
      "gamify.quests": "खोज",
      "gamify.achievements": "उपलब्धियां",
      "gamify.rewards": "पुरस्कार",
      "gamify.challenges": "चुनौतियां",
      "gamify.progress": "प्रगति",
      
      // Error Messages
      "error.generic": "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
      "error.network": "नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें।",
      "error.auth": "प्रमाणीकरण विफल। कृपया फिर से लॉग इन करें।",
      "error.notFound": "पृष्ठ नहीं मिला।",
    }
  },
  ta: {
    translation: {
      // Navigation & Common
      "nav.home": "முகப்பு",
      "nav.dashboard": "டாஷ்போர்டு",
      "nav.chat": "அரட்டை",
      "nav.appointments": "சந்திப்புகள்",
      "nav.analysis": "பகுப்பாய்வு",
      "nav.journals": "நாட்குறிப்புகள்",
      "nav.settings": "அமைப்புகள்",
      "nav.logout": "வெளியேறு",
      "common.goBack": "திரும்பிச் செல்",
      "common.loading": "ஏற்றுகிறது...",
      "common.save": "சேமி",
      "common.cancel": "ரத்து செய்",
      "common.edit": "திருத்து",
      "common.delete": "நீக்கு",
      "common.search": "தேடு",
      "common.filter": "வடிகட்டு",
      "common.clear": "அழி",
      "common.submit": "சமர்ப்பி",
      "common.close": "மூடு",
      
      // Branding
      "brand.name": "தி மைண்ட்மேட்ஸ்",
      "brand.tagline": "உங்கள் மன ஆரோக்கிய துணை",
      "brand.footer": "மன நலனுக்காக ❤️ உடன் உருவாக்கப்பட்டது",
      
      // Settings Page
      "settings.title": "அமைப்புகள்",
      "settings.subtitle": "உங்கள் மைண்ட்மேட்ஸ் அனுபவத்தை தனிப்பயனாக்குங்கள்",
      "settings.editProfile": "சுயவிவரத்தை திருத்து",
      
      // Settings - Appearance
      "settings.appearance": "தோற்றம்",
      "settings.appearance.subtitle": "மைண்ட்மேட்ஸ் எப்படி தோற்றமளிக்கிறது என்பதை தனிப்பயனாக்கு",
      "settings.theme": "தீம் முறை",
      "settings.theme.light": "ஒளி",
      "settings.theme.dark": "இருள்",
      "settings.theme.system": "கணினி",
      "settings.language": "மொழி",
      "settings.language.subtitle": "உங்களுக்கு விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்",
      
      // Settings - Experience
      "settings.experience": "அனுபவம்",
      "settings.experience.subtitle": "உங்கள் தொடர்புகளை தனிப்பயனாக்குங்கள்",
      "settings.assessment": "மதிப்பீட்டு திட்டம்",
      "settings.assessment.subtitle": "எத்தனை சோதனைகளைக் காண்பிக்க வேண்டும் என்பதைத் தேர்ந்தெடுக்கவும்",
      "settings.assessment.one": "1 சோதனை",
      "settings.assessment.two": "2 சோதனைகள்",
      "settings.assessment.all": "அனைத்து சோதனைகள்",
      "settings.quotes": "ஊக்குவிப்பு மேற்கோள்கள்",
      "settings.quotes.desc": "பயன்பாடு முழுவதும் ஊக்கமளிக்கும் மேற்கோள்களைக் காட்டு",
      "settings.sound": "ஒலி விளைவுகள்",
      "settings.sound.desc": "தொடர்புகள் மற்றும் அறிவிப்புகளுக்கான ஒலிகளை இயக்கு",
      "settings.autoDownload": "தானாக அறிக்கைகளை பதிவிறக்கு",
      "settings.autoDownload.desc": "மதிப்பீட்டு முடிவுகளை தானாக பதிவிறக்கு",
      
      // Settings - Notifications
      "settings.notifications": "அறிவிப்புகள்",
      "settings.notifications.subtitle": "புதுப்பிக்கப்பட்டிருங்கள்",
      "settings.notifications.opening": "அமைப்புகளைத் திறக்கிறது...",
      "settings.push": "புஷ் அறிவிப்புகள்",
      "settings.push.desc": "முக்கியமான புதுப்பிப்புகள் பற்றி அறிவிக்கப்படுங்கள்",
      "settings.email": "மின்னஞ்சல் புதுப்பிப்புகள்",
      "settings.email.desc": "வாராந்திர முன்னேற்ற மின்னஞ்சல்களைப் பெறுங்கள்",
      
      // Settings - Privacy
      "settings.privacy": "தனியுரிமை மற்றும் தரவு",
      "settings.privacy.subtitle": "உங்கள் தரவு, உங்கள் கட்டுப்பாடு",
      "settings.analytics": "அநாமதேய பகுப்பாய்வு",
      "settings.analytics.desc": "மைண்ட்மேட்ஸை மேம்படுத்த எங்களுக்கு உதவுங்கள்",
      "settings.privacyPolicy": "தனியுரிமைக் கொள்கை",
      "settings.terms": "சேவை விதிமுறைகள்",
      
      // Settings - Account
      "settings.account": "கணக்கு",
      "settings.account.subtitle": "உங்கள் கணக்கை நிர்வகிக்கவும்",
      "settings.changePassword": "கடவுச்சொல்லை மாற்று",
      
      // Dashboard
      "dashboard.welcome": "மீண்டும் வரவேற்கிறோம்",
      "dashboard.overview": "உங்கள் மன ஆரோக்கிய கண்ணோட்டம்",
      "dashboard.todayMood": "இன்றைய மனநிலை",
      "dashboard.weeklyProgress": "வாராந்திர முன்னேற்றம்",
      "dashboard.achievements": "சாதனைகள்",
      "dashboard.quickActions": "விரைவு செயல்கள்",
      "dashboard.startChat": "அரட்டையைத் தொடங்கு",
      "dashboard.trackMood": "மனநிலையைக் கண்காணி",
      "dashboard.viewReports": "அறிக்கைகளைக் காண்க",
      "dashboard.bookAppointment": "சந்திப்பை முன்பதிவு செய்",
      
      // Chat
      "chat.title": "AI சிகிச்சை தொகுப்பு",
      "chat.selectPersona": "ஒரு துணையைத் தேர்ந்தெடுக்கவும்",
      "chat.wallet": "பணப்பை இருப்பு",
      "chat.addFunds": "நிதியைச் சேர்",
      "chat.timeRemaining": "மீதமுள்ள நேரம்",
      "chat.typing": "தட்டச்சு செய்கிறது...",
      "chat.sendMessage": "ஒரு செய்தியை அனுப்பு...",
      "chat.online": "இணையத்தில்",
      "chat.offline": "இணையத்தில் இல்லை",
      
      // Wallet
      "wallet.balance": "பணப்பை",
      "wallet.recharge": "ரீசார்ஜ்",
      "wallet.addFunds": "நிதியைச் சேர்",
      
      // Notifications
      "notifications.none": "அறிவிப்புகள் எதுவும் கிடைக்கவில்லை",
      "notifications.new": "புதிய அறிவிப்பு",
      
      // Appointments
      "appointments.title": "சந்திப்புகள்",
      "appointments.upcoming": "வரவிருக்கும் சந்திப்புகள்",
      "appointments.past": "கடந்த சந்திப்புகள்",
      "appointments.book": "புதிய சந்திப்பை முன்பதிவு செய்",
      "appointments.reschedule": "மீண்டும் திட்டமிடு",
      "appointments.cancel": "ரத்து செய்",
      "appointments.noAppointments": "எந்த சந்திப்பும் திட்டமிடப்படவில்லை",
      
      // Analysis
      "analysis.title": "மன ஆரோக்கிய பகுப்பாய்வு",
      "analysis.overview": "பகுப்பாய்வு கண்ணோட்டம்",
      "analysis.assessments": "மதிப்பீடுகள்",
      "analysis.results": "முடிவுகள்",
      "analysis.recommendations": "பரிந்துரைகள்",
      "analysis.takeTest": "மதிப்பீட்டை எடு",
      "analysis.viewHistory": "வரலாற்றைக் காண்க",
      
      // Journals
      "journals.title": "என் நாட்குறிப்புகள்",
      "journals.new": "புதிய பதிவு",
      "journals.today": "இன்றைய பதிவு",
      "journals.recent": "சமீபத்திய பதிவுகள்",
      "journals.mood": "மனநிலை",
      "journals.thoughts": "எண்ணங்கள்",
      "journals.gratitude": "நன்றி",
      
      // Gamification
      "gamify.dashboard": "நல்வாழ்வு பயணம்",
      "gamify.level": "நிலை",
      "gamify.xp": "அனுபவ புள்ளிகள்",
      "gamify.streak": "நாள் தொடர்",
      "gamify.quests": "தேடல்கள்",
      "gamify.achievements": "சாதனைகள்",
      "gamify.rewards": "வெகுமதிகள்",
      "gamify.challenges": "சவால்கள்",
      "gamify.progress": "முன்னேற்றம்",
      
      // Error Messages
      "error.generic": "ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.",
      "error.network": "நெட்வொர்க் பிழை. உங்கள் இணைப்பை சரிபார்க்கவும்.",
      "error.auth": "அங்கீகாரம் தோல்வியடைந்தது. மீண்டும் உள்நுழையவும்.",
      "error.notFound": "பக்கம் கிடைக்கவில்லை.",
    }
  },
  // Import other Indian languages from translations file
  ...translations
};

// Initialize i18next with enhanced features
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: localStorage.getItem('mindmate-language') || localStorage.getItem('language') || 'en',
    
    interpolation: {
      escapeValue: false, // React already escapes
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'mindmate-language',
    },
  });

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  console.log('🌐 Language changed to:', lng);
  document.documentElement.lang = lng;
  localStorage.setItem('mindmate-language', lng);
  localStorage.setItem('language', lng);
});

// Export supported languages for language switcher
export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', nativeName: 'தமிழ்' },
];

// Export i18n instance
export default i18n;
