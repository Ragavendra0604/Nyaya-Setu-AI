const express = require('express');
const ChatController = require('../controllers/ChatController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Chat Routes
router.post('/', ChatController.createChat);
router.get('/user/:userId', ChatController.getUserChats);
router.get('/:chatId', ChatController.getChat);
router.post('/:chatId/message', upload.single('file'), ChatController.sendMessage);
router.put('/:chatId/title', ChatController.updateChatTitle);
router.delete('/:chatId', ChatController.deleteChat);
router.post('/:chatId/clear', ChatController.clearChat);
router.post('/:chatId/message/:messageId/rate', ChatController.rateMessage);
router.post('/evaluate', ChatController.evaluate);
router.post('/tts', ChatController.textToSpeech);

module.exports = router;
