# YourScribe

**Free, AI-Powered Audio & Video Transcription Software**

No more paying ridiculous subscription fees to transcribe your media files. YourScribe does it for free, powered by OpenAI's Whisper and enhanced with Groq's AI technology.

---

## About

YourScribe is an open-source transcription platform that converts audio and video files into accurate text transcriptions. Built with modern technologies, it offers a complete pipeline: from media upload to AI-enhanced, polished transcriptions ready for use.

### Why YourScribe?

- **100% Free**: No subscriptions, no hidden fees
- **AI-Enhanced**: Automatic grammar correction and text improvement
- **Multi-Format Support**: Works with videos and audio files
- **Fast Processing**: Optimized for speed with Whisper and Groq
- **Privacy-First**: Process files locally on your machine

---

## Features

- **Video Transcription**: Support for MP4, AVI, MOV, MKV, WebM, FLV
- **Audio Transcription**: Support for MP3, WAV, M4A, AAC, OGG, FLAC, WMA
- **AI Text Enhancement**: Automatic grammar correction and text polishing with Groq
- **Smart Chunking**: Handles large files by splitting them automatically
- ~**Multi-Language**: Support for multiple languages (Portuguese, English, Spanish, etc.)~
- **Drag & Drop**: Easy file upload with drag-and-drop support

---

## Stack

### Backend
- **Python 3.8+**
- **Flask**: Web framework
- **Whisper**: OpenAI's speech recognition model
- **Groq API**: AI text enhancement
- **PyTorch**: Deep learning framework
- **FFmpeg**: Media processing

### Frontend
- **React 19+**
- **TypeScript**
- **Material-UI (MUI)**: UI component library
- **Axios**: HTTP client
- **Vite**: Build tool

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **Node.js 16+** and npm ([Download](https://nodejs.org/))
- **FFmpeg** ([Installation Guide](https://ffmpeg.org/download.html))
- **Groq API Key** ([Get it here](https://console.groq.com))
- **CUDA-capable GPU** (optional, for faster processing)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/yourscribe.git
cd yourscribe
```

### 2. Environment Variables

Create a `.env` file in the main directory.

To get your Groq API key:
1. Visit [console.groq.com](https://console.groq.com)
2. Sign up/Login
3. Navigate to API Keys
4. Create a new API key

### 3. Add your Groq API key to `.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Frontend Setup

```
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

### 5. Start Backend Server

```
# From scripts directory
python audio-transcript-api.py
```

Server will start at `http://localhost:5000`

### 6.  Start Frontend Development Server

```bash
# From frontend directory
npm run dev
```

By default, Vite runs on port 5173, but you can specify a different port by adding the `server` property and setting a new value:

```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174
  }
})
```

---

## Usage

1. **Open the Application**: Navigate to `http://localhost:5173` (or other defined port) in your browser

2. **Upload a File**: 
   - Drag and drop your audio/video file onto the upload area, or
   - Click the upload icon to select a file manually

3. **Wait for Transcription**: 
   - The file will be automatically transcribed
   - Progress will be shown in real-time

4. **View Transcription**: 
   - Once complete, the transcription appears below the upload area

5. **Improve with AI** (Optional):
   - Click the "Improve with AI" button
   - Groq's AI will correct grammar and enhance text cohesion

---

## API Endpoints

### Health Check
```http
GET /health
```
Returns server status and configuration.

**Response:**
```json
{
  "status": "online",
  "model": "base",
  "device": "cuda",
  "supported_formats": {
    "video": [".mp4", ".avi", ".mov", ".mkv", ".webm", ".flv"],
    "audio": [".mp3", ".wav", ".m4a", ".aac", ".ogg", ".flac", ".wma"]
  }
}
```

### Simple Transcription (< 15 minutes)
```http
POST /transcribe-simple
Content-Type: multipart/form-data
```

**Parameters:**
- `video` or `audio`: File to transcribe
- `language`: Language code (default: 'en')

**Response:**
```json
{
  "success": true,
  "transcription": "The transcribed text...",
  "segments": [...],
  "language": "en",
  "file_type": ".mp4"
}
```

### Full Transcription (with chunking)
```http
POST /transcribe
Content-Type: multipart/form-data
```

**Parameters:**
- `video` or `audio`: File to transcribe
- `language`: Language code (default: 'en')

**Response:**
```json
{
  "success": true,
  "transcription": "The complete transcribed text...",
  "parts": [...],
  "total_parts": 3,
  "language": "en",
  "file_type": ".mp4"
}
```

### AI Text Enhancement
```http
POST /improve-with-ia
Content-Type: application/json
```

**Request Body:**
```json
{
  "transcription": "text to improve..."
}
```

**Response:**
```json
{
  "success": true,
  "original": "text to improve...",
  "improved": "Text to improve.",
  "model": "llama-3.3-70b-versatile"
}
```

---

## Roadmap

- [ ] Add support for real-time transcription
- [ ] Implement user authentication
- [ ] Add transcription history/database
- [ ] Support for more languages
- [ ] Export transcriptions to different formats (SRT, VTT, TXT, PDF)
- [ ] Add speaker diarization
- [ ] Implement collaborative editing
- [ ] Mobile app version

---

## Author

**Raul Noronha**

- GitHub: [@raulnoronhadev](https://github.com/raulnoronhadev)
- Email: raulnoronhadev@gmail.com

---

## Acknowledgments

- [React](https://react.dev/)
- [OpenAI Whisper](https://github.com/openai/whisper) - Robust speech recognition model
- [Groq](https://groq.com) - Lightning-fast AI inference
- [Flask](https://flask.palletsprojects.com/) - Web Python framework
- [Material-UI](https://mui.com/) - React component library
- [FFmpeg](https://ffmpeg.org/) - Media processing toolkit

---

## Disclaimer

This software is provided for educational and personal use.
