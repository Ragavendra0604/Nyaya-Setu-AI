import base64
import requests
import os
import io
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv
import google.generativeai as genai

# Load env at module level
load_dotenv()

class MediaService:
    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    executor = ThreadPoolExecutor(max_workers=3)

    @staticmethod
    def process_media(messages):
        """
        Extracts image and pdf data from messages and prepares them for the model.
        Returns (gemini_contents, full_prompt)
        """
        image_data_list = []
        pdf_data_list = []
        text_content = ""
        system_content = ""

        if isinstance(messages, list):
            for msg in messages:
                role = msg.get('role')
                msg_type = msg.get('type')
                
                if role == 'system':
                    system_content = msg.get('content', '')
                elif role == 'user':
                    if msg.get('content'):
                        text_content += msg.get('content') + "\n"
                
                if msg_type == 'image':
                    image_data_list.append(msg.get('data'))
                elif msg_type == 'pdf':
                    pdf_data_list.append(msg.get('data'))
                elif msg_type:
                    print(f"Unsupported media type ignored: {msg_type}")
        else:
            text_content = messages

        # Combine system and user text
        full_prompt = f"{system_content}\n\nUser Query: {text_content}" if system_content else text_content
        
        # Format for Gemini
        gemini_contents = []
        if text_content.strip() or system_content:
            gemini_contents.append(full_prompt)
        elif image_data_list or pdf_data_list:
            gemini_contents.append("Please analyze the attached media for legal context.")

        for img_data in image_data_list:
            try:
                if img_data:
                    gemini_contents.append({
                        'mime_type': 'image/jpeg',
                        'data': base64.b64decode(img_data)
                    })
            except Exception as e:
                print(f"Error decoding image base64: {e}")
            
        for pdf_data in pdf_data_list:
            try:
                if pdf_data:
                    gemini_contents.append({
                        'mime_type': 'application/pdf',
                        'data': base64.b64decode(pdf_data)
                    })
            except Exception as e:
                print(f"Error decoding pdf base64: {e}")

        return gemini_contents, full_prompt

    @staticmethod
    def _call_vision_model(model_id, messages):
        """Helper to call a single vision model."""
        try:
            response = requests.post(
                url="https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {MediaService.OPENROUTER_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model_id,
                    "messages": messages
                },
                timeout=20
            )
            if response.status_code == 200:
                result = response.json()
                if 'choices' in result and result['choices']:
                    content = result['choices'][0]['message']['content']
                    if content and len(content.strip()) > 15:
                        return content
            return None
        except Exception:
            return None

    @staticmethod
    def _call_gemini_vision(media_contents):
        """Direct call to Gemini 2.5 Flash for vision tasks."""
        try:
            if not MediaService.GEMINI_API_KEY or MediaService.GEMINI_API_KEY == "sk-no-key":
                return None
            
            genai.configure(api_key=MediaService.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-2.5-flash")
            
            # Build content for Gemini
            gemini_content = [
                "Extract all legal, factual, and contextual information from this media. Provide a detailed summary. If it's a legal document, identify parties, dates, and core obligations."
            ]
            
            for item in media_contents:
                if isinstance(item, dict) and 'data' in item:
                    mime_type = item.get('mime_type', 'image/jpeg')
                    gemini_content.append({
                        "mime_type": mime_type,
                        "data": item['data']
                    })
            
            response = model.generate_content(gemini_content)
            result_text = response.text.strip()
            
            if result_text and len(result_text) > 15:
                print(f"✅ Context extracted using Gemini 2.5 Flash (Native)")
                return result_text
            return None
        except Exception as e:
            print(f"⚠️ Gemini vision failed: {e}")
            return None

    @staticmethod
    def analyze_media_context(media_contents):
        """
        Uses multiple Vision models in PARALLEL to extract deep context from media.
        Tries Gemini native API first, then OpenRouter models.
        """
        if not media_contents:
            return ""
        
        # Try Gemini native API first (faster, no OpenRouter overhead)
        gemini_result = MediaService._call_gemini_vision(media_contents)
        if gemini_result:
            return gemini_result
        
        if not MediaService.OPENROUTER_API_KEY:
            return ""

        # Prepare messages for OpenRouter models
        messages = [{
            "role": "user",
            "content": [
                {"type": "text", "text": "Extract all legal, factual, and contextual information from this media. Provide a detailed summary. If it's a legal document, identify parties, dates, and core obligations."},
            ]
        }]

        has_media = False
        for item in media_contents:
            if isinstance(item, dict) and 'data' in item:
                mime_type = item.get('mime_type', 'image/jpeg')
                b64_str = base64.b64encode(item['data']).decode('utf-8')
                messages[0]["content"].append({
                    "type": "image_url",
                    "image_url": {"url": f"data:{mime_type};base64,{b64_str}"}
                })
                has_media = True

        if not has_media: 
            return ""

        # Models to try in parallel
        models = [
            "nvidia/llama-3.2-11b-vision-instruct:free",
            "microsoft/phi-3.5-vision-instruct:free"
        ]

        print(f"🔍 Parallelizing media extraction with {len(models)} OpenRouter models...")
        futures = {MediaService.executor.submit(MediaService._call_vision_model, m, messages): m for m in models}
        
        for future in as_completed(futures):
            result = future.result()
            if result:
                model_used = futures[future]
                print(f"✅ Context extracted using {model_used}")
                return result

        return ""
