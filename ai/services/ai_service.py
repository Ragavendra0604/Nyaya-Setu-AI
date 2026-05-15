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
                print(f"Attempting query with Gemini 2.5 Flash")
                resp = gemini_model.generate_content(gemini_contents)
                return resp.text, "gemini-2.5-flash"
            except Exception as e:
                print(f"DEBUG: Gemini failed: {e}")

        # 2. OpenRouter fallbacks
        if not messages:
            return "I'm sorry, I received an empty request.", "system"

        total_len = sum(len(str(m.get('content', ''))) for m in messages) if isinstance(messages, list) else len(str(messages))
        print(f"DEBUG: Falling back to OpenRouter. Total Prompt Length: {total_len} chars")

        # Determine if we need vision support for fallback
        has_media = False
        if isinstance(messages, list):
            has_media = any(m.get('type') in ['image', 'pdf'] for m in messages)

        # Current reliable free/low-cost models on OpenRouter
        fallback_models = [
            "openrouter/free",
            "openai/gpt-oss-120b:free",
            "google/gemma-3-27b-it:free",
            "google/gemma-4-26b-a4b-it:free",
        ]
        
        if has_media:
            vision_models = ["nvidia/nemotron-nano-12b-vl:free", "baidu/qianfan-ocr-fast:free", "nvidia/llama-nemotron-embed-vl-1b-v2:free"]
            fallback_models = vision_models + [m for m in fallback_models if m not in vision_models]

        if model_preference:
            fallback_models.insert(0, model_preference)

        for model in fallback_models:
            try:
                print(f"Attempting query with model: {model}")
                
                # Format messages for OpenRouter (handling types and roles)
                formatted_messages = []
                if isinstance(messages, list):
                    for msg in messages:
                        # Skip raw image/pdf data for models that might not support it or if we want to save bandwidth
                        # OpenRouter usually wants image_url format, not raw binary in 'data'
                        if msg.get('type') in ['image', 'pdf']:
                            continue 
                        
                        role = msg.get('role', 'user')
                        content = msg.get('content', '')
                        if content:
                            formatted_messages.append({"role": role, "content": content})
                else:
                    formatted_messages = [{"role": "user", "content": str(messages)}]

                if not formatted_messages:
                    continue

                resp = openrouter_client.chat.completions.create(
                    model=model,
                    messages=formatted_messages,
                    timeout=35
                )
                
                if resp.choices and resp.choices[0].message.content:
                    return resp.choices[0].message.content, model
            except Exception as e:
                print(f"DEBUG: {model} failed: {e}")
                continue

        raise RuntimeError("All AI providers unavailable")

