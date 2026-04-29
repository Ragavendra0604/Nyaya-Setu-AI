# NyayaSetu AI - Indian Legal Assistant

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/React-19.2.5-blue.svg" alt="React">
  <img src="https://img.shields.io/badge/Flask-3.0-orange.svg" alt="Flask">
  <img src="https://img.shields.io/badge/Node.js-16+-green.svg" alt="Node.js">
</p>

NyayaSetu AI is an AI-powered legal guidance platform designed to provide simple, step-by-step legal information to Indian citizens. The name "NyayaSetu" (न्यायसेतु) means "Bridge to Justice" in Sanskrit, reflecting our mission to make legal knowledge accessible to everyone.

## 🌟 Features

- **AI-Powered Guidance**: Specialized knowledge in FIR procedures, Legal Aid, and Citizen Rights
- **Multilingual Support**: English, Hindi (हिन्दी), and Tamil (தமிழ்)
- **Modern UI**: Glassmorphic design with smooth animations using Framer Motion
- **Secure Architecture**: Decoupled Python AI service with a Node.js API Gateway
- **Chat History**: Persistent conversation history using localStorage

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐      ┌─────────────────┐
│   React UI      │────▶│  Node.js API    │────▶│  Python AI      │
│  (Port 3000)    │     │  Gateway        │      │  Service        │
│                 │     │  (Port 5000)    │      │  (Port 5001)    │
└─────────────────┘     └─────────────────┘      └─────────────────┘
```

| Component | Technology | Port | Description |
|-----------|------------|------|-------------|
| Frontend | React + Framer Motion | 3000 | User interface |
| Gateway | Node.js Express | 5000 | API routing & proxy |
| AI Service | Flask + Python | 5001 | LLM integration |

## 📋 Prerequisites

- **Python**: 3.8 or higher
- **Node.js**: 16 or higher
- **Package Manager**: npm (comes with Node.js)
- **API Key**: Gemini API Key or OpenRouter API Key

## 🚀 Quick Start

### Option 1: Using the Launcher Script (Windows)

Simply run the batch file to start all services:

```bash
start_all.bat
```

This will open three separate terminal windows:
- Frontend: http://localhost:3000
- Gateway: http://localhost:5000
- AI Service: http://localhost:5001

### Option 2: Manual Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd Nyaya_Setu
```

#### 2. Configure Environment Variables

Create a `.env` file in the `ai` directory:

```env
# Choose one or both API providers
GEMINI_API_KEY=your_gemini_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

> **Note**: Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey) or OpenRouter key from [OpenRouter](https://openrouter.ai/keys).

#### 3. Start the AI Service (Python/Flask)

```bash
cd ai
pip install -r requirements.txt
python app.py
```

#### 4. Start the API Gateway (Node.js)

```bash
cd backend
npm install
npm start
```

#### 5. Start the Frontend (React)

```bash
cd frontend
npm install
npm start
```

## 📁 Project Structure

```
Nyaya_Setu/
├── README.md              # This file
├── start_all.bat          # Windows launcher script
├── ai/                    # Python AI Service
│   ├── app.py            # Flask application
│   └── requirements.txt  # Python dependencies
├── backend/              # Node.js API Gateway
│   ├── package.json      # Node dependencies
│   └── server.js         # Express server
└── frontend/             # React Frontend
    ├── package.json      # React dependencies
    ├── public/           # Static assets
    └── src/
        ├── App.js        # Main React component
        ├── App.css       # Styling
        └── index.js      # Entry point
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes* | Google Gemini API key |
| `OPENROUTER_API_KEY` | Yes* | OpenRouter API key |
| `PYTHON_API_URL` | No | Python service URL (default: http://localhost:5001) |
| `PORT` | No | Gateway port (default: 5000) |

*At least one API key is required.

### Supported Languages

| Language | Code | Script |
|----------|------|--------|
| English | English | Latin |
| Hindi | Hindi | Devanagari (हिन्दी) |
| Tamil | Tamil | Tamil (தமிழ்) |

## 💻 Usage

1. Open http://localhost:3000 in your browser
2. Select your preferred language from the dropdown
3. Choose the response mode (Simple or Detailed)
4. Type your legal query in the chat box
5. Press Enter or click the send button

### Example Queries

- "How do I file an FIR?"
- "What are my rights when arrested?"
- "How do I get free legal aid?"
- "What is Zero FIR?"

## 📦 Dependencies

### Python (ai/)

- Flask
- Flask-CORS
- openai
- google-generativeai
- python-dotenv

### Node.js (backend/)

- express
- axios
- cors
- dotenv

### React (frontend/)

- react & react-dom
- framer-motion
- lucide-react
- react-markdown
- remark-gfm
- axios

## ⚠️ Disclaimer

This application is a **prototype for informational purposes only** and does not constitute legal advice. For specific legal matters, please consult a qualified advocate or legal professional.

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">Built with ❤️ for accessible justice in India</p>
