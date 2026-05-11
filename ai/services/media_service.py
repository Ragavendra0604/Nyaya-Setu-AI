import base64

class MediaService:
    @staticmethod
    def process_media(messages):
        """
        Extracts image data from messages and prepares them for the model.
        Returns (image_list, text_prompt)
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
            gemini_contents.append({
                'mime_type': 'image/jpeg',
                'data': base64.b64decode(img_data)
            })
            
        for pdf_data in pdf_data_list:
            gemini_contents.append({
                'mime_type': 'application/pdf',
                'data': base64.b64decode(pdf_data)
            })

        return gemini_contents, full_prompt

    @staticmethod
    def analyze_media_context(media_contents):
        """
        Uses a powerful Vision model to extract deep context from media.
        """
        import requests
        import os
        from dotenv import load_dotenv
        load_dotenv()
        
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            return ""

        model_id = "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free"
        
        print(f"Extracting media information with NVIDIA Nemotron ({model_id})...")
        
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Extract all legal, factual, and contextual information from this media. Provide a detailed summary for a legal assistant AI."},
                ]
            }
        ]

        for item in media_contents:
            if isinstance(item, dict) and 'data' in item:
                mime_type = item.get('mime_type', 'image/jpeg')
                import base64
                b64_str = base64.b64encode(item['data']).decode('utf-8')
                
                messages[0]["content"].append({
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:{mime_type};base64,{b64_str}"
                    }
                })

        try:
            response = requests.post(
                url="https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model_id,
                    "messages": messages
                },
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                description = result['choices'][0]['message']['content']
                print("Media context extraction complete.")
                return description
            else:
                print(f"Vision Error ({response.status_code}): {response.text}")
                return ""
                
        except Exception as e:
            print(f"Vision Exception: {e}")
            return ""
