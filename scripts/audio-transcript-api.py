from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import torch
import subprocess
import tempfile
import os
from pathlib import Path
from groq import Groq
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

load_dotenv()

MODEL_NAME = "base"  # "small", "medium" etc
CHUNK_LENGTH = 15 * 60  

# Extensões permitidas
ALLOWED_VIDEO_EXTENSIONS = {'.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv'}
ALLOWED_AUDIO_EXTENSIONS = {'.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac', '.wma'}
ALLOWED_EXTENSIONS = ALLOWED_VIDEO_EXTENSIONS | ALLOWED_AUDIO_EXTENSIONS

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Loading Whisper model ({MODEL_NAME}) on the device: {device}")
model = whisper.load_model(MODEL_NAME).to(device)
print("Model loaded successfully!")

def is_allowed_file(filename):
    return Path(filename).suffix.lower() in ALLOWED_EXTENSIONS

def get_media_duration(media_path):
    cmd = [
        "ffprobe", "-v", "error", "-show_entries",
        "format=duration", "-of", "default=noprint_wrappers=1:nokey=1",
        media_path
    ]
    duration = float(subprocess.check_output(cmd).decode().strip())
    return duration

def split_media(media_path, chunk_length, temp_dir):
    chunks = []
    total_duration = get_media_duration(media_path)
    
    original_ext = Path(media_path).suffix
    
    for i in range(0, int(total_duration), chunk_length):
        chunk_file = os.path.join(temp_dir, f"chunk_{i//chunk_length}{original_ext}")
        cmd = [
            "ffmpeg", "-y", "-i", media_path,
            "-ss", str(i),
            "-t", str(chunk_length),
            "-c", "copy",
            chunk_file
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        chunks.append(chunk_file)
    
    return chunks

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "model": MODEL_NAME,
        "device": device,
        "supported_formats": {
            "video": list(ALLOWED_VIDEO_EXTENSIONS),
            "audio": list(ALLOWED_AUDIO_EXTENSIONS)
        }
    })

@app.route('/transcribe', methods=['POST'])
def transcribe():
    """
    Main endpoint for media transcription (video or audio)
    Accepts 'video' or 'audio' field with the file
    """
    try:
        media_file = request.files.get('video') or request.files.get('audio')
        
        if not media_file:
            return jsonify({"error": "No file uploaded. Use 'video' or 'audio' field"}), 400
        if media_file.filename == '':
            return jsonify({"error": "Invalid filename"}), 400
        if not is_allowed_file(media_file.filename):
            return jsonify({
                "error": f"File type not supported. Allowed: {list(ALLOWED_EXTENSIONS)}"
            }), 400
        
        language = request.form.get('language', 'pt')
        
        with tempfile.TemporaryDirectory() as temp_dir:
            file_ext = Path(media_file.filename).suffix
            media_path = os.path.join(temp_dir, f"input_media{file_ext}")
            media_file.save(media_path)
            chunks = split_media(media_path, CHUNK_LENGTH, temp_dir)
            transcriptions = []
            for idx, chunk in enumerate(chunks, start=1):
                result = model.transcribe(chunk, language=language)
                transcriptions.append({
                    "part": idx,
                    "text": result["text"],
                    "segments": result.get("segments", [])
                })
            
            full_text = " ".join([t["text"] for t in transcriptions])
            
            return jsonify({
                "success": True,
                "transcription": full_text,
                "parts": transcriptions,
                "total_parts": len(transcriptions),
                "language": language,
                "file_type": file_ext
            })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/transcribe-simple', methods=['POST'])
def transcribe_simple():
    """
    Simplified endpoint for short media files (< 15 minutes)
    Accepts both video and audio files
    """
    try:
        media_file = request.files.get('video') or request.files.get('audio')
        if not media_file:
            return jsonify({"error": "No file uploaded. Use 'video' or 'audio' field"}), 400
        if media_file.filename == '':
            return jsonify({"error": "Invalid filename"}), 400 
        if not is_allowed_file(media_file.filename):
            return jsonify({
                "error": f"File type not supported. Allowed: {list(ALLOWED_EXTENSIONS)}"
            }), 400
        language = request.form.get('language', 'en')
        file_ext = Path(media_file.filename).suffix
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_file:
            media_file.save(temp_file.name)
            temp_path = temp_file.name
        try:
            result = model.transcribe(temp_path, language=language)
            
            return jsonify({
                "success": True,
                "transcription": result["text"],
                "segments": result.get("segments", []),
                "language": language,
                "file_type": file_ext
            })
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/improve-with-ia', methods=['POST'])
def improve_with_ia():
    """
    Improve the audio transcription using Groq's AI. 
    Makes the text more cohesive.
    """
    try:
        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            return jsonify({
                "success": False,
                "error": "GROQ_API_KEY not configured"
            }), 500

        TranscriptionDataJSON = request.get_json()
        if not TranscriptionDataJSON:
            return jsonify({
                "success": False,
                "error": "No JSON data provided"
            }), 400
        
        transcriptionText = TranscriptionDataJSON.get('transcription')
        if not transcriptionText or transcriptionText.strip() == "":
            return jsonify({
                "success": False,
                "error": "Transcription text is required"
            }), 400
        
        client = Groq(api_key=api_key)
        
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """You are an expert transcription editor specializing in correcting audio-to-text transcriptions.

                    Your task is to improve the transcription by:
                    1. Correcting transcription errors (misspelled words, wrong words that sound similar)
                    2. Adding proper punctuation (periods, commas, question marks, exclamation points)
                    3. Fixing grammar and sentence structure
                    4. Improving text cohesion and readability
                    5. Organizing the text into logical paragraphs when appropriate

                    CRITICAL RULES YOU MUST FOLLOW:
                    - DO NOT add new information that wasn't in the original transcription
                    - DO NOT change the meaning or intent of the original message
                    - DO NOT remove any important content
                    - DO NOT interpret or expand on ideas - only clarify what's already there
                    - ONLY fix errors and improve formatting

                    Return ONLY the corrected text without any explanations, comments, or additional notes."""
                },
                {
                    "role": "user",
                    "content": f"Transcription: {transcriptionText}"
                }
            ],
            model="llama-3.3-70b-versatile",
        )
        
        improved_text = chat_completion.choices[0].message.content
        
        print("Original:", transcriptionText[:100], "...")
        print("Improved:", improved_text[:100], "...")
        
        return jsonify({
            "success": True,
            "original": transcriptionText,
            "improved": improved_text,
            "model": "llama-3.3-70b-versatile"
        })

    except Exception as e:
        print(f"Error in improve_with_ia: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)