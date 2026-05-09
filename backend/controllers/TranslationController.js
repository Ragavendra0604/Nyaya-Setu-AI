const TranslationModel = require('../models/Translation');

class TranslationController {
  static async getTranslations(req, res) {
    try {
      const { language = 'en' } = req.query;

      const translations = await TranslationModel.getTranslationsByLanguage(language);

      res.json({
        ok: true,
        language,
        translations,
      });
    } catch (error) {
      console.error('Get translations error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllTranslations(req, res) {
    try {
      const translations = await TranslationModel.getAllTranslations();

      res.json({
        ok: true,
        translations,
      });
    } catch (error) {
      console.error('Get all translations error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async addTranslation(req, res) {
    try {
      const { key, en, hi, ta, category } = req.body;

      if (!key || !en) {
        return res.status(400).json({ error: 'Key and English translation are required' });
      }

      const translation = await TranslationModel.addTranslation({
        key,
        en,
        hi: hi || '',
        ta: ta || '',
        category: category || 'general',
      });

      res.status(201).json({
        ok: true,
        translation,
      });
    } catch (error) {
      console.error('Add translation error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = TranslationController;
