import os
from dotenv import load_dotenv
from openai import OpenAI
import google.generativeai as genai

load_dotenv()
os.environ["TOKENIZERS_PARALLELISM"] = "false" # Prevent whisper/transformer warnings

class Settings:
    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    AI_API_KEY = os.getenv("AI_API_KEY")
    PORT = 5001

    @staticmethod
    def init_clients():
        # OpenRouter Client
        openrouter_client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=Settings.OPENROUTER_API_KEY or "sk-no-key",
            default_headers={
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "NyayaSetu AI",
            }
        )

        # Gemini Client
        gemini_model = None
        if Settings.GEMINI_API_KEY and Settings.GEMINI_API_KEY != "sk-no-key":
            try:
                genai.configure(api_key=Settings.GEMINI_API_KEY)
                # Try gemini-2.0-flash first, fallback to gemini-pro
                model_candidates = ["gemini-2.5-flash"]
                for model_name in model_candidates:
                    try:
                        gemini_model = genai.GenerativeModel(model_name)
                        print(f"✅ Gemini ({model_name}) client initialized.")
                        break
                    except Exception as model_err:
                        print(f"⚠️ {model_name} not available: {model_err}")
                        continue
                
                if not gemini_model:
                    print("⚠️ No Gemini models available. Will use OpenRouter fallback.")
            except Exception as e:
                print(f"⚠️ Gemini configuration failed. Using OpenRouter fallback: {e}")
        
        return openrouter_client, gemini_model

LEGAL_CONTEXT = """
You are NyayaSetu AI, a legal guidance assistant for Indian citizens.

Always include the disclaimer:
"This is not legal advice."

FIR:
- Anyone can file FIR
- Can be filed at any police station (Zero FIR)

Legal Aid:
- Free legal aid available under NALSA

Rights of Arrest:
- Must be produced before magistrate within 24 hours
"""
