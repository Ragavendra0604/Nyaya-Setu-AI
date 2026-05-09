const { db } = require('../config/firebase');

class UserModel {
  static async createUser(uid, userData) {
    try {
      const user = {
        uid,
        email: userData.email,
        displayName: userData.displayName || '',
        phone: userData.phone || '',
        language: userData.language || 'en',
        mode: userData.mode || 'simple',
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: userData.isVerified || false,
        role: userData.role || 'citizen',
      };
      
      await db.collection('users').doc(uid).set(user);
      return user;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  static async getUserById(uid) {
    try {
      const doc = await db.collection('users').doc(uid).get();
      if (!doc.exists) return null;
      return doc.data();
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  static async updateUser(uid, updates) {
    try {
      updates.updatedAt = new Date();
      await db.collection('users').doc(uid).update(updates);
      return await this.getUserById(uid);
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  static async getUserByEmail(email) {
    try {
      const snapshot = await db.collection('users').where('email', '==', email).get();
      if (snapshot.empty) return null;
      return snapshot.docs[0].data();
    } catch (error) {
      throw new Error(`Failed to get user by email: ${error.message}`);
    }
  }
}

module.exports = UserModel;
