import os
import base64
from gtts import gTTS
import tempfile

class TtsService:
    def __init__(self):
        # Mapping frontend language names to gTTS language codes
        self.lang_map = {
            "English": "en",
            "Hindi": "hi",
            "Tamil": "ta",
            "en": "en",
            "hi": "hi",
            "ta": "ta"
        }

    def text_to_speech(self, text, language="English"):
        try:
            lang_code = self.lang_map.get(language, "en")
            
            # Create a temporary file to save the speech
            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
                tts = gTTS(text=text, lang=lang_code, slow=False)
                tts.save(tmp.name)
                tmp_path = tmp.name

            # Read the file and encode to base64
            with open(tmp_path, "rb") as audio_file:
                audio_base64 = base64.b64encode(audio_file.read()).decode("utf-8")

            # Clean up
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

            return {
                "ok": True,
                "audio_data": audio_base64,
                "format": "mp3"
            }
        except Exception as e:
            print(f"TTS Error: {e}")
            return {
                "ok": False,
                "error": str(e)
            }
