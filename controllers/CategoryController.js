const CategoryModel = require('../models/categoryModel');

exports.createCategory = async (req, res) => {
  const { category_type } = req.body;
  try {
    if (!category_type) {
      return res.status(400).json({ error: 'Category type is required' });
    }
    const newCategory = await CategoryModel.create(category_type);
    res.status(201).json(newCategory);
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.listCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.findAll();
    res.status(200).json(categories);
  } catch (err) {
    console.error('Error listing categories:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    res.status(200).json(category);
  } catch (err) {
    console.error('Error getting category:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await CategoryModel.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    res.status(200).json({ message: 'Categoria removida com sucesso' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ error: err.message });
  }
};