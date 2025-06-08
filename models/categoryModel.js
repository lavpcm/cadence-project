const pool = require('../config/db');

const CategoryModel = {
  async create(category_type) {
    const query = 'INSERT INTO category (category_type) VALUES ($1) RETURNING *';
    const result = await pool.query(query, [category_type]);
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query('SELECT * FROM category');
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query('SELECT * FROM category WHERE id = $1', [id]);
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM category WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = CategoryModel;