// src/i18n/utils.js
// Advanced i18n utilities for Mindmate mental health app

import i18n from './config';
import { format, formatDistanceToNow } from 'date-fns';

/**
 * Get current language
 * @returns {string} Current language code
 */
export const getLanguage = () => {
  return i18n.language || 'en';
};

/**
 * Format dates with localization
 * @param {Date} date - Date to format
 * @param {string} formatType - Format style ('short', 'long', 'relative')
 * @returns {string} Formatted date
 */
export const formatDate = (date, formatType = 'short') => {
  const lang = getLanguage();
  
  if (formatType === 'relative') {
    // Relative time (e.g., "2 hours ago", "Yesterday")
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return lang === 'hi' ? 'अभी' : lang === 'ta' ? 'இப்பொழுது' : 'Just now';
    if (diffMins < 60) return formatDistanceToNow(date, { addSuffix: true });
    if (diffHours < 24) return formatDistanceToNow(date, { addSuffix: true });
    if (diffDays < 7) return formatDistanceToNow(date, { addSuffix: true });
  }
  
  return format(date, formatType === 'long' ? 'MMMM dd, yyyy' : 'MMM dd, yyyy');
};

/**
 * Format numbers with localization
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatLocalizedNumber = (num) => {
  const lang = getLanguage();
  return new Intl.NumberFormat(lang === 'hi' ? 'hi-IN' : lang === 'ta' ? 'ta-IN' : 'en-IN').format(num);
};

/**
 * Format currency for wallet/payments
 * @param {number} amount - Amount in INR
 * @returns {string} Formatted currency
 */
export const formatMoney = (amount) => {
  const lang = getLanguage();
  return new Intl.NumberFormat(lang === 'hi' ? 'hi-IN' : lang === 'ta' ? 'ta-IN' : 'en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

/**
 * Pluralize mental health terms
 * @param {string} key - Translation key
 * @param {number} count - Count for pluralization
 * @returns {string} Pluralized text
 */
export const pluralizeMentalHealth = (key, count) => {
  const lang = getLanguage();
  
  const pluralRules = {
    en: {
      'journal': count === 1 ? 'journal entry' : 'journal entries',
      'appointment': count === 1 ? 'appointment' : 'appointments',
      'quest': count === 1 ? 'quest' : 'quests',
      'achievement': count === 1 ? 'achievement' : 'achievements',
      'day': count === 1 ? 'day' : 'days',
      'session': count === 1 ? 'session' : 'sessions',
    },
    hi: {
      'journal': count === 1 ? 'जर्नल प्रविष्टि' : 'जर्नल प्रविष्टियां',
      'appointment': count === 1 ? 'अपॉइंटमेंट' : 'अपॉइंटमेंट',
      'quest': count === 1 ? 'खोज' : 'खोज',
      'achievement': count === 1 ? 'उपलब्धि' : 'उपलब्धियां',
      'day': count === 1 ? 'दिन' : 'दिन',
      'session': count === 1 ? 'सत्र' : 'सत्र',
    },
    ta: {
      'journal': count === 1 ? 'நாட்குறிப்பு பதிவு' : 'நாட்குறிப்பு பதிவுகள்',
      'appointment': count === 1 ? 'சந்திப்பு' : 'சந்திப்புகள்',
      'quest': count === 1 ? 'தேடல்' : 'தேடல்கள்',
      'achievement': count === 1 ? 'சாதனை' : 'சாதனைகள்',
      'day': count === 1 ? 'நாள்' : 'நாட்கள்',
      'session': count === 1 ? 'அமர்வு' : 'அமர்வுகள்',
    },
  };
  
  return `${count} ${pluralRules[lang]?.[key] || pluralRules['en'][key]}`;
};

/**
 * Get greeting based on time of day
 * @returns {string} Localized greeting
 */
export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  const lang = getLanguage();
  
  const greetings = {
    en: {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
      night: 'Good night',
    },
    hi: {
      morning: 'सुप्रभात',
      afternoon: 'शुभ दोपहर',
      evening: 'शुभ संध्या',
      night: 'शुभ रात्रि',
    },
    ta: {
      morning: 'காலை வணக்கம்',
      afternoon: 'மதிய வணக்கம்',
      evening: 'மாலை வணக்கம்',
      night: 'இரவு வணக்கம்',
    },
  };
  
  let timeKey = 'morning';
  if (hour >= 12 && hour < 17) timeKey = 'afternoon';
  else if (hour >= 17 && hour < 21) timeKey = 'evening';
  else if (hour >= 21 || hour < 5) timeKey = 'night';
  
  return greetings[lang]?.[timeKey] || greetings['en'][timeKey];
};

/**
 * Format wellness score with context
 * @param {number} score - Wellness score (0-100)
 * @returns {object} Score with status and message
 */
export const formatWellnessScore = (score) => {
  const lang = getLanguage();
  
  const statuses = {
    en: {
      excellent: { label: 'Excellent', color: 'green', message: 'Keep up the great work!' },
      good: { label: 'Good', color: 'blue', message: 'You are doing well!' },
      fair: { label: 'Fair', color: 'yellow', message: 'Keep going, you can do it!' },
      poor: { label: 'Needs Attention', color: 'red', message: 'Consider seeking support' },
    },
    hi: {
      excellent: { label: 'उत्कृष्ट', color: 'green', message: 'शानदार काम जारी रखें!' },
      good: { label: 'अच्छा', color: 'blue', message: 'आप अच्छा कर रहे हैं!' },
      fair: { label: 'ठीक', color: 'yellow', message: 'जारी रखें, आप कर सकते हैं!' },
      poor: { label: 'ध्यान देने की आवश्यकता', color: 'red', message: 'सहायता लेने पर विचार करें' },
    },
    ta: {
      excellent: { label: 'சிறப்பு', color: 'green', message: 'சிறந்த பணியைத் தொடரவும்!' },
      good: { label: 'நல்லது', color: 'blue', message: 'நீங்கள் நன்றாக செய்கிறீர்கள்!' },
      fair: { label: 'சராசரி', color: 'yellow', message: 'தொடரவும், உங்களால் முடியும்!' },
      poor: { label: 'கவனம் தேவை', color: 'red', message: 'ஆதரவு பெற பரிசீலிக்கவும்' },
    },
  };
  
  let status = 'poor';
  if (score >= 75) status = 'excellent';
  else if (score >= 50) status = 'good';
  else if (score >= 25) status = 'fair';
  
  return {
    score,
    ...statuses[lang]?.[status] || statuses['en'][status],
  };
};

/**
 * Validate translations coverage
 * @param {Array<string>} keys - Translation keys to check
 * @returns {object} Validation results
 */
export const validateTranslationCoverage = (keys) => {
  const missing = [];
  const lang = getLanguage();
  
  keys.forEach(key => {
    if (!i18n.exists(key, { lng: lang })) {
      missing.push(key);
    }
  });
  
  return {
    coverage: `${((keys.length - missing.length) / keys.length * 100).toFixed(1)}%`,
    total: keys.length,
    missing: missing,
    found: keys.length - missing.length
  };
};
