const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chats');
const translationRoutes = require('./routes/translations');
const legalCategoryRoutes = require('./routes/legalCategories');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/translations', translationRoutes);
app.use('/api/legal-categories', legalCategoryRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'NyayaSetu Backend is running', timestamp: new Date() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'NyayaSetu Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      chats: '/api/chats',
      translations: '/api/translations',
      legalCategories: '/api/legal-categories'
    }
  });
});

app.listen(PORT, () => {
  console.log(`NyayaSetu Backend running on http://localhost:${PORT}`);
});
