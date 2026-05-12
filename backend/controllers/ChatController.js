const ChatModel = require('../models/Chat');
const axios = require('axios');
const FileProcessor = require('../utils/fileProcessor');
const fs = require('fs');

class ChatController {
  static async createChat(req, res) {
    try {
      const { userId, title, language } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const chat = await ChatModel.createChat(userId, title || 'New Chat', language || 'en');

      res.status(201).json({
        ok: true,
        chat,
      });
    } catch (error) {
      console.error('Create chat error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getUserChats(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const chats = await ChatModel.getChatsByUserId(userId);

      res.json({
        ok: true,
        chats,
      });
    } catch (error) {
      console.error('Get chats error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getChat(req, res) {
    try {
      const { chatId } = req.params;

      if (!chatId) {
        return res.status(400).json({ error: 'Chat ID is required' });
      }

      const chat = await ChatModel.getChatById(chatId);

      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }

      res.json({
        ok: true,
        chat,
      });
    } catch (error) {
      console.error('Get chat error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getMockResponse(query, language, mode) {
    // Mock responses for demo/testing
    const responses = {
      en: {
        simple: 'This is a demo response. To file an FIR, visit your nearest police station with: 1. Identity proof 2. Address proof 3. Written complaint 4. Evidence if available',
        detailed: '### 📝 Overview\nYou can file an FIR for any criminal offense. The process is straightforward and available at any police station.\n\n### ⚖️ Relevant Law\n**Section 154 CrPC** — Any police officer can register an FIR without permission. You can file an FIR at any police station, even if the offense occurred elsewhere.\n\n### 🛠️ Steps to Follow\n1. Visit your nearest police station\n2. Request a copy of the FIR format\n3. Fill in details of the incident\n4. Submit with supporting documents',
      },
      hi: {
        simple: 'यह एक डेमो प्रतिक्रिया है। एफआईआर दर्ज करने के लिए अपने निकटतम पुलिस स्टेशन जाएं।',
        detailed: '### 📝 अवलोकन\nआप किसी भी आपराधिक अपराध के लिए एफआईआर दर्ज कर सकते हैं।',
      },
      ta: {
        simple: 'இது ஒரு டெமோ பதிலாகும். FIR பதிவு செய்ய உங்கள் நெருக்கமான போலீஸ் நிலையத்திற்குச் செல்லுங்கள்।',
        detailed: 'டெமோ விवरण பதிலாகும்',
      },
    };

    return responses[language]?.[mode] || responses['en']['simple'];
  }

  static async sendMessage(req, res) {
    console.log('sendMessage called with params:', req.params, 'body:', req.body);
    try {
      const { chatId } = req.params;
      const { query, language, mode, isDemo } = req.body;

      if (!chatId) {
        return res.status(400).json({ error: 'Chat ID is required' });
      }

      let enrichedQuery = query || "";
      let imageData = null;
      let pdfData = null;
      let audioData = null;
      let effectiveLanguage = language;

      // Fetch language from DB if not provided and it's not a demo
      if (!effectiveLanguage && chatId !== "demo-chat") {
        try {
          const chat = await ChatModel.getChatById(chatId);
          if (chat && chat.language) {
            effectiveLanguage = chat.language;
            console.log(`Fetched language '${effectiveLanguage}' from database for chat ${chatId}`);
          }
        } catch (dbErr) {
          console.warn('Could not fetch chat language from DB, defaulting to request or English');
        }
      }

      if (req.file) {
        try {
          console.log('Processing attached file:', req.file.originalname);
          const mimeType = req.file.mimetype;

          if (mimeType.startsWith('image/')) {
            imageData = fs.readFileSync(req.file.path).toString('base64');
            enrichedQuery = query || "Please analyze this image for legal context.";
            const extractedText = await FileProcessor.extractText(req.file);
            enrichedQuery += `\n\n[OCR DATA]:\n${extractedText}`;
          }
          else if (mimeType === 'application/pdf') {
            pdfData = fs.readFileSync(req.file.path).toString('base64');
            enrichedQuery = query || "Please analyze this document.";
            let extractedText = await FileProcessor.extractText(req.file);
            if (extractedText.length > 30000) extractedText = extractedText.substring(0, 30000) + "... [Content Truncated]";
            enrichedQuery += `\n\n[TEXT CONTENT]:\n${extractedText}`;
          }
          else if (mimeType.startsWith('audio/') || mimeType === 'video/webm' || mimeType === 'application/ogg') {
            audioData = fs.readFileSync(req.file.path).toString('base64');
            enrichedQuery = query || "Please transcribe and analyze this voice message.";
          }
          else {
            let extractedText = await FileProcessor.extractText(req.file);
            if (extractedText.length > 30000) {
              extractedText = extractedText.substring(0, 30000) + "... [Content Truncated]";
            }
            enrichedQuery = `${query || "Please analyze this document."}\n\n[ATTACHED CONTENT]:\n${extractedText}`;
          }
        } catch (fileErr) {
          console.error('File processing failed:', fileErr);
        } finally {
          // Cleanup uploaded file
          try {
            if (req.file && fs.existsSync(req.file.path)) {
              fs.unlinkSync(req.file.path);
              console.log('Temporary file deleted:', req.file.path);
            }
          } catch (unlinkErr) {
            console.error('Failed to delete temporary file:', unlinkErr);
          }
        }
      }

      const isDemoMode = isDemo === true || isDemo === 'true';

      // Handle demo mode (no database storage)
      if (isDemoMode || chatId === "demo-chat") {
        console.log('Handling as demo-chat or isDemo');
        const mockResponse = await ChatController.getMockResponse(enrichedQuery, language || 'en', mode || 'simple');
        return res.json({
          ok: true,
          userMessage: { id: 'demo-user-msg', role: 'user', content: enrichedQuery, text: query, timestamp: new Date() },
          assistantMessage: { id: 'demo-asst-msg', role: 'assistant', content: mockResponse, text: mockResponse, timestamp: new Date() },
        });
      }

      console.log('Saving to database for chatId:', chatId);
      // 1. Add user message to chat
      const userMessage = await ChatModel.addMessage(chatId, {
        role: 'user',
        content: enrichedQuery,
        query: query || (req.file ? `[File: ${req.file.originalname}]` : ''),
        mediaType: req.file ? (req.file.mimetype.startsWith('image/') ? 'image' : req.file.mimetype.startsWith('audio/') ? 'audio' : 'pdf') : null
      });

      if (imageData) userMessage.imageData = imageData;
      if (pdfData) userMessage.pdfData = pdfData;
      if (audioData) userMessage.audioData = audioData;

      // 2. Call Python AI service
      try {
        console.log('Calling AI service...');
        const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:5001';

        const langMap = { 'en': 'English', 'hi': 'Hindi', 'ta': 'Tamil' };
        const fullLanguage = langMap[effectiveLanguage] || effectiveLanguage || 'English';

        const pythonPayload = {
          query: enrichedQuery,
          language: fullLanguage,
          mode: mode || 'simple',
          image_data: imageData,
          pdf_data: pdfData,
          audio_data: audioData
        };

        const pythonResponse = await axios.post(`${PYTHON_API_URL}/ask`, pythonPayload);

        console.log('AI service responded');
        const assistantMessage = await ChatModel.addMessage(chatId, {
          role: 'assistant',
          content: pythonResponse.data.answer || pythonResponse.data,
        });
        res.json({
          ok: true,
          userMessage: { ...userMessage, text: userMessage.query || userMessage.content },
          assistantMessage: { ...assistantMessage, text: assistantMessage.content },
          pipeline_steps: pythonResponse.data.pipeline_steps || [],
        });
      } catch (aiError) {
        console.error('AI service error:', aiError.message);
        const errorDetail = aiError.response?.data?.error || aiError.message;
        res.status(500).json({
          ok: false,
          error: 'AI Engine Error: ' + errorDetail,
          details: aiError.response?.data
        });
      }
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async evaluate(req, res) {
    try {
      const { user_query, ai_response, mode } = req.body;
      const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:5001';

      const aiResponse = await axios.post(`${PYTHON_API_URL}/evaluate`, {
        user_query,
        ai_response,
        mode
      });

      res.json(aiResponse.data);
    } catch (error) {
      console.error('Evaluation error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async updateChatTitle(req, res) {
    try {
      const { chatId } = req.params;
      const { title } = req.body;

      if (!chatId || !title) {
        return res.status(400).json({ error: 'Chat ID and title are required' });
      }

      const chat = await ChatModel.updateChatTitle(chatId, title);

      res.json({
        ok: true,
        chat,
      });
    } catch (error) {
      console.error('Update chat error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteChat(req, res) {
    try {
      const { chatId } = req.params;

      if (!chatId) {
        return res.status(400).json({ error: 'Chat ID is required' });
      }

      await ChatModel.deleteChat(chatId);

      res.json({
        ok: true,
        message: 'Chat deleted successfully',
      });
    } catch (error) {
      console.error('Delete chat error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async clearChat(req, res) {
    try {
      const { chatId } = req.params;

      if (!chatId) {
        return res.status(400).json({ error: 'Chat ID is required' });
      }

      const chat = await ChatModel.clearChatMessages(chatId);

      res.json({
        ok: true,
        chat,
      });
    } catch (error) {
      console.error('Clear chat error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async rateMessage(req, res) {
    try {
      const { chatId, messageId } = req.params;
      const { rating } = req.body;

      if (!chatId || !messageId || !rating) {
        return res.status(400).json({ error: 'Chat ID, message ID, and rating are required' });
      }

      const message = await ChatModel.rateMessage(chatId, messageId, rating);

      res.json({
        ok: true,
        message,
      });
    } catch (error) {
      console.error('Rate message error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async textToSpeech(req, res) {
    try {
      const { text, language } = req.body;
      const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:5001';

      console.log(`Sending TTS request to ${PYTHON_API_URL}/tts for language: ${language}`);

      const response = await axios.post(`${PYTHON_API_URL}/tts`, {
        text,
        language
      });

      res.json(response.data);
    } catch (error) {
      console.error('TTS error:', error.message);
      const errorDetail = error.response?.data?.error || error.message;
      res.status(500).json({
        ok: false,
        error: 'TTS Service Error: ' + errorDetail
      });
    }
  }
}

module.exports = ChatController;
