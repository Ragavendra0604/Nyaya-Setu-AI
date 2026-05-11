from config.settings import Settings
from services.media_service import MediaService

openrouter_client, gemini_model = Settings.init_clients()

class AIService:
    @staticmethod
    def call_ai(messages, model_preference=None):
        """Try Gemini first, then OpenRouter fallbacks."""
        gemini_contents, full_text_prompt = MediaService.process_media(messages)

        # 1. Gemini
        if gemini_model:
            try:
                print(f"Attempting query with Gemini 1.5 Flash")
                resp = gemini_model.generate_content(gemini_contents)
                return resp.text, "google/gemini-1.5-flash"
            except Exception as e:
                print(f"DEBUG: Gemini failed: {e}")

        # 2. OpenRouter fallbacks
        fallback_models = [
            "openai/gpt-oss-120b:free",
            "google/gemma-3-27b-it:free",
            "google/gemma-4-26b-a4b-it:free",
            "meta-llama/llama-3.3-70b-instruct:free",
            "inclusionai/ling-2.6-1t:free",
        ]
        
        # If a specific model was requested (e.g. from evaluate flow)
        if model_preference:
            fallback_models.insert(0, model_preference)

        for model in fallback_models:
            try:
                print(f"Attempting query with model: {model}")
                
                # Strip images for text-only fallback models as requested
                formatted_messages = []
                if isinstance(messages, list):
                    for msg in messages:
                        if msg.get('type') == 'image':
                            continue # Skip raw image data for text-only models
                        formatted_messages.append(msg)
                else:
                    formatted_messages = [{"role": "user", "content": messages}]

                resp = openrouter_client.chat.completions.create(
                    model=model,
                    messages=formatted_messages,
                    timeout=30
                )
                return resp.choices[0].message.content, model
            except Exception as e:
                print(f"DEBUG: {model} failed: {e}")
                continue

        raise RuntimeError("All AI providers unavailable")
