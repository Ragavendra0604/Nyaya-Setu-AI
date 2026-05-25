const { auth } = require('../config/firebase');
const UserModel = require('../models/User');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

class AuthController {
  static async signup(req, res) {
    try {
      const { email, password, displayName, phone } = req.body;

      if (!email || !password || !displayName) {
        return res.status(400).json({ error: 'Email, password, and display name are required' });
      }

      // Create Firebase auth user
      const userRecord = await auth.createUser({
        email,
        password,
        displayName,
        phoneNumber: phone || undefined,
      });

      // Create user document in Firestore
      const userData = await UserModel.createUser(userRecord.uid, {
        email,
        displayName,
        phone: phone || '',
        language: 'en',
        mode: 'simple',
        isVerified: false,
      });

      res.status(201).json({
        ok: true,
        user: {
          uid: userRecord.uid,
          email: userData.email,
          displayName: userData.displayName,
        },
        message: 'User registered successfully',
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async syncProfile(req, res) {
    try {
      const { uid, email, displayName, phone, language, mode } = req.body;

      if (!uid || !email) {
        return res.status(400).json({ error: 'UID and Email are required' });
      }

      // Check if user already exists
      const existingUser = await UserModel.getUserById(uid);
      if (existingUser) {
        return res.json({ ok: true, user: existingUser, message: 'User already exists' });
      }

      const userData = await UserModel.createUser(uid, {
        email,
        displayName: displayName || '',
        phone: phone || '',
        language: language || 'en',
        mode: mode || 'simple',
        isVerified: false,
      });

      res.status(201).json({
        ok: true,
        user: userData,
        message: 'User profile created successfully',
      });
    } catch (error) {
      console.error('Sync profile error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getUser(req, res) {
    try {
      const { uid } = req.params;

      if (!uid) {
        return res.status(400).json({ error: 'UID is required' });
      }

      const user = await UserModel.getUserById(uid);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        ok: true,
        user,
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const { uid } = req.params;
      const { language, mode, displayName, phone } = req.body;

      if (!uid) {
        return res.status(400).json({ error: 'UID is required' });
      }

      const updates = {};
      if (language) updates.language = language;
      if (mode) updates.mode = mode;
      if (displayName) updates.displayName = displayName;
      if (phone) updates.phone = phone;

      const user = await UserModel.updateUser(uid, updates);

      res.json({
        ok: true,
        user,
        message: 'User updated successfully',
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split('Bearer ')[1];

      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      const decodedToken = await auth.verifyIdToken(token);
      const user = await UserModel.getUserById(decodedToken.uid);

      res.json({
        ok: true,
        user,
        decoded: decodedToken,
      });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
  }
  static async uploadProfileImage(req, res) {
  try {
    const { uid } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'nyayasetu_profiles',
    });

    fs.unlinkSync(req.file.path);

    const updatedUser = await UserModel.updateUser(uid, {
      profileImage: result.secure_url,
    });

    res.json({
      ok: true,
      imageUrl: result.secure_url,
      user: updatedUser,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
}

module.exports = AuthController;
