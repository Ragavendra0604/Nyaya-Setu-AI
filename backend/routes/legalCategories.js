const express = require('express');
const LegalCategoryController = require('../controllers/LegalCategoryController');

const router = express.Router();

// Legal Category Routes
router.get('/', LegalCategoryController.getAllCategories);
router.get('/:categoryId', LegalCategoryController.getCategoryById);
router.get('/short/:shortCode', LegalCategoryController.getCategoryByShort);
router.post('/', LegalCategoryController.addCategory);

module.exports = router;
