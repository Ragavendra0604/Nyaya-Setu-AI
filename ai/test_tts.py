import tempfile
import os
from gtts import gTTS

try:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
        print(f"Temporary file created: {tmp.name}")
        tts = gTTS(text="Hello world", lang="en", slow=False)
        tts.save(tmp.name)
        print("Save successful")
        tmp_path = tmp.name
    
    if os.path.exists(tmp_path):
        os.remove(tmp_path)
        print("Cleanup successful")
except Exception as e:
    print(f"Error: {e}")
