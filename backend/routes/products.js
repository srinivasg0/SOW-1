import express from 'express';
import pool from '../db/connection.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();


router.use(authenticateToken);


router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { article_no, name, description, in_price, price, unit, in_stock, vat_rate, account } = req.body;

    const result = await pool.query(
      `UPDATE products 
       SET article_no = $1, name = $2, description = $3, in_price = $4, price = $5, 
           unit = $6, in_stock = $7, vat_rate = $8, account = $9, updated_at = NOW()
       WHERE id = $10
       RETURNING *`,
      [article_no, name, description, in_price, price, unit, in_stock, vat_rate, account, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

