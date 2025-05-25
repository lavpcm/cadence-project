// routes/index.js
const express = require('express');
const router = express.Router();
const HabitController = require('../controllers/HabitController');
const CategoryController = require('../controllers/CategoryController');

// declaração dos 
// Rotas para o CRUD de hábitos
router.post('/habit', HabitController.createHabit);
router.get('/habit', HabitController.listHabits);
router.put('/habit/:id', HabitController.editHabit);
router.delete('/habit/:id', HabitController.deleteHabit);

// Rota para criar categoria
router.post('/category', CategoryController.createCategory); 

module.exports = router;
