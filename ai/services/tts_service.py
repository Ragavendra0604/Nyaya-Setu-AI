import os
import base64
import asyncio
import edge_tts
import tempfile
from langdetect import detect, DetectorFactory
DetectorFactory.seed = 0  # For consistent results

class TtsService:
    def __init__(self):
        # Mapping frontend language names to edge-tts voice names
        self.lang_map = {
            "English": "en-IN-PrabhatNeural", # Indian English for better context
            "Hindi": "hi-IN-MadhurNeural",
            "Tamil": "ta-IN-ValluvarNeural",
            "en": "en-IN-PrabhatNeural",
            "hi": "hi-IN-MadhurNeural",
            "ta": "ta-IN-ValluvarNeural"
        }

    async def _generate_audio(self, text, voice, tmp_path):
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(tmp_path)

    def text_to_speech(self, text, language="English"):
        try:
            if not text or not text.strip():
                return {"ok": False, "error": "Empty text provided"}

            # Auto-detect language
            try:
                detected_lang = detect(text)
                if detected_lang in ["hi", "ta", "en"]:
                    lang_code = detected_lang
                else:
                    lang_code = self.lang_map.get(language, "en")
            except:
                lang_code = self.lang_map.get(language, "en")

            voice = self.lang_map.get(lang_code, self.lang_map["en"])
            print(f"Generating edge-tts speech with voice: {voice}")
            
            fd, tmp_path = tempfile.mkstemp(suffix=".mp3")
            os.close(fd)
            
            try:
                # Run async audio generation in a synchronous wrapper
                asyncio.run(self._generate_audio(text, voice, tmp_path))

                with open(tmp_path, "rb") as audio_file:
                    audio_base64 = base64.b64encode(audio_file.read()).decode("utf-8")
                
                return {
                    "ok": True,
                    "audio_data": audio_base64,
                    "format": "mp3"
                }
            finally:
                if os.path.exists(tmp_path):
                    os.remove(tmp_path)
        except Exception as e:
            print(f"TTS Error: {e}")
            return {"ok": False, "error": str(e)}
