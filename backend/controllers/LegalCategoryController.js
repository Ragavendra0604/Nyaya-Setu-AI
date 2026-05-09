const LegalCategoryModel = require('../models/LegalCategory');

class LegalCategoryController {
  static async getAllCategories(req, res) {
    try {
      const categories = await LegalCategoryModel.getAllCategories();

      res.json({
        ok: true,
        categories,
      });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getCategoryById(req, res) {
    try {
      const { categoryId } = req.params;

      if (!categoryId) {
        return res.status(400).json({ error: 'Category ID is required' });
      }

      const category = await LegalCategoryModel.getCategoryById(categoryId);

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json({
        ok: true,
        category,
      });
    } catch (error) {
      console.error('Get category error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getCategoryByShort(req, res) {
    try {
      const { shortCode } = req.params;

      if (!shortCode) {
        return res.status(400).json({ error: 'Short code is required' });
      }

      const category = await LegalCategoryModel.getCategoryByShort(shortCode);

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json({
        ok: true,
        category,
      });
    } catch (error) {
      console.error('Get category by short error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async addCategory(req, res) {
    try {
      const { id, short, title, description, longDescription, badge, category, translations, prompts, steps } = req.body;

      if (!short || !title) {
        return res.status(400).json({ error: 'Short code and title are required' });
      }

      const legalCategory = await LegalCategoryModel.addCategory({
        id: id || short,
        short,
        title,
        description,
        longDescription,
        badge,
        category: category || 'general',
        translations,
        prompts: prompts || [],
        steps: steps || [],
      });

      res.status(201).json({
        ok: true,
        category: legalCategory,
      });
    } catch (error) {
      console.error('Add category error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = LegalCategoryController;
