import os
import time
import tempfile
import subprocess
import shutil
from pathlib import Path
from dataclasses import dataclass, asdict
import torch
from faster_whisper import WhisperModel
from langdetect import detect, DetectorFactory

DetectorFactory.seed = 42

class SttService:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SttService, cls).__new__(cls)
            cls._instance._init_model()
        return cls._instance

    def _init_model(self):
        print("\nAuto-detecting GPU for Whisper...")
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        if self.device == "cuda":
            torch.cuda.empty_cache()
            free_vram = torch.cuda.mem_get_info()[0] / 1e9
            print(f"Free VRAM: {free_vram:.1f} GB")
            
            if free_vram >= 6.0:
                self.model_size = "large-v3"
                self.compute_type = "float16"
            elif free_vram >= 2.0:
                self.model_size = "medium"
                self.compute_type = "float16"
            else:
                self.model_size = "small"
                self.compute_type = "int8_float16"
        else:
            print("💻 Using CPU mode for Whisper")
            self.model_size = "medium"
            self.compute_type = "int8"

        print(f"Selected Whisper Model: {self.model_size} ({self.compute_type})")
        start_load = time.time()
        
        # Initialize model
        self.whisper_model = WhisperModel(
            self.model_size,
            device=self.device,
            compute_type=self.compute_type,
            num_workers=2,
            download_root="./wmodels"
        )
        print(f"Whisper loaded in {time.time() - start_load:.1f}s")
        
        self.tmp_dir = tempfile.mkdtemp(prefix="nyaya_stt_")

    def preprocess_audio(self, input_path):
        """Converts audio to 16kHz Mono WAV for Whisper."""
        output_path = os.path.join(self.tmp_dir, f"proc_{int(time.time())}.wav")
        
        # Check if ffmpeg exists
        if not shutil.which("ffmpeg"):
            print("WARNING: ffmpeg not found. Skipping preprocessing. Transcription quality may be affected.")
            return input_path

        # Robust FFmpeg command for any input format
        cmd = [
            "ffmpeg", "-y", "-i", input_path,
            "-vn", # Disable video if present (important for webm/mp4)
            "-ar", "16000", 
            "-ac", "1", 
            "-c:a", "pcm_s16le"
        ]
        
        # Apply high-quality legal-grade denoising for voice messages
        cmd[4:4] = ["-af", "highpass=f=80,lowpass=f=8000,loudnorm=I=-16:TP=-1.5:LRA=11"]
        cmd.append(output_path)

        try:
            subprocess.run(cmd, capture_output=True, check=True)
            return output_path
        except Exception as e:
            print(f"FFmpeg failed: {e}. Using raw file.")
            return input_path

    def transcribe(self, audio_data_base64, language=None):
        """Transcribes base64 audio data."""
        import base64
        
        # Create temp file from base64
        # We use .webm as a safe default for modern browser recordings
        temp_input = os.path.join(self.tmp_dir, f"input_{int(time.time())}.webm")
        with open(temp_input, "wb") as f:
            f.write(base64.b64decode(audio_data_base64))
            
        try:
            # Preprocess
            wav_path = self.preprocess_audio(temp_input)
            
            # Transcribe
            raw_segments, info = self.whisper_model.transcribe(
                wav_path,
                language=language,
                beam_size=5,
                vad_filter=True,
                initial_prompt="Multilingual Indian legal query. English, Tamil, Hindi."
            )
            
            segments = []
            full_text = []
            for seg in raw_segments:
                segments.append({"start": seg.start, "end": seg.end, "text": seg.text.strip()})
                full_text.append(seg.text.strip())
            
            result_text = " ".join(full_text)
            
            # Clean up
            if os.path.exists(wav_path): os.remove(wav_path)
            if os.path.exists(temp_input): os.remove(temp_input)
            
            return {
                "text": result_text,
                "language": info.language,
                "language_probability": info.language_probability,
                "duration": info.duration
            }
            
        except Exception as e:
            print(f"STT Error: {e}")
            if os.path.exists(temp_input): os.remove(temp_input)
            raise e
