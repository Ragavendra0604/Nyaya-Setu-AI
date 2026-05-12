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
            if not text or not text.strip():
                return {"ok": False, "error": "Empty text provided"}

            lang_code = self.lang_map.get(language, "en")
            print(f"Generating speech for language: {language} (code: {lang_code})")
            
            # Create a temporary file to save the speech
            # We use a context manager but close it immediately to allow gTTS to write to it on Windows
            fd, tmp_path = tempfile.mkstemp(suffix=".mp3")
            os.close(fd)
            
            try:
                tts = gTTS(text=text, lang=lang_code, slow=False)
                tts.save(tmp_path)

                # Read the file and encode to base64
                with open(tmp_path, "rb") as audio_file:
                    audio_base64 = base64.b64encode(audio_file.read()).decode("utf-8")
                
                return {
                    "ok": True,
                    "audio_data": audio_base64,
                    "format": "mp3"
                }
            finally:
                # Clean up
                if os.path.exists(tmp_path):
                    os.remove(tmp_path)
                    print(f"Temporary file {tmp_path} removed")

        except Exception as e:
            print(f"TTS Error: {e}")
            return {
                "ok": False,
                "error": str(e)
            }
