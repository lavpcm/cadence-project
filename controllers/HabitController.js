// controllers/HabitController.js
const pool = require('../config/db');

// Criar um novo hábito
exports.createHabit = async (req, res) => {
  const { category_id, title, more_info, frequency, active } = req.body;

  const query = 'INSERT INTO habit (category_id, title, more_info, frequency, active) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const values = [category_id, title, more_info, frequency, active];

  try {
    const result = await pool.query(query, values);
    //const title = result.rows[0];
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar todos os hábitos
exports.listHabits = async (req, res) => {
  const query = 'SELECT * FROM habit';

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Editar uma habito
exports.editHabit = async (req, res) => {
  const { id } = req.params;
  const { title, more_info, frequency, active } = req.body;

  const query = `
    UPDATE habit SET title = $1, more_info = $2, frequency = $3, active = $4 
    WHERE id = $5 RETURNING *`;
  const values = [title, more_info, frequency, active, id];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hábito não encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deletar um hábito
exports.deleteHabit = async (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM habit WHERE id = $1 RETURNING *';
  const values = [id];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    res.status(200).json({ message: 'Habit successfully deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};