const express = require('express');
const TranslationController = require('../controllers/TranslationController');

const router = express.Router();

// Translation Routes
router.get('/', TranslationController.getTranslations);
router.get('/all', TranslationController.getAllTranslations);
router.post('/', TranslationController.addTranslation);

module.exports = router;
