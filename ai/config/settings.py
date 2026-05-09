import os
from dotenv import load_dotenv
from openai import OpenAI
import google.generativeai as genai

load_dotenv()

class Settings:
    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
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
        if Settings.GEMINI_API_KEY:
            genai.configure(api_key=Settings.GEMINI_API_KEY)
            gemini_model = genai.GenerativeModel("gemini-2.5-flash")
        
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
