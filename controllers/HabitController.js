const HabitModel = require('../models/habitModel');
const CategoryModel = require('../models/categoryModel');
const HabitTrackerModel = require('../models/habitTrackerModel');

exports.createHabit = async (req, res) => {
  try {
    const { title, category_id, frequency, more_info, active = true } = req.body;
    if (!title || !category_id) {
      return res.status(400).json({ error: 'Title and category are required' });
    }
    const newHabit = await HabitModel.create({ title, category_id, frequency, more_info, active });
    res.status(201).json(newHabit);
  } catch (err) {
    console.error('Error creating habit:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.listHabits = async (req, res) => {
  try {
    const currentDay = new Date().toISOString().split('T')[0];
    console.log('Fetching habits for current day:', currentDay);
    const habitsResult = await HabitModel.findAll();
    console.log('Habits fetched:', habitsResult.length);
    
    const habits = await Promise.all(habitsResult.map(async habit => {
      try {
        const category = await CategoryModel.findById(habit.category_id);
        const tracker = await HabitTrackerModel.findByHabitIdAndDate(habit.id, currentDay);
        return {
          id: habit.id,
          title: habit.title,
          category: category ? { id: category.id, category_type: category.category_type } : null,
          frequency: habit.frequency,
          more_info: habit.more_info,
          active: habit.active,
          tracker: tracker ? { done: tracker.done } : null
        };
      } catch (err) {
        console.error(`Error processing habit ${habit.id}:`, err);
        return null; // Skip invalid habits
      }
    }));
    
    const filteredHabits = habits.filter(habit => habit !== null);
    console.log('Returning habits:', filteredHabits.length);
    res.status(200).json(filteredHabits);
  } catch (err) {
    console.error('Error listing habits:', { message: err.message, stack: err.stack });
    res.status(500).json({ error: err.message || 'Failed to list habits' });
  }
};

exports.editHabit = async (req, res) => {
  const { id } = req.params;
  const { current_day, done, title, category_id, frequency, more_info, active } = req.body;
  try {
    if (current_day && done !== undefined) {
      let tracker = await HabitTrackerModel.findByHabitIdAndDate(id, current_day);
      if (tracker) {
        tracker = await HabitTrackerModel.update(id, current_day, done);
      } else {
        tracker = await HabitTrackerModel.create({ habit_id: id, current_day, done });
      }
      return res.status(200).json(tracker);
    }
    if (title || category_id || frequency || more_info !== undefined || active !== undefined) {
      const updated = await HabitModel.update(id, { title, category_id, frequency, more_info, active });
      if (!updated) {
        return res.status(404).json({ message: 'Hábito não encontrado' });
      }
      return res.status(200).json(updated);
    }
    return res.status(400).json({ error: 'No valid fields provided for update' });
  } catch (err) {
    console.error('Error updating habit:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteHabit = async (req, res) => {
  const { id } = req.params;
  try {
    // Delete related habit_tracker records first
    await HabitTrackerModel.deleteByHabitId(id);
    // Then delete the habit
    const deleted = await HabitModel.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Hábito não encontrado' });
    }
    res.status(200).json({ message: 'Hábito removido com sucesso' });
  } catch (err) {
    console.error('Error deleting habit:', err);
    res.status(500).json({ error: err.message });
  }
};