# Nyaya-Setu AI 🏛️⚖️

> **"Bridge of Justice"** - A comprehensive multilingual legal assistance platform powered by AI

[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen.svg)]()

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Architecture](#project-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Services Overview](#services-overview)
- [Database Models](#database-models)
- [Features & Functionality](#features--functionality)
- [Supported Languages](#supported-languages)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)

---

## 📖 Overview

**Nyaya-Setu AI** is a modern, AI-powered legal assistance platform designed specifically for Indian citizens. It provides accessible legal guidance, document processing, and AI-driven legal advice in multiple Indian languages.

The platform bridges the gap between complex legal terminology and everyday language by offering:
- Real-time legal consultations powered by AI
- Speech-to-Text (STT) support for accessibility
- Multilingual support (English, Hindi, Tamil)
- Document analysis and processing
- User authentication and profile management
- Secure data storage with Firebase

---

## ✨ Features

### 🤖 AI-Powered Features
- **Intelligent Legal Chatbot**: Powered by Google Gemini and OpenRouter AI models with fallback mechanisms
- **Multi-Model Support**: Seamlessly switches between Gemini 1.5 Flash, GPT OSS, Gemma, and Llama models
- **Context-Aware Responses**: Specializes in Indian legal framework guidance

### 🎙️ Voice & Audio
- **Speech-to-Text (STT)**: Convert audio in multiple Indian languages to text using Faster-Whisper
- **Text-to-Speech (TTS)**: Generate audio responses using gTTS with multi-language support
- **Language Detection**: Automatic detection of input language

### 📱 User Experience
- **Responsive Web Interface**: Built with React and Vite for fast performance
- **Multilingual Interface**: Support for English, Hindi, and Tamil
- **User Authentication**: Firebase-based secure authentication with email/OTP support
- **User Profiles**: Personalized user profiles with preferences

### 📄 Document Processing
- **PDF Processing**: Extract and analyze legal documents
- **Word Document Support**: Process .docx files
- **OCR Capability**: Extract text from scanned documents using Tesseract
- **File Upload & Storage**: Secure file management on backend

### 🔐 Security & Data Management
- **Firebase Authentication**: Email and OTP-based authentication
- **Secure Database**: Encrypted data storage
- **CORS Enabled**: Secure cross-origin requests
- **User Authorization**: Role-based access control

### 📚 Additional Features
- **Chat History**: Persistent chat storage for reference
- **Legal Categories**: Organized legal topics and resources
- **Translation Services**: Translate legal text between languages
- **Health Monitoring**: API health check endpoints

---

## 🏗️ Project Architecture (Microservices)

### System Overview

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐             │
│  │  Web Browser     │  │  Mobile App      │  │  Desktop App     │             │
│  │  (React + Vite)  │  │  (Future)        │  │  (Electron)      │             │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘             │
└───────────┼─────────────────────┼─────────────────────┼───────────────────────┘
            │                     │                     │
            └───────────┬─────────┴───────────┬─────────┘
                        │                     │
            ┌───────────▼─────────────────────────────┐
            │   API GATEWAY (Load Balancer)           │
            │   - Request Routing                     │
            │   - Rate Limiting                       │
            │   - Authentication/Authorization        │
            │   - Request Validation                  │
            └───────────┬─────────────────────────────┘
                        │
        ┌───────────────┼─────────────┬────────────────┬─────────────┐
        │               │             │                │             │
        │               │             │                │             │
┌───────▼──────┐ ┌──────▼──────┐ ┌────▼────────┐ ┌─────▼──────┐ ┌────▼──────┐
│ AUTH SERVICE │ │CHAT SERVICE │ │   AI        │ │TRANSLATION │ │ DOCUMENT  │
│              │ │             │ │  SERVICE    │ │ SERVICE    │ │ PROCESSING│
│              │ │             │ │             │ │            │ │           │
│ - Register   │ │ - Send Msg  │ │             │ │            │ │           │
│ - Login      │ │ - Get Chat  │ │ - Gemini    │ │ - Translate│ │ - PDF     │
│ - OTP Verify │ │ - Get Hist  │ │ - OpenRouter│ │ - History  │ │ - DOCX    │
│ - Profile    │ │ - Delete    │ │ - Fallback  │ │            │ │ - OCR     │
└────┬─────────┘ └──────┬──────┘ └─────────────┘ └────┬───────┘ └────┬──────┘
     │                  │                             │              │
     │                  │                             │              │
     └──────────┬───────┴─────────────────────────────┴──────────────┘
                │
     ┌──────────▼─────────────────┐
     │  SUPPORT MICROSERVICES     │
     │                            │
     │  ┌─────────────────────┐   │
     │  │  STT/TTS SERVICE    │   │  ┌────────────────────┐
     │  │                     │   │  │  LEGAL CATEGORY    │
     │  │  - Whisper (STT)    │   │  │  SERVICE           │
     │  │  - gTTS (TTS)       │   │  │                    │
     │  │  - Lang Detection   │   │  │  - Get Categories  │
     │  └─────────────────────┘   │  │  - Get Resources   │
     │                            │  └────────────────────┘
     └────────────┬───────────────┘
                  │
     ┌────────────▼────────────────────────────────────┐
     │        DATA & INFRASTRUCTURE LAYER              │
     │                                                 │
     │  ┌──────────────┐  ┌──────────────┐             │
     │  │   Firebase   │  │    Redis     │             │
     │  │  - Firestore │  │   (Cache)    │             │
     │  │  - Auth      │  │              │             │
     │  │  - Storage   │  └──────────────┘             │
     │  └──────────────┘                               │
     │                                                 │
     │  ┌────────────────────────────────────┐         │
     │  │  Message Queue (Optional RabbitMQ) │         │
     │  │  - Async Task Processing           │         │
     │  │  - Service Communication           │         │
     │  └────────────────────────────────────┘         │
     │                                                 │
     └─────────────────────────────────────────────────┘
```

### Microservices Communication Flow

```
┌──────────────┐
│   Client     │
└──────┬───────┘
       │ HTTP/REST
       │
       ▼
┌──────────────────────┐
│   API Gateway        │
│   (Express)          │
└──────┬───────────────┘
       │
       ├─────────────────┬──────────────┬───────────────┬────────────┐
       │                 │              │               │            │
       ▼                 ▼              ▼               ▼            ▼
    [Auth]          [Chat]          [AI]        [Translation]   [Document]
    Service         Service         Service     Service         Service
       │                 │              │               │            │
       │                 │              │               │            │
       └─────────────────┼──────────────┼───────────────┼────────────┘
                         │
                         ▼
                    Firebase DB
                 (Firestore/RTDB)
```

### Service Responsibilities

| Service | Port | Responsibilities |
|---------|------|-----------------|
| **API Gateway** | 80/443 | Request routing, auth validation, rate limiting |
| **Auth Service** | User registration, login, OTP, JWT tokens |
| **Chat Service** | Message management, chat history, persistence |
| **AI Service** | 5001 | LLM inference, model fallbacks, prompt engineering |
| **Translation Service** | Multi-language translation, language detection |
| **Document Processing** | PDF/DOCX parsing, OCR, text extraction |
| **STT/TTS Service** | Speech-to-text, text-to-speech conversion |
| **Legal Category** | Legal topic management, resource recommendations |

---

## 💻 Tech Stack

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.10
- **Styling**: CSS3
- **Internationalization**: i18next 26.0.8
- **UI Libraries**: 
  - React Icons 5.6.0
  - Lucide React 1.14.0
  - React Hot Toast 2.6.0
- **Authentication**: Firebase 12.12.1
- **Markdown**: React Markdown 10.1.0

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: Firebase
- **Authentication**: Firebase Admin 12.0.0
- **Document Processing**:
  - pdf-parse 2.4.5
  - mammoth 1.12.0 (Word docs)
  - tesseract.js 7.0.0 (OCR)
- **File Upload**: Multer 2.1.1
- **Utilities**: 
  - Axios 1.15.2
  - UUID 9.0.0
  - CORS 2.8.6
- **Development**: Nodemon 3.1.14

### AI/ML Service
- **Framework**: Flask
- **AI Models**:
  - Google Generative AI (Gemini)
  - OpenRouter API (Fallback models)
  - OpenAI Client
- **Speech Processing**:
  - Faster-Whisper (STT)
  - gTTS (TTS)
- **ML Libraries**:
  - PyTorch
  - LangDetect
- **Utilities**:
  - Flask-CORS
  - Python-dotenv

---

## 📁 Project Structure

```
Nyaya-Setu-AI/
│
├── frontend/                          # React Frontend Application
│   ├── src/
│   │   ├── components/               # React Components
│   │   │   ├── Auth/                # Authentication pages
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── SignUp.jsx
│   │   │   │   ├── LoginWithOTP.jsx
│   │   │   │   └── Forgot.jsx
│   │   │   ├── Profile/              # User profile components
│   │   │   ├── Chatpage.jsx          # Main chat interface
│   │   │   ├── DashboardScreen.jsx   # Dashboard
│   │   │   └── LanguageSelectionScreen.jsx
│   │   ├── services/
│   │   │   └── api.js               # API client utilities
│   │   ├── locals/                   # i18n translations
│   │   │   ├── en/                  # English translations
│   │   │   ├── hi/                  # Hindi translations
│   │   │   └── ta/                  # Tamil translations
│   │   ├── data/
│   │   │   └── mockData.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── firebase.js              # Firebase configuration
│   │   └── styles.css
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/                           # Express.js Backend
│   ├── controllers/                 # Business logic
│   │   ├── AuthController.js
│   │   ├── ChatController.js
│   │   ├── LegalCategoryController.js
│   │   └── TranslationController.js
│   ├── routes/                      # API routes
│   │   ├── auth.js
│   │   ├── chats.js
│   │   ├── legalCategories.js
│   │   ├── otp.js
│   │   └── translations.js
│   ├── models/                      # Database schemas
│   │   ├── User.js
│   │   ├── Chat.js
│   │   ├── Translation.js
│   │   └── LegalCategory.js
│   ├── config/
│   │   ├── firebase.js              # Firebase Admin SDK
│   │   └── schema.js
│   ├── utils/
│   │   └── fileProcessor.js         # Document processing utilities
│   ├── scripts/
│   │   └── seed_languages.js        # Database seeding
│   ├── uploads/                     # Temporary file storage
│   ├── *.traineddata               # Tesseract OCR data files
│   │   ├── eng.traineddata         # English
│   │   ├── hin.traineddata         # Hindi
│   │   └── tam.traineddata         # Tamil
│   ├── server.js                   # Entry point
│   ├── package.json
│   ├── .env                        # Environment variables
│   └── serviceAccount.json         # Firebase credentials
│
├── ai/                              # Flask AI Service
│   ├── services/                   # AI service modules
│   │   ├── ai_service.py           # Main AI logic with model fallbacks
│   │   ├── stt_service.py          # Speech-to-Text (Faster-Whisper)
│   │   ├── tts_service.py          # Text-to-Speech (gTTS)
│   │   └── media_service.py        # Media processing
│   ├── routes/
│   │   └── ai_routes.py            # AI endpoints
│   ├── controllers/
│   │   └── ai_controller.py        # AI logic controller
│   ├── config/
│   │   └── settings.py             # Configuration & API keys
│   ├── wmodels/                    # Pre-trained models
│   │   └── models--Systran--faster-whisper-medium/
│   ├── app.py                      # Flask app entry point
│   ├── requirements.txt
│   └── .env
│
└── README.md                         # This file
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### System Requirements
- **Node.js**: v16 or higher
- **Python**: v3.8 or higher
- **npm** or **yarn**: Package managers
- **Git**: Version control

### API Keys & Services
- **Google Gemini API Key** (Optional but recommended)
- **OpenRouter API Key** (Fallback AI service)
- **Firebase Project** with:
  - Authentication enabled (Email/Password, Custom Auth)
  - Firestore or Realtime Database
  - Admin SDK service account JSON

### Hardware Recommendations
- **GPU** (NVIDIA with CUDA): For faster speech-to-text processing
  - 6GB+ VRAM recommended for Whisper large-v3 model
  - 2GB+ VRAM for medium model
- **Minimum**: 4GB RAM, 10GB disk space

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Ragavendra0604/Nyaya-Setu-AI.git
cd Nyaya-Setu-AI
```

### 2. Backend Setup (Express.js)

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
FIREBASE_PROJECT_ID=your-firebase-project
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
AI_SERVICE_URL=http://localhost:5001
NODE_ENV=development
EOF

# Replace with your Firebase credentials in serviceAccount.json

# Start the backend
npm start
```

**Expected Output:**
```
NyayaSetu Backend running on http://localhost:5000
```

### 3. AI Service Setup (Flask + Python)

```bash
cd ai

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
OPENROUTER_API_KEY=your-openrouter-key
GEMINI_API_KEY=your-gemini-api-key
FLASK_ENV=development
EOF

# Download Whisper model (first run only)
# This will be automatically downloaded on first STT request

# Start the Flask app
python app.py
```

**Expected Output:**
```
Auto-detecting GPU for Whisper...
Selected Whisper Model: medium (float16)
 * Running on http://localhost:5001
```

### 4. Frontend Setup (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (if needed for Firebase)
# Firebase config is usually in src/firebase.js

# Start development server
npm run dev
```

**Expected Output:**
```
VITE v5.4.10  ready in XXX ms

➜  Local:   http://localhost:5173/
```

### 5. Access the Application

Open your browser and navigate to:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **AI Service**: `http://localhost:5001`

---

## ⚙️ Configuration

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Create a Firestore database

2. **Generate Service Account Key**
   - Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `backend/serviceAccount.json`

3. **Environment Variables** (`backend/.env`)
   ```env
   PORT=5000
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=your-client-email
   ```

### AI Service Configuration

**Set up API Keys** (`ai/.env`):

```env
# Google Gemini (Recommended - Free tier available)
GEMINI_API_KEY=your-gemini-api-key

# OpenRouter (Fallback models - Multiple free options)
OPENROUTER_API_KEY=your-openrouter-key

# Flask Configuration
FLASK_ENV=development
DEBUG=True
```

### Frontend Configuration

Update `frontend/src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## 🎮 Running the Application

### Development Mode (All Services)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - AI Service:**
```bash
cd ai
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

**Backend:**
- Use process manager like PM2:
  ```bash
  npm install -g pm2
  pm2 start server.js --name "nyaya-setu-backend"
  ```

---

## 🔌 API Endpoints

### Authentication Routes
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/logout            - Logout user
GET    /api/auth/profile           - Get user profile
PUT    /api/auth/profile           - Update user profile
```

### Chat Routes
```
POST   /api/chats/create           - Create new chat
GET    /api/chats/:userId          - Get user chats
POST   /api/chats/:chatId/message  - Send message
GET    /api/chats/:chatId          - Get chat history
DELETE /api/chats/:chatId          - Delete chat
```

### Translation Routes
```
POST   /api/translations/translate - Translate text
GET    /api/translations/history   - Get translation history
```

### Legal Categories
```
GET    /api/legal-categories       - Get all categories
GET    /api/legal-categories/:id   - Get category details
```

### OTP Routes
```
POST   /api/otp/send              - Send OTP
POST   /api/otp/verify            - Verify OTP
```

### AI Service Routes
```
POST   /api/ai/chat               - Send message to AI
POST   /api/ai/stt                - Convert speech to text
POST   /api/ai/tts                - Convert text to speech
POST   /api/ai/analyze-document   - Analyze legal document
```

### Health Check
```
GET    /health                     - Backend health status
GET    /                           - API info endpoint
```

---

## 🔧 Services Overview

### 1. **AI Service** (`ai_service.py`)
Manages multi-model AI responses with intelligent fallback:
- **Primary**: Google Gemini 1.5 Flash
- **Fallback Options**:
  - OpenAI GPT-OSS 120B (Free)
  - Google Gemma 3 27B
  - Meta Llama 3.3 70B
  - Inclusion AI Ling 2.6

### 2. **Speech-to-Text Service** (`stt_service.py`)
- Uses Faster-Whisper (optimized OpenAI Whisper)
- Auto-detects optimal model size based on GPU VRAM
- Supports English, Hindi, Tamil, and other languages
- Automatic language detection

### 3. **Text-to-Speech Service** (`tts_service.py`)
- Uses gTTS (Google Text-to-Speech)
- Multi-language support
- Audio streaming

### 4. **Media Service** (`media_service.py`)
- Processes multimedia content
- Handles image data for AI models
- Extracts text from documents

---

## 🗄️ Database Models

### User Model
```javascript
{
  uid: String (Firebase UID),
  email: String,
  displayName: String,
  phoneNumber: String,
  preferredLanguage: String,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Chat Model
```javascript
{
  chatId: String (UUID),
  userId: String,
  title: String,
  messages: [
    {
      role: "user" | "assistant",
      content: String,
      timestamp: Timestamp
    }
  ],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Translation Model
```javascript
{
  translationId: String,
  userId: String,
  sourceLanguage: String,
  targetLanguage: String,
  originalText: String,
  translatedText: String,
  createdAt: Timestamp
}
```

### Legal Category Model
```javascript
{
  categoryId: String,
  name: String,
  description: String,
  icon: String,
  subCategories: [String],
  resources: [String]
}
```

---

## 🎯 Features & Functionality

### Authentication Flow
1. User registers with email and password
2. Verification email sent
3. User logs in with credentials
4. JWT token generated by Firebase
5. Persistent session management

### Chat Flow
1. User sends message (text or voice)
2. Message processed by AI service
3. Response generated with context awareness
4. Response can be returned as text or audio
5. Chat history stored in database

### Document Processing Flow
1. User uploads document (PDF, DOCX, Image)
2. Backend processes file with appropriate tool
   - PDF: pdf-parse
   - DOCX: mammoth
   - Image/Scan: Tesseract OCR
3. Extracted text sent to AI for analysis
4. Legal analysis and recommendations provided

### Voice Interaction Flow
1. User records or uploads audio
2. Audio sent to STT service
3. Whisper converts audio to text
4. Text processed as chat message
5. Response generated
6. Response converted to audio via TTS
7. Audio played to user

### Multi-Language Support
- **Interface Languages**: English, Hindi, Tamil
- **AI Processing Languages**: All Indian languages supported by Whisper
- **Automatic Detection**: Language detection for user input
- **Translation Service**: Translate between languages

---

## 🌐 Supported Languages

### UI Languages
- 🇬🇧 English
- 🇮🇳 Hindi (हिंदी)
- 🇮🇳 Tamil (தமிழ்)

### Speech Processing Languages
- English
- Hindi
- Tamil
- Marathi
- Bengali
- Telugu
- Kannada
- Malayalam
- Gujarati
- Urdu
- And 90+ other languages supported by Whisper

---

## 🔍 Troubleshooting

### Common Issues

#### 1. **Port Already in Use**
```bash
# Find and kill process using port
# macOS/Linux:
lsof -i :5000
kill -9 <PID>

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

#### 2. **Firebase Connection Issues**
- Verify `serviceAccount.json` exists in `backend/`
- Check Firebase credentials in `.env`
- Ensure Firestore database is created
- Check network connectivity

#### 3. **Whisper Model Not Loading**
```bash
# Clear Torch cache
python -c "import torch; torch.cuda.empty_cache()"

# Reinstall faster-whisper
pip install --upgrade faster-whisper
```

#### 4. **CORS Errors**
- Ensure frontend URL is in CORS allowlist
- Check backend `.env` for correct port
- Verify Express CORS middleware is enabled

#### 5. **GPU Not Detected**
```bash
# Check CUDA installation
python -c "import torch; print(torch.cuda.is_available())"
python -c "import torch; print(torch.cuda.get_device_name(0))"
```

#### 6. **Memory Issues**
- Reduce Whisper model size in `ai/services/stt_service.py`
- Clear browser cache
- Increase system virtual memory

---

## 📊 Performance Optimization

### Frontend Optimization
- Vite provides tree-shaking and code splitting
- React Hot Module Replacement for dev experience
- Lazy loading of components
- CSS optimization

### Backend Optimization
- Connection pooling for database
- Request caching
- File compression for uploads
- Efficient document processing

### AI Service Optimization
- GPU acceleration for Whisper
- Model caching to avoid reloading
- Batch processing where possible
- Async request handling

---

## 🙏 Acknowledgments

- **OpenAI** for Whisper
- **Google** for Gemini AI and gTTS
- **OpenRouter** for unified AI model access
- **Firebase** for authentication and database
- **React** and **Express.js** communities

---

**Made with ❤️ for Justice & Accessibility**
