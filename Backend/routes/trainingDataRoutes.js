/**
 * Training Data API Routes
 * Handles storage and retrieval of anonymized chat data for AI training
 * DPDP Act 2023 Compliant
 */

import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Directory to store training data
const TRAINING_DATA_DIR = path.join(__dirname, '../training_data');

// Ensure training data directory exists
const ensureDirectory = async () => {
  try {
    await fs.access(TRAINING_DATA_DIR);
  } catch {
    await fs.mkdir(TRAINING_DATA_DIR, { recursive: true });
  }
};

/**
 * POST /api/training-data
 * Store anonymized training data
 */
router.post('/', async (req, res) => {
  try {
    const { prompt, response, language, persona, category, timestamp } = req.body;
    
    // Validation
    if (!prompt || !response) {
      return res.status(400).json({ 
        success: false, 
        error: 'Prompt and response are required' 
      });
    }
    
    // Ensure directory exists
    await ensureDirectory();
    
    // Create training data object
    const trainingData = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      prompt,
      response,
      language: language || 'en',
      persona: persona || 'ira',
      category: category || 'general',
      timestamp: timestamp || new Date().toISOString(),
      stored_at: new Date().toISOString()
    };
    
    // Store in JSONL format (one JSON object per line)
    const filename = `training_data_${new Date().toISOString().split('T')[0]}.jsonl`;
    const filepath = path.join(TRAINING_DATA_DIR, filename);
    
    const jsonLine = JSON.stringify(trainingData) + '\n';
    await fs.appendFile(filepath, jsonLine, 'utf8');
    
    console.log(`[Training Data] Stored conversation: ${trainingData.id}`);
    
    res.json({ 
      success: true, 
      message: 'Training data stored successfully',
      id: trainingData.id
    });
    
  } catch (error) {
    console.error('[Training Data] Error storing data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to store training data' 
    });
  }
});

/**
 * GET /api/training-data/stats
 * Get statistics about stored training data
 */
router.get('/stats', async (req, res) => {
  try {
    await ensureDirectory();
    
    const files = await fs.readdir(TRAINING_DATA_DIR);
    const jsonlFiles = files.filter(f => f.endsWith('.jsonl'));
    
    let totalConversations = 0;
    const byLanguage = {};
    const byCategory = {};
    const byPersona = {};
    
    for (const file of jsonlFiles) {
      const filepath = path.join(TRAINING_DATA_DIR, file);
      const content = await fs.readFile(filepath, 'utf8');
      const lines = content.trim().split('\n').filter(l => l);
      
      totalConversations += lines.length;
      
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          byLanguage[data.language] = (byLanguage[data.language] || 0) + 1;
          byCategory[data.category] = (byCategory[data.category] || 0) + 1;
          byPersona[data.persona] = (byPersona[data.persona] || 0) + 1;
        } catch (e) {
          // Skip invalid lines
        }
      }
    }
    
    res.json({
      success: true,
      stats: {
        total: totalConversations,
        files: jsonlFiles.length,
        byLanguage,
        byCategory,
        byPersona
      }
    });
    
  } catch (error) {
    console.error('[Training Data] Error getting stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get training data stats' 
    });
  }
});

/**
 * GET /api/training-data/export
 * Export all training data as JSONL
 */
router.get('/export', async (req, res) => {
  try {
    await ensureDirectory();
    
    const files = await fs.readdir(TRAINING_DATA_DIR);
    const jsonlFiles = files.filter(f => f.endsWith('.jsonl'));
    
    let allData = '';
    
    for (const file of jsonlFiles) {
      const filepath = path.join(TRAINING_DATA_DIR, file);
      const content = await fs.readFile(filepath, 'utf8');
      allData += content;
    }
    
    res.setHeader('Content-Type', 'application/jsonl');
    res.setHeader('Content-Disposition', `attachment; filename=mindmates_training_${Date.now()}.jsonl`);
    res.send(allData);
    
  } catch (error) {
    console.error('[Training Data] Error exporting data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to export training data' 
    });
  }
});

/**
 * DELETE /api/training-data/clear
 * Clear all training data (admin only - add authentication)
 */
router.delete('/clear', async (req, res) => {
  try {
    // TODO: Add admin authentication middleware
    
    await ensureDirectory();
    
    const files = await fs.readdir(TRAINING_DATA_DIR);
    const jsonlFiles = files.filter(f => f.endsWith('.jsonl'));
    
    for (const file of jsonlFiles) {
      const filepath = path.join(TRAINING_DATA_DIR, file);
      await fs.unlink(filepath);
    }
    
    console.log('[Training Data] All data cleared');
    
    res.json({ 
      success: true, 
      message: `Cleared ${jsonlFiles.length} training data files` 
    });
    
  } catch (error) {
    console.error('[Training Data] Error clearing data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to clear training data' 
    });
  }
});

export default router;
