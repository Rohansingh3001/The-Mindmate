/**
 * Training Data Storage & Management
 * Handles storing anonymized chat data for AI model training
 * DPDP Act 2023 Compliant
 */

import { structureTrainingData, validateAnonymization } from './dataAnonymization';

/**
 * Store training data to backend (when user has consented)
 * @param {string} userPrompt - User's message
 * @param {string} aiResponse - AI's response
 * @param {string} userId - User ID (for consent tracking only, not stored with data)
 * @param {string} language - Language code
 * @param {string} persona - AI persona
 * @returns {Promise<boolean>} - Success status
 */
export const storeTrainingData = async (userPrompt, aiResponse, userId, language = 'en', persona = 'ira') => {
  try {
    // Check if user has consented
    const consentKey = `chat_training_consent_${userId}`;
    const consent = localStorage.getItem(consentKey);
    
    if (consent !== 'true') {
      console.log('[Training Data] User has not consented - skipping storage');
      return false;
    }
    
    // Structure and anonymize data
    const trainingData = structureTrainingData(userPrompt, aiResponse, language, persona);
    
    // Validate anonymization quality
    const promptValid = validateAnonymization(trainingData.prompt);
    const responseValid = validateAnonymization(trainingData.response);
    
    if (!promptValid || !responseValid) {
      console.warn('[Training Data] Potential PII detected - skipping storage for safety');
      return false;
    }
    
    // Store locally in IndexedDB (for now) - later send to backend
    await storeInIndexedDB(trainingData);
    
    // Send to backend API (dual storage for reliability)
    await sendToBackend(trainingData);
    
    console.log('[Training Data] Successfully stored anonymized conversation');
    return true;
    
  } catch (error) {
    console.error('[Training Data] Error storing data:', error);
    return false;
  }
};

/**
 * Store training data in browser's IndexedDB
 * @param {Object} data - Structured training data
 */
const storeInIndexedDB = (data) => {
  return new Promise((resolve, reject) => {
    const dbName = 'MindMatesTrainingData';
    const storeName = 'conversations';
    
    const request = indexedDB.open(dbName, 1);
    
    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const addRequest = store.add(data);
      
      addRequest.onsuccess = () => resolve();
      addRequest.onerror = () => reject(addRequest.error);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains(storeName)) {
        const objectStore = db.createObjectStore(storeName, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        
        // Create indexes for querying
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        objectStore.createIndex('language', 'language', { unique: false });
        objectStore.createIndex('category', 'category', { unique: false });
        objectStore.createIndex('persona', 'persona', { unique: false });
      }
    };
  });
};

/**
 * Send training data to backend API (implement when backend is ready)
 * @param {Object} data - Structured training data
 */
const sendToBackend = async (data) => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const response = await fetch(`${backendUrl}/api/training-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send training data to backend');
    }
    
    return await response.json();
  } catch (error) {
    console.error('[Training Data] Backend error:', error);
    // Don't throw - we still have IndexedDB as backup
    return null;
  }
};

/**
 * Export all training data (for admin/developer use)
 * @returns {Promise<Array>} - All stored training data
 */
export const exportTrainingData = async () => {
  return new Promise((resolve, reject) => {
    const dbName = 'MindMatesTrainingData';
    const storeName = 'conversations';
    
    const request = indexedDB.open(dbName, 1);
    
    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
  });
};

/**
 * Get statistics about stored training data
 * @returns {Promise<Object>} - Statistics
 */
export const getTrainingDataStats = async () => {
  try {
    const allData = await exportTrainingData();
    
    const stats = {
      total: allData.length,
      byLanguage: {},
      byCategory: {},
      byPersona: {},
      dateRange: {
        oldest: null,
        newest: null
      }
    };
    
    allData.forEach(item => {
      // Count by language
      stats.byLanguage[item.language] = (stats.byLanguage[item.language] || 0) + 1;
      
      // Count by category
      stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1;
      
      // Count by persona
      stats.byPersona[item.persona] = (stats.byPersona[item.persona] || 0) + 1;
      
      // Track date range
      const timestamp = new Date(item.timestamp);
      if (!stats.dateRange.oldest || timestamp < stats.dateRange.oldest) {
        stats.dateRange.oldest = timestamp;
      }
      if (!stats.dateRange.newest || timestamp > stats.dateRange.newest) {
        stats.dateRange.newest = timestamp;
      }
    });
    
    return stats;
  } catch (error) {
    console.error('[Training Data] Error getting stats:', error);
    return null;
  }
};

/**
 * Clear all training data (for testing or user request)
 * @returns {Promise<boolean>} - Success status
 */
export const clearTrainingData = async () => {
  return new Promise((resolve, reject) => {
    const dbName = 'MindMatesTrainingData';
    
    const request = indexedDB.deleteDatabase(dbName);
    
    request.onsuccess = () => {
      console.log('[Training Data] All data cleared');
      resolve(true);
    };
    
    request.onerror = () => {
      console.error('[Training Data] Error clearing data');
      reject(request.error);
    };
  });
};

/**
 * Export training data as JSON file (for fine-tuning)
 * Format compatible with LLaMA, Mistral, GPT fine-tuning
 * @param {string} format - 'jsonl' or 'json'
 */
export const downloadTrainingDataset = async (format = 'jsonl') => {
  try {
    const allData = await exportTrainingData();
    
    let content;
    let filename;
    let mimeType;
    
    if (format === 'jsonl') {
      // JSONL format (one JSON object per line)
      content = allData.map(item => JSON.stringify({
        prompt: item.prompt,
        response: item.response,
        metadata: {
          language: item.language,
          category: item.category,
          persona: item.persona
        }
      })).join('\n');
      filename = `mindmates_training_data_${Date.now()}.jsonl`;
      mimeType = 'application/jsonl';
    } else {
      // Standard JSON format
      content = JSON.stringify(allData, null, 2);
      filename = `mindmates_training_data_${Date.now()}.json`;
      mimeType = 'application/json';
    }
    
    // Create download link
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`[Training Data] Downloaded ${allData.length} conversations as ${format}`);
    return true;
  } catch (error) {
    console.error('[Training Data] Error downloading dataset:', error);
    return false;
  }
};
