const { db } = require('../config/firebase');

class LegalCategoryModel {
  static async getAllCategories() {
    try {
      const snapshot = await db.collection('legalCategories').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(`Failed to get categories: ${error.message}`);
    }
  }

  static async getCategoryById(categoryId) {
    try {
      const doc = await db.collection('legalCategories').doc(categoryId).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Failed to get category: ${error.message}`);
    }
  }

  static async getCategoryByShort(shortCode) {
    try {
      const snapshot = await db.collection('legalCategories')
        .where('short', '==', shortCode)
        .get();
      
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Failed to get category by short code: ${error.message}`);
    }
  }

  static async addCategory(categoryData) {
    try {
      const data = {
        ...categoryData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await db.collection('legalCategories').add(data);
      return { id: docRef.id, ...data };
    } catch (error) {
      throw new Error(`Failed to add category: ${error.message}`);
    }
  }
}

module.exports = LegalCategoryModel;
