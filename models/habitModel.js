const pool = require('../config/db');

const HabitModel = {
  async create({ category_id, title, more_info, frequency, active }) {
    const query = `
      INSERT INTO habit (category_id, title, more_info, frequency, active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
    const values = [category_id, title, more_info, frequency, active];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query('SELECT * FROM habit');
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query('SELECT * FROM habit WHERE id = $1', [id]);
    return result.rows[0];
  },

  async update(id, { title, more_info, frequency, active }) {
    const query = `
      UPDATE habit
      SET title = $1, more_info = $2, frequency = $3, active = $4
      WHERE id = $5
      RETURNING *`;
    const values = [title, more_info, frequency, active, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM habit WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = HabitModel;