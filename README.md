
<div align="center">

```
███╗   ██╗██╗   ██╗ █████╗ ██╗   ██╗ █████╗       ███████╗███████╗████████╗██╗   ██╗
████╗  ██║╚██╗ ██╔╝██╔══██╗╚██╗ ██╔╝██╔══██╗      ██╔════╝██╔════╝╚══██╔══╝██║   ██║
██╔██╗ ██║ ╚████╔╝ ███████║ ╚████╔╝ ███████║█████╗███████╗█████╗     ██║   ██║   ██║
██║╚██╗██║  ╚██╔╝  ██╔══██║  ╚██╔╝  ██╔══██║╚════╝╚════██║██╔══╝     ██║   ██║   ██║
██║ ╚████║   ██║   ██║  ██║   ██║   ██║  ██║      ███████║███████╗   ██║   ╚██████╔╝
╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝      ╚══════╝╚══════╝   ╚═╝    ╚═════╝ 
```

### ⚖️ *न्याय सेतु* — **Bridge of Justice**
#### AI-powered legal assistance for every Indian citizen, in every language

<br/>

[![License](https://img.shields.io/badge/License-ISC-0d1117?style=for-the-badge&labelColor=f97316&color=0d1117)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Dev-0d1117?style=for-the-badge&labelColor=22c55e&color=0d1117)](#)
[![Node](https://img.shields.io/badge/Node.js-v16+-0d1117?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=3d7a3d&color=0d1117)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python-3.8+-0d1117?style=for-the-badge&logo=python&logoColor=white&labelColor=3670a0&color=0d1117)](https://python.org)
[![React](https://img.shields.io/badge/React-18.3-0d1117?style=for-the-badge&logo=react&logoColor=61dafb&labelColor=20232a&color=0d1117)](https://react.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20DB-0d1117?style=for-the-badge&logo=firebase&logoColor=ffca28&labelColor=333&color=0d1117)](https://firebase.google.com)

<br/>

> *"Millions of Indians are denied justice not because they lack rights — but because they can't access them."*
> NyayaSetu changes that.

<br/>

[**✦ Features**](#-features) · [**✦ Architecture**](#%EF%B8%8F-architecture) · [**✦ Quick Start**](#-quick-start) · [**✦ API Docs**](#-api-reference) · [**✦ Tech Stack**](#-tech-stack)

</div>

---

<br/>

## 🌟 What is NyayaSetu?

**NyayaSetu** *(Nyaya = Justice, Setu = Bridge)* is a full-stack, AI-powered legal assistance platform built for the 1.4 billion people of India. It makes legal guidance accessible to citizens regardless of their **language**, **literacy level**, or **technical ability**.

```
You speak. It listens.   →   Hindi, Tamil, Telugu, Marathi, Bengali… and 90+ more.
You upload. It reads.    →   PDFs, scanned documents, Word files — analyzed instantly.
You ask. It explains.    →   Complex Indian law in plain, simple language.
```

<br/>

---

## ✨ Features

<br/>

### 🤖 &nbsp; AI Legal Intelligence

| Capability | Description |
|---|---|
| **Multi-Model AI** | Gemini 1.5 Flash → GPT-OSS 120B → Gemma 3 27B → Llama 3.3 70B — intelligent fallback chain |
| **Context-Aware** | Specialized system prompts tuned for Indian legal frameworks, IPC, CrPC, and civil law |
| **Document Analysis** | Upload a legal document and receive plain-language summaries & risk analysis |
| **Conversation Memory** | Full chat history persisted per user for ongoing case discussions |

<br/>

### 🎙️ &nbsp; Voice-First Accessibility

```
  ┌──────────────────────────────────────────────────────────┐
  │  🎤  SPEAK  →  [Faster-Whisper STT]  →  📝  TEXT        │
  │  📝  TEXT   →  [AI Legal Engine]     →  💬  RESPONSE    │
  │  💬  TEXT   →  [gTTS Engine]         →  🔊  AUDIO       │
  └──────────────────────────────────────────────────────────┘
```

- Auto GPU-detection for optimal Whisper model selection
- Supports **90+ Indian & world languages** in speech
- End-to-end voice legal consultation — no typing needed

<br/>

### 📄 &nbsp; Document Intelligence

| File Type | Processing Engine | Output |
|---|---|---|
| `.pdf` | pdf-parse | Text extraction + AI analysis |
| `.docx` | Mammoth.js | Structured content parsing |
| Scanned images | Tesseract OCR | Text recognition (EN/HI/TA) |

<br/>

### 🌐 &nbsp; Multilingual Interface

<div align="center">

| 🇬🇧 English | 🇮🇳 हिंदी Hindi | 🇮🇳 தமிழ் Tamil |
|:---:|:---:|:---:|
| Full UI support | Full UI support | Full UI support |

*+ 90 spoken languages via Whisper STT*

</div>

<br/>

---

## 🏗️ Architecture

<br/>

```
╔═══════════════════════════════════════════════════════════════════╗
║                        CLIENT LAYER                               ║
║   React 18 + Vite · i18next · Firebase Auth · React Markdown     ║
╚══════════════════════╤════════════════════════════════════════════╝
                       │  HTTP / REST
                       ▼
╔══════════════════════════════════════════════════════════════════╗
║                    API GATEWAY  :80/:443                         ║
║         Routing · Rate Limiting · Auth · Validation             ║
╚═══╤════════════╤═══════════════╤═══════════════╤════════════════╝
    │            │               │               │
    ▼            ▼               ▼               ▼
┌────────┐  ┌────────┐     ┌──────────┐   ┌──────────────┐
│  AUTH  │  │  CHAT  │     │    AI    │   │  TRANSLATION │
│        │  │        │     │ :5001    │   │   SERVICE    │
│Register│  │Messages│     │          │   │              │
│ Login  │  │History │     │ Gemini   │   │ Translate    │
│  OTP   │  │ Delete │     │ OpenRtr  │   │ Lang Detect  │
└───┬────┘  └───┬────┘     │ Fallback │   └──────┬───────┘
    │           │          └──────────┘          │
    │           │          ┌──────────┐          │
    │           │          │ DOCUMENT │          │
    │           │          │  :5001   │          │
    │           │          │ PDF/DOCX │          │
    │           │          │   OCR   │          │
    │           │          └──────────┘          │
    └─────────────────────┬──────────────────────┘
                          │
          ┌───────────────┼────────────────┐
          ▼               ▼                ▼
    ┌──────────┐   ┌────────────┐   ┌──────────────┐
    │ Firebase │   │  STT/TTS   │   │    LEGAL     │
    │Firestore │   │  SERVICE   │   │  CATEGORIES  │
    │   Auth   │   │  Whisper   │   │              │
    │ Storage  │   │   gTTS     │   │  Topics &    │
    └──────────┘   └────────────┘   │  Resources   │
                                    └──────────────┘
```

<br/>

### Service Map

| Service | Port | Stack | Responsibility |
|---|---|---|---|
| **Frontend** | `5173` | React + Vite | UI, auth, file upload |
| **Backend / Gateway** | `5000` | Node.js + Express | Routing, auth, DB, documents |
| **AI Service** | `5001` | Flask + Python | LLM, STT, TTS, document analysis |
| **Database** | — | Firebase Firestore | Users, chats, translations |

<br/>

---

## 🚀 Quick Start

### Prerequisites

```bash
node  >= 16     # Backend + Frontend
python >= 3.8   # AI Service
# Optional but recommended for STT performance:
# NVIDIA GPU with 2GB+ VRAM (CUDA)
```

You'll also need:
- 🔑 [Google Gemini API Key](https://aistudio.google.com) *(free tier available)*
- 🔑 [OpenRouter API Key](https://openrouter.ai) *(fallback models)*
- 🔥 [Firebase Project](https://console.firebase.google.com) *(Auth + Firestore)*

<br/>

### 1 — Clone

```bash
git clone https://github.com/Ragavendra0604/Nyaya-Setu-AI.git
cd Nyaya-Setu-AI
```

<br/>

### 2 — Backend `(Express.js · :5000)`

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
FIREBASE_PROJECT_ID=your-firebase-project
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-client-email
AI_SERVICE_URL=http://localhost:5001
NODE_ENV=development
```

Place your Firebase service account JSON at `backend/serviceAccount.json`, then:

```bash
npm start
# ✓ NyayaSetu Backend running on http://localhost:5000
```

<br/>

### 3 — AI Service `(Flask · :5001)`

```bash
cd ai
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `ai/.env`:

```env
GEMINI_API_KEY=your-gemini-api-key
OPENROUTER_API_KEY=your-openrouter-key
FLASK_ENV=development
```

```bash
python app.py
# ✓ Auto-detecting GPU for Whisper...
# ✓ Running on http://localhost:5001
```

<br/>

### 4 — Frontend `(React · :5173)`

```bash
cd frontend
npm install
```

Update `frontend/src/firebase.js` with your Firebase web config, then:

```bash
npm run dev
# ✓ Local: http://localhost:5173
```

<br/>

> **All three terminals running?** Open `http://localhost:5173` — you're live. ✅

<br/>

---

## 📡 API Reference

<br/>

### Auth

```
POST  /api/auth/register          →  Register new user
POST  /api/auth/login             →  Login with email/password
POST  /api/auth/logout            →  Invalidate session
GET   /api/auth/profile           →  Fetch profile
PUT   /api/auth/profile           →  Update profile
POST  /api/otp/send               →  Send OTP
POST  /api/otp/verify             →  Verify OTP
```

### Chat

```
POST  /api/chats/create           →  New chat session
GET   /api/chats/:userId          →  List user's chats
POST  /api/chats/:chatId/message  →  Send message
GET   /api/chats/:chatId          →  Full chat history
DELETE /api/chats/:chatId         →  Delete chat
```

### AI & Voice

```
POST  /api/ai/chat                →  Query legal AI
POST  /api/ai/stt                 →  Audio → Text (Whisper)
POST  /api/ai/tts                 →  Text → Audio (gTTS)
POST  /api/ai/analyze-document    →  Upload + analyze legal doc
```

### Translation & Categories

```
POST  /api/translations/translate →  Translate text
GET   /api/translations/history   →  Past translations
GET   /api/legal-categories       →  All legal topics
GET   /api/legal-categories/:id   →  Category details
```

### Health

```
GET   /health                     →  Service status
GET   /                           →  API info
```

<br/>

---

## 🛠 Tech Stack

<br/>

<div align="center">

**Frontend**

![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![i18next](https://img.shields.io/badge/i18next-26A69A?style=flat-square&logo=i18next&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase_Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black)

**Backend**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=flat-square&logo=express&logoColor=white)
![Firebase](https://img.shields.io/badge/Firestore-FF6F00?style=flat-square&logo=firebase&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-FF5722?style=flat-square)
![Tesseract](https://img.shields.io/badge/Tesseract_OCR-4285F4?style=flat-square)

**AI / ML Service**

![Python](https://img.shields.io/badge/Python_3.8+-3776AB?style=flat-square&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_1.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white)
![OpenRouter](https://img.shields.io/badge/OpenRouter-6D28D9?style=flat-square)
![Whisper](https://img.shields.io/badge/Faster--Whisper-412991?style=flat-square&logo=openai&logoColor=white)

</div>

<br/>

---

## 📂 Project Structure

```
Nyaya-Setu-AI/
│
├── 🌐 frontend/                    # React + Vite application
│   └── src/
│       ├── components/             # Auth, Profile, Chat, Dashboard
│       ├── services/api.js         # API client
│       ├── locals/                 # en / hi / ta translations
│       └── firebase.js             # Firebase web config
│
├── ⚙️  backend/                    # Express.js API + Gateway
│   ├── controllers/               # AuthController, ChatController…
│   ├── routes/                    # auth, chats, translations, otp
│   ├── models/                    # User, Chat, Translation, LegalCategory
│   ├── config/firebase.js         # Firebase Admin SDK
│   ├── utils/fileProcessor.js     # PDF / DOCX / OCR utilities
│   ├── *.traineddata              # Tesseract OCR language models
│   └── server.js                  # Entry point
│
└── 🧠 ai/                         # Flask AI microservice
    ├── services/
    │   ├── ai_service.py          # Multi-model LLM with fallback chain
    │   ├── stt_service.py         # Faster-Whisper speech-to-text
    │   ├── tts_service.py         # gTTS text-to-speech
    │   └── media_service.py       # Document & image processing
    ├── routes/ai_routes.py        # /chat, /stt, /tts, /analyze-document
    ├── wmodels/                   # Pre-downloaded Whisper weights
    └── app.py                     # Flask entry point
```

<br/>

---

## 🔍 Troubleshooting

<details>
<summary><strong>Port already in use</strong></summary>

```bash
# macOS / Linux
lsof -i :5000 && kill -9 $(lsof -t -i:5000)

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```
</details>

<details>
<summary><strong>Firebase connection errors</strong></summary>

- Confirm `backend/serviceAccount.json` exists
- Verify `FIREBASE_PROJECT_ID` and `FIREBASE_CLIENT_EMAIL` in `.env`
- Ensure Firestore database is created (not just the project)
- Check that Email/Password auth is enabled in Firebase console
</details>

<details>
<summary><strong>Whisper model not loading</strong></summary>

```bash
python -c "import torch; torch.cuda.empty_cache()"
pip install --upgrade faster-whisper
```
If no GPU is available, the service will fall back to CPU mode automatically (slower but functional).
</details>

<details>
<summary><strong>CORS errors in browser</strong></summary>

Ensure your frontend origin (`http://localhost:5173`) is in the Express CORS allowlist in `backend/server.js`. Check that the `CORS` middleware runs before route registration.
</details>

<details>
<summary><strong>GPU not detected</strong></summary>

```bash
python -c "import torch; print(torch.cuda.is_available())"
python -c "import torch; print(torch.cuda.get_device_name(0))"
```
Install the correct CUDA-enabled PyTorch build from [pytorch.org](https://pytorch.org/get-started/locally/).
</details>

<br/>

---

## 🙏 Acknowledgments

| Project | Role |
|---|---|
| [OpenAI Whisper](https://github.com/openai/whisper) | Speech recognition foundation |
| [Faster-Whisper](https://github.com/SYSTRAN/faster-whisper) | Optimized inference runtime |
| [Google Gemini](https://deepmind.google/technologies/gemini/) | Primary legal AI engine |
| [OpenRouter](https://openrouter.ai) | Fallback model routing |
| [Firebase](https://firebase.google.com) | Auth, Firestore, Storage |
| [gTTS](https://pypi.org/project/gTTS/) | Text-to-speech synthesis |

<br/>

---

<div align="center">

**NyayaSetu AI** · Built with ❤️ for Justice & Accessibility

*Every citizen deserves to understand their rights.*

<br/>

[![Star this repo](https://img.shields.io/github/stars/Ragavendra0604/Nyaya-Setu-AI?style=for-the-badge&logo=github&labelColor=0d1117&color=f97316)](https://github.com/Ragavendra0604/Nyaya-Setu-AI)

</div>
