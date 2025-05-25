// controllers/HabitController.js
const HabitModel = require('../models/HabitModel');

exports.createHabit = async (req, res) => {
  try {
    const newHabit = await HabitModel.create(req.body);
    res.status(201).json(newHabit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listHabits = async (req, res) => {
  try {
    const habits = await HabitModel.findAll();
    res.status(200).json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editHabit = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await HabitModel.update(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Hábito não encontrado' });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteHabit = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await HabitModel.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Hábito não encontrado' });
    }
    res.status(200).json({ message: 'Hábito removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
