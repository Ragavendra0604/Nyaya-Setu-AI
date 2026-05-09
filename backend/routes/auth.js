const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

// Auth Routes
router.post('/signup', AuthController.signup);
router.post('/verify-token', AuthController.verifyToken);
router.post('/sync-profile', AuthController.syncProfile);
router.get('/user/:uid', AuthController.getUser);
router.put('/user/:uid', AuthController.updateUser);

module.exports = router;
