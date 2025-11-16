import express from 'express';
import pool from '../db/connection.js';

const router = express.Router();

// Get translations by page and language
router.get('/:page/:language', async (req, res) => {
  try {
    const { page, language } = req.params;

    if (!['en', 'sv'].includes(language)) {
      return res.status(400).json({ error: 'Invalid language. Use "en" or "sv"' });
    }

    const result = await pool.query(
      'SELECT key, value FROM translations WHERE page = $1 AND language = $2',
      [page, language]
    );

    // Convert to object format for easier frontend use
    const translations = {};
    result.rows.forEach(row => {
      translations[row.key] = row.value;
    });

    res.json(translations);
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all translations (optional, for admin)
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT key, language, value, page FROM translations ORDER BY page, key, language'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

