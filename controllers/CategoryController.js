// importa o modelo de categoria e a biblioteca de manipulação de datas
const CategoryModel = require('../models/CategoryModel');

exports.createCategory = async (req, res) => {
  const { category_type } = req.body;
  try {
    const newCategory = await CategoryModel.create(category_type);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.findAll();
    res.status(200).json(categories);
  } catch (err) {
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
    res.status(500).json({ error: err.message });
  }
};
