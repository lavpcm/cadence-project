// controllers/CategoryController.js
const pool = require('../config/db');

exports.createCategory = async (req, res) => {
  const { category_type } = req.body;

  const query = 'INSERT INTO category (category_type) VALUES ($1) RETURNING *';
  const values = [category_type];

  try {
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
