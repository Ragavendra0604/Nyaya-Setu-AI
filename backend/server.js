const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:5001/ask';

app.use(cors());
app.use(express.json());

// Forwarding route to Python Backend
app.post('/ask', async (req, res) => {
  try {
    const { query, language, mode } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log(`Forwarding request to Python API: ${query} [Lang: ${language}, Mode: ${mode || 'simple'}]`);

    const response = await axios.post(PYTHON_API_URL, {
      query,
      language: language || 'English',
      mode: mode || 'simple'
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error forwarding request:', error.message);

    if (error.response) {
      // Error from Python service
      return res.status(error.response.status).json(error.response.data);
    }

    res.status(500).json({
      error: 'Failed to connect to AI Service',
      message: error.message
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'Gateway is running' });
});

// Forward evaluation requests to Python AI service
app.post('/evaluate', async (req, res) => {
  try {
    const { user_query, mode, ai_response } = req.body;
    if (!user_query || !ai_response) {
      return res.status(400).json({ error: 'user_query and ai_response are required' });
    }
    const PYTHON_EVAL_URL = (process.env.PYTHON_API_URL || 'http://localhost:5001/ask').replace('/ask', '/evaluate');
    const response = await axios.post(PYTHON_EVAL_URL, { user_query, mode, ai_response });
    res.json(response.data);
  } catch (error) {
    console.error('Evaluation error:', error.message);
    res.status(500).json({ error: 'Evaluation service unavailable', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`NyayaSetu Gateway running on http://localhost:${PORT}`);
});
