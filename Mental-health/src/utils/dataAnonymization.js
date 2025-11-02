/**
 * Data Anonymization & PII Removal Utilities
 * Compliant with India's DPDP Act 2023
 * 
 * This module removes Personally Identifiable Information (PII) from chat data
 * before storing for AI model training purposes.
 */

// Common Indian names patterns (sample - expand this list)
const COMMON_INDIAN_NAMES = [
  'rohan', 'priya', 'amit', 'rahul', 'anjali', 'neha', 'vikram', 'sneha',
  'arjun', 'kavya', 'rajesh', 'pooja', 'sanjay', 'deepika', 'arun', 'meera',
  'karan', 'riya', 'vishal', 'divya', 'mohit', 'ananya', 'nikhil', 'ishita'
];

// Indian cities patterns
const INDIAN_CITIES = [
  'delhi', 'mumbai', 'bangalore', 'bengaluru', 'chennai', 'kolkata', 
  'hyderabad', 'pune', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur',
  'nagpur', 'indore', 'bhopal', 'patna', 'vadodara', 'ghaziabad',
  'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut', 'rajkot'
];

/**
 * Removes email addresses from text
 * @param {string} text - Input text
 * @returns {string} - Text with emails replaced
 */
export const removeEmails = (text) => {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  return text.replace(emailRegex, '<EMAIL>');
};

/**
 * Removes phone numbers (Indian formats)
 * Handles: +91-9876543210, 9876543210, +919876543210, etc.
 * @param {string} text - Input text
 * @returns {string} - Text with phone numbers replaced
 */
export const removePhoneNumbers = (text) => {
  const phoneRegex = /(\+91[\-\s]?)?[6-9]\d{9}\b/g;
  return text.replace(phoneRegex, '<PHONE>');
};

/**
 * Removes common Indian names
 * @param {string} text - Input text
 * @returns {string} - Text with names replaced
 */
export const removeNames = (text) => {
  let cleanedText = text;
  
  // Case-insensitive replacement of common names
  COMMON_INDIAN_NAMES.forEach(name => {
    const nameRegex = new RegExp(`\\b${name}\\b`, 'gi');
    cleanedText = cleanedText.replace(nameRegex, '<USER>');
  });
  
  // Pattern: "I'm [Name]" or "My name is [Name]"
  const namePatterns = [
    /\b(?:i'?m|my name is|naam hai|mera naam)\s+([A-Z][a-z]+)\b/gi,
    /\b(?:this is|here is)\s+([A-Z][a-z]+)\b/gi
  ];
  
  namePatterns.forEach(pattern => {
    cleanedText = cleanedText.replace(pattern, (match) => 
      match.replace(/[A-Z][a-z]+/g, '<USER>')
    );
  });
  
  return cleanedText;
};

/**
 * Removes city names
 * @param {string} text - Input text
 * @returns {string} - Text with cities replaced
 */
export const removeCities = (text) => {
  let cleanedText = text;
  
  INDIAN_CITIES.forEach(city => {
    const cityRegex = new RegExp(`\\b${city}\\b`, 'gi');
    cleanedText = cleanedText.replace(cityRegex, '<CITY>');
  });
  
  return cleanedText;
};

/**
 * Removes addresses and location markers
 * @param {string} text - Input text
 * @returns {string} - Text with addresses replaced
 */
export const removeAddresses = (text) => {
  // Pattern: Pin code (6 digits)
  const pinCodeRegex = /\b\d{6}\b/g;
  let cleanedText = text.replace(pinCodeRegex, '<PINCODE>');
  
  // Pattern: Common address keywords
  const addressPatterns = [
    /\b(?:house no|flat no|apartment|building)\s+[\w\s,-]+/gi,
    /\b(?:near|opposite|behind)\s+[\w\s,-]+(?:road|street|lane|nagar)/gi
  ];
  
  addressPatterns.forEach(pattern => {
    cleanedText = cleanedText.replace(pattern, '<ADDRESS>');
  });
  
  return cleanedText;
};

/**
 * Removes age information
 * @param {string} text - Input text
 * @returns {string} - Text with age replaced
 */
export const removeAge = (text) => {
  // Pattern: "I am X years old", "X year old", "age is X"
  const agePatterns = [
    /\b(?:i'?m|i am|age is|years?)\s*\d{1,2}\s*(?:years?|yrs?)?\s*(?:old)?\b/gi,
    /\b\d{1,2}\s*(?:years?|yrs?)\s*old\b/gi
  ];
  
  let cleanedText = text;
  agePatterns.forEach(pattern => {
    cleanedText = cleanedText.replace(pattern, (match) => 
      match.replace(/\d{1,2}/, '<AGE>')
    );
  });
  
  return cleanedText;
};

/**
 * Removes dates (birthdays, appointments, etc.)
 * @param {string} text - Input text
 * @returns {string} - Text with dates replaced
 */
export const removeDates = (text) => {
  const datePatterns = [
    /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g,  // DD/MM/YYYY or MM/DD/YYYY
    /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b/gi
  ];
  
  let cleanedText = text;
  datePatterns.forEach(pattern => {
    cleanedText = cleanedText.replace(pattern, '<DATE>');
  });
  
  return cleanedText;
};

/**
 * Removes URLs and website links
 * @param {string} text - Input text
 * @returns {string} - Text with URLs replaced
 */
export const removeURLs = (text) => {
  const urlRegex = /https?:\/\/[^\s]+|www\.[^\s]+/gi;
  return text.replace(urlRegex, '<URL>');
};

/**
 * Master anonymization function - applies all PII removal techniques
 * @param {string} text - Raw input text
 * @returns {string} - Fully anonymized text
 */
export const anonymizeText = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  let cleanedText = text;
  
  // Apply all anonymization steps in sequence
  cleanedText = removeEmails(cleanedText);
  cleanedText = removePhoneNumbers(cleanedText);
  cleanedText = removeNames(cleanedText);
  cleanedText = removeCities(cleanedText);
  cleanedText = removeAddresses(cleanedText);
  cleanedText = removeAge(cleanedText);
  cleanedText = removeDates(cleanedText);
  cleanedText = removeURLs(cleanedText);
  
  return cleanedText;
};

/**
 * Structure chat data for training dataset
 * @param {string} userPrompt - User's message
 * @param {string} aiResponse - AI's response
 * @param {string} language - Language code (en, hi, ta, etc.)
 * @param {string} persona - AI persona used (ira, alex, maya)
 * @returns {Object} - Structured training data
 */
export const structureTrainingData = (userPrompt, aiResponse, language = 'en', persona = 'ira') => {
  return {
    prompt: anonymizeText(userPrompt),
    response: anonymizeText(aiResponse),
    language: language,
    persona: persona,
    timestamp: new Date().toISOString(),
    category: detectCategory(userPrompt), // Auto-detect mental health category
  };
};

/**
 * Detect mental health category from user message
 * @param {string} text - User's message
 * @returns {string} - Category (anxiety, depression, stress, etc.)
 */
const detectCategory = (text) => {
  const lowerText = text.toLowerCase();
  
  // Anxiety keywords (English + Hindi)
  if (/(anxious|anxiety|worried|nervous|panic|ghabrahat|tension|dar)/i.test(lowerText)) {
    return 'anxiety';
  }
  
  // Depression keywords
  if (/(depressed|depression|sad|lonely|hopeless|udaas|nirash)/i.test(lowerText)) {
    return 'depression';
  }
  
  // Stress keywords
  if (/(stress|pressure|overwhelmed|burden|tanav|dabav)/i.test(lowerText)) {
    return 'stress';
  }
  
  // Sleep issues
  if (/(sleep|insomnia|tired|fatigue|neend|thakaan)/i.test(lowerText)) {
    return 'sleep_issues';
  }
  
  // Relationship issues
  if (/(relationship|family|friend|partner|rishte|parivaar)/i.test(lowerText)) {
    return 'relationships';
  }
  
  // Work/Academic stress
  if (/(exam|work|job|study|career|padhai|naukri)/i.test(lowerText)) {
    return 'academic_work';
  }
  
  return 'general'; // Default category
};

/**
 * Validate if text contains any remaining PII (quality check)
 * @param {string} text - Text to validate
 * @returns {boolean} - True if text appears clean
 */
export const validateAnonymization = (text) => {
  // Check for common PII patterns that might have been missed
  const piiPatterns = [
    /@/,  // Email remnants
    /\d{10,}/,  // Long number sequences
    /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/,  // Full names (capitalized)
  ];
  
  for (const pattern of piiPatterns) {
    if (pattern.test(text)) {
      return false;  // Found potential PII
    }
  }
  
  return true;  // Appears clean
};

/**
 * Example usage and testing
 */
export const testAnonymization = () => {
  const testCases = [
    "Hi, I'm Rohan from Delhi and my email is rohan@example.com",
    "Mujhe exam stress ho raha hai, call me at 9876543210",
    "My name is Priya, I'm 25 years old living in Mumbai",
    "I live at House No 123, MG Road, Bangalore 560001"
  ];
  
  console.log("=== Anonymization Test Results ===");
  testCases.forEach((text, idx) => {
    console.log(`\nTest ${idx + 1}:`);
    console.log("Original:", text);
    console.log("Anonymized:", anonymizeText(text));
    console.log("Valid:", validateAnonymization(anonymizeText(text)));
  });
};
