const { db, admin } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

class ChatModel {
  static async createChat(userId, title = 'New Chat') {
    try {
      const chatData = {
        userId,
        title,
        messages: [],
        language: 'en',
        mode: 'simple',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await db.collection('chats').add(chatData);
      return { chatId: docRef.id, ...chatData };
    } catch (error) {
      throw new Error(`Failed to create chat: ${error.message}`);
    }
  }

  static async getChatsByUserId(userId) {
    try {
      try {
        const snapshot = await db.collection('chats')
          .where('userId', '==', userId)
          .orderBy('updatedAt', 'desc')
          .get();
        return snapshot.docs.map(doc => ({ chatId: doc.id, ...doc.data() }));
      } catch (indexError) {
        console.warn('Firestore index missing, falling back to in-memory sorting.');
        const snapshot = await db.collection('chats')
          .where('userId', '==', userId)
          .get();
        const chats = snapshot.docs.map(doc => ({ chatId: doc.id, ...doc.data() }));
        // Sort by updatedAt desc in memory
        return chats.sort((a, b) => {
          const dateA = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt);
          const dateB = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt);
          return dateB - dateA;
        });
      }
    } catch (error) {
      throw new Error(`Failed to get chats: ${error.message}`);
    }
  }

  static async getChatById(chatId) {
    try {
      const doc = await db.collection('chats').doc(chatId).get();
      if (!doc.exists) return null;
      return { chatId: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Failed to get chat: ${error.message}`);
    }
  }

  static async addMessage(chatId, message) {
    try {
      const messageData = {
        id: uuidv4(),
        role: message.role,
        content: message.content,
        query: message.query || null,
        timestamp: new Date(),
      };

      await db.collection('chats').doc(chatId).update({
        messages: admin.firestore.FieldValue.arrayUnion(messageData),
        updatedAt: new Date(),
      });

      return messageData;
    } catch (error) {
      throw new Error(`Failed to add message: ${error.message}`);
    }
  }

  static async updateChatTitle(chatId, title) {
    try {
      await db.collection('chats').doc(chatId).update({
        title,
        updatedAt: new Date(),
      });
      return await this.getChatById(chatId);
    } catch (error) {
      throw new Error(`Failed to update chat title: ${error.message}`);
    }
  }

  static async deleteChat(chatId) {
    try {
      await db.collection('chats').doc(chatId).delete();
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete chat: ${error.message}`);
    }
  }

  static async clearChatMessages(chatId) {
    try {
      await db.collection('chats').doc(chatId).update({
        messages: [],
        updatedAt: new Date(),
      });
      return await this.getChatById(chatId);
    } catch (error) {
      throw new Error(`Failed to clear messages: ${error.message}`);
    }
  }

  static async rateMessage(chatId, messageId, rating) {
    try {
      const chat = await this.getChatById(chatId);
      const messages = chat.messages.map(msg => {
        if (msg.id === messageId) {
          return { ...msg, rating };
        }
        return msg;
      });

      await db.collection('chats').doc(chatId).update({
        messages,
        updatedAt: new Date(),
      });

      return messages.find(m => m.id === messageId);
    } catch (error) {
      throw new Error(`Failed to rate message: ${error.message}`);
    }
  }
}

module.exports = ChatModel;
