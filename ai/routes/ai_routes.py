from flask import Blueprint, request, jsonify
from controllers.ai_controller import AIController

from services.stt_service import SttService
from services.tts_service import TtsService
from config.settings import Settings

from functools import wraps

ai_bp = Blueprint('ai', __name__)
stt_service = SttService()
tts_service = TtsService()

def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        if not api_key or api_key != Settings.AI_API_KEY:
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated_function

@ai_bp.route("/", methods=["GET"])
def home():
    return jsonify({"message": "NyayaSetu AI Engine Running"}), 200

@ai_bp.route("/ask", methods=["POST"])
@require_api_key
def ask():
    try:
        data = request.get_json()
        query = data.get("query", "")
        language = data.get("language", "English")
        mode = data.get("mode", "simple")
        image_data = data.get("chat.image_data")
        pdf_data = data.get("pdf_data")
        audio_data = data.get("audio_data")

        # 1. If audio is provided, transcribe it first
        transcription_info = None
        external_steps = []
        if audio_data:
            external_steps.append("🎙️ Transcribing voice message...")
            print("🎙️ Transcribing audio input...")
            stt_result = stt_service.transcribe(audio_data)
            query = f"{query}\n\n[TRANSCRIPT]: {stt_result['text']}" if query else stt_result['text']
            transcription_info = stt_result

        if not query and not image_data and not pdf_data:
            return jsonify({"error": "Empty request: Neither query, image, pdf, nor audio provided."}), 400

        result = AIController.get_legal_guidance(query, language, mode, image_data, pdf_data)
        
        # 3. Generate TTS audio instantly (Now optimized with high-speed edge-tts)
        try:
            answer_text = result.get("answer", "")
            if answer_text:
                tts_result = tts_service.text_to_speech(answer_text, language)
                if tts_result.get("ok"):
                    result["audio_data"] = tts_result.get("audio_data")
        except Exception as tts_err:
            print(f"Inline TTS Error: {tts_err}")

        # Merge steps
        result["pipeline_steps"] = external_steps + result.get("pipeline_steps", [])
        
        if transcription_info:
            result["transcription"] = transcription_info
            
        return jsonify(result), 200

    except Exception as e:
        print(f"Ask Error: {e}")
        return jsonify({"error": str(e)}), 500

@ai_bp.route("/transcribe", methods=["POST"])
@require_api_key
def transcribe_standalone():
    try:
        data = request.get_json()
        audio_data = data.get("audio_data")
        language = data.get("language") # Optional hint
        
        if not audio_data:
            return jsonify({"error": "audio_data (base64) is required"}), 400
            
        result = stt_service.transcribe(audio_data, language=language)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ai_bp.route("/evaluate", methods=["POST"])
@require_api_key
def evaluate():
    try:
        data = request.get_json()
        user_query = data.get("user_query")
        mode = data.get("mode", "simple")
        ai_response = data.get("ai_response")

        if not user_query or not ai_response:
            return jsonify({"error": "user_query and ai_response are required"}), 400

        result = AIController.evaluate_response(user_query, mode, ai_response)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ai_bp.route("/tts", methods=["POST"])
@require_api_key
def tts():
    try:
        data = request.get_json()
        text = data.get("text")
        language = data.get("language", "English")

        if not text:
            return jsonify({"error": "text is required"}), 400

        result = tts_service.text_to_speech(text, language)
        if result["ok"]:
            return jsonify(result), 200
        else:
            return jsonify(result), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
