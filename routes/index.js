const express = require('express');
const router = express.Router();
const HabitController = require('../controllers/HabitController');
const CategoryController = require('../controllers/CategoryController');

router.post('/habit', HabitController.createHabit);
router.get('/habit', HabitController.listHabits);
router.put('/habit/:id', HabitController.editHabit);
router.delete('/habit/:id', HabitController.deleteHabit);
router.post('/category', CategoryController.createCategory);
router.get('/category', CategoryController.listCategories);
router.get('/category/:id', CategoryController.getCategoryById);
router.delete('/category/:id', CategoryController.deleteCategory);

module.exports = router;