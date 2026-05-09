const { db } = require('../config/firebase');

class TranslationModel {
  static async getTranslationsByLanguage(language) {
    try {
      const snapshot = await db.collection('translations').where('enabled', '==', true).get();
      const translations = {};

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        translations[data.key] = data[language] || data.en || '';
      });

      return translations;
    } catch (error) {
      throw new Error(`Failed to get translations: ${error.message}`);
    }
  }

  static async getAllTranslations() {
    try {
      const snapshot = await db.collection('translations').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(`Failed to get all translations: ${error.message}`);
    }
  }

  static async addTranslation(translationData) {
    try {
      const data = {
        ...translationData,
        createdAt: new Date(),
        updatedAt: new Date(),
        enabled: true,
      };

      const docRef = await db.collection('translations').add(data);
      return { id: docRef.id, ...data };
    } catch (error) {
      throw new Error(`Failed to add translation: ${error.message}`);
    }
  }
}

module.exports = TranslationModel;
