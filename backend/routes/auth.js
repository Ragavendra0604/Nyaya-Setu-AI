const express = require('express');
const AuthController = require('../controllers/AuthController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Auth Routes
router.post('/signup', AuthController.signup);
router.post('/verify-token', AuthController.verifyToken);
router.post('/sync-profile', AuthController.syncProfile);
router.get('/user/:uid', AuthController.getUser);
router.put('/user/:uid', AuthController.updateUser);
router.post('/upload-profile/:uid', upload.single('image'), AuthController.uploadProfileImage);


module.exports = router;
