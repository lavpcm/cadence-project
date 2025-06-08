const pool = require('../config/db');

const HabitTrackerModel = {
  async create({ habit_id, current_day, done }) {
    const query = `
      INSERT INTO habit_tracker (habit_id, current_day, done)
      VALUES ($1, $2, $3)
      RETURNING *`;
    const values = [habit_id, current_day, done];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findByHabitIdAndDate(habit_id, current_day) {
    const query = `
      SELECT * FROM habit_tracker
      WHERE habit_id = $1 AND current_day = $2`;
    const result = await pool.query(query, [habit_id, current_day]);
    return result.rows[0];
  },

  async update(habit_id, current_day, done) {
    const query = `
      UPDATE habit_tracker
      SET done = $1
      WHERE habit_id = $2 AND current_day = $3
      RETURNING *`;
    const values = [done, habit_id, current_day];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
};

module.exports = HabitTrackerModel;