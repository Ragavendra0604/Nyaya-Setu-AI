#!/usr/bin/env python3
"""Test Gemini API Key Validity"""
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

gemini_key = os.getenv("GEMINI_API_KEY")
print(f"Testing Gemini API Key: {gemini_key[:20]}...")

try:
    genai.configure(api_key=gemini_key)
    
    # Try models in order of preference
    model = None
    for model_name in ["gemini-2.0-flash", "gemini-pro", "gemini-1.5-pro"]:
        try:
            model = genai.GenerativeModel(model_name)
            print(f"Using model: {model_name}")
            break
        except:
            continue
    
    if not model:
        raise Exception("No compatible Gemini model found")
    
    # Simple test query
    response = model.generate_content("Say 'Hello, API works!'")
    print("✅ GEMINI API KEY IS VALID!")
    print(f"Response: {response.text}")
    
except Exception as e:
    print(f"❌ GEMINI API KEY ERROR: {e}")
    print(f"Error type: {type(e).__name__}")
    
    # Troubleshooting suggestions
    print("\n🔧 Troubleshooting steps:")
    print("1. Check if API key is correct in Google Cloud Console")
    print("2. Ensure 'Generative Language API' is ENABLED in your project")
    print("3. Check quotas at: https://console.cloud.google.com/apis/dashboard")
    print("4. Verify the key has 'Generative Language' permissions")
