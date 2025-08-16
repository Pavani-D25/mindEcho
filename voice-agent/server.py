# voice-agent/server.py
# AI-driven voice agent backend:
# - accepts audio or transcript
# - uses Whisper (if audio) to transcribe
# - calls Ollama (local LLM) to produce: assistant reply + structured mental-health analysis (JSON)
# - synthesizes audio (Coqui TTS)
# - saves turn to Firestore Storage (optional) + Firestore DB
# - returns assistant text + analysis + audio (url or base64)

import os, io, tempfile, time, uuid, base64, json
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydub import AudioSegment
import whisper
import requests
from langdetect import detect as lang_detect
import firebase_admin
from firebase_admin import credentials, firestore, storage
from TTS.api import TTS

# ---------------- Config (edit or set via env) ----------------
PORT = int(os.getenv("PORT", "8000"))

# Firebase service account JSON path (required to save data)
FIREBASE_CRED = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")  # e.g. ./firebase-service-account.json
FIREBASE_PROJECT = os.getenv("FIREBASE_PROJECT_ID")
FIREBASE_BUCKET = os.getenv("FIREBASE_STORAGE_BUCKET")  # e.g. your-project.appspot.com

USE_FIREBASE = bool(FIREBASE_CRED and FIREBASE_PROJECT)
BUCKET = None

# Ollama (local LLM) endpoint and model
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:7b-instruct")

# Whisper model size
WHISPER_MODEL = os.getenv("WHISPER_MODEL", "small")  # tiny, base, small, medium

# Coqui TTS model (multilingual)
TTS_MODEL = os.getenv("TTS_MODEL", "tts_models/multilingual/multi-dataset/xtts_v2")

# ---------------------------------------------------------------
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Init Firebase
if USE_FIREBASE:
    cred = credentials.Certificate(FIREBASE_CRED)
    firebase_admin.initialize_app(cred, {"storageBucket": FIREBASE_BUCKET} if FIREBASE_BUCKET else None)
    db = firestore.client()
    BUCKET = storage.bucket() if FIREBASE_BUCKET else None
else:
    db = None

# Load Whisper
print("Loading Whisper model:", WHISPER_MODEL)
whisper_model = whisper.load_model(WHISPER_MODEL)

# Load TTS
print("Loading Coqui TTS model:", TTS_MODEL)
tts = TTS(model_name=TTS_MODEL, progress_bar=False, gpu=False)

# ---------------- Helper functions ----------------

def transcribe_audio_bytes(raw_bytes: bytes):
    # normalize to wav 16k mono then transcribe
    seg = AudioSegment.from_file(io.BytesIO(raw_bytes))
    seg = seg.set_channels(1).set_frame_rate(16000)
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        seg.export(f.name, format="wav")
        tmp = f.name
    try:
        result = whisper_model.transcribe(tmp, task="transcribe")
        text = result.get("text", "").strip()
        lang = result.get("language", None)
    except Exception as e:
        print("Whisper error:", e)
        text = ""
        lang = None
    try:
        os.unlink(tmp)
    except: pass
    return text, lang

def call_ollama_for_reply_and_analysis(user_text: str, lang_code: str = "en"):
    """
    Ask the LLM for:
      - assistant reply in same language
      - structured mental-health analysis JSON
    We ask for JSON in a strict format and parse it.
    """
    # system prompt instructs role & output format
    system = (
        "You are MindEcho's multilingual, trauma-informed mental-health conversational assistant. "
        "For the provided user utterance, produce two outputs: 1) a short empathetic assistant reply in the same language as the user, "
        "and 2) a JSON object (only JSON) summarizing mental-health analysis with keys: risk (true/false), "
        "riskLevel (low/moderate/crisis), sentiment (positive/neutral/negative), sentimentScore (numeric), topics (list of strings). "
        "Important: Output MUST be a JSON object only (no extra prose), with keys exactly: 'assistantReply' and 'analysis'. "
        "analysis must be an object with fields: risk (bool), riskLevel (string), sentiment (string), sentimentScore (number), topics (array)."
    )

    prompt = f"User utterance: '''{user_text}'''\nUser language code: {lang_code}\n\nProvide the JSON response now."

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "system": system,
        "stream": False,
        "options": {"temperature": 0.3, "max_tokens": 800}
    }
    try:
        resp = requests.post(OLLAMA_URL, json=payload, timeout=120)
        resp.raise_for_status()
        data = resp.json()
        # Ollama may return 'response' or 'result' fields; attempt to extract text
        text = ""
        if isinstance(data, dict):
            text = data.get("response") or data.get("result") or data.get("text") or str(data)
        else:
            text = str(data)
        # If it's dict with 'response' as string, use that.
        if isinstance(text, dict):
            json_text = json.dumps(text)
        else:
            json_text = text if isinstance(text, str) else json.dumps(text)
        # Find first JSON object in the returned text
        start = json_text.find("{")
        end = json_text.rfind("}")
        if start != -1 and end != -1 and end > start:
            json_str = json_text[start:end+1]
            parsed = json.loads(json_str)
            assistantReply = parsed.get("assistantReply") or parsed.get("assistant") or parsed.get("assistant_reply") or ""
            analysis = parsed.get("analysis") or {}
            # Basic normalization
            analysis.setdefault("risk", bool(analysis.get("risk")))
            analysis.setdefault("riskLevel", analysis.get("riskLevel", "low"))
            analysis.setdefault("sentiment", analysis.get("sentiment", "neutral"))
            analysis.setdefault("sentimentScore", float(analysis.get("sentimentScore") or 0))
            analysis.setdefault("topics", analysis.get("topics") or [])
            return assistantReply, analysis
        else:
            # fallback: return a short reply generated from raw text
            return "Sorry, I couldn't analyze fully. Can you share more?", {"risk": False, "riskLevel": "low", "sentiment": "neutral", "sentimentScore": 0, "topics": []}
    except Exception as e:
        print("Ollama call failed:", e)
        # safe fallback
        return "Sorry, I'm having trouble thinking right now. Can you try again?", {"risk": False, "riskLevel": "low", "sentiment": "neutral", "sentimentScore": 0, "topics": []}

def synthesize_reply_to_mp3(reply_text: str, lang_code: str, out_path: str):
    try:
        # Coqui XTTS supports language parameter; if not, it will try fallback
        tts.tts_to_file(text=reply_text, file_path=out_path, speaker=None, language=lang_code)
    except Exception as e:
        print("Coqui TTS failed (retry without language):", e)
        tts.tts_to_file(text=reply_text, file_path=out_path)

def upload_file_to_storage(uid: str, session_id: str, turn_id: str, local_path: str):
    if not BUCKET:
        return None
    blob_path = f"voiceSessions/{uid}/{session_id}/{turn_id}.mp3"
    blob = BUCKET.blob(blob_path)
    blob.upload_from_filename(local_path, content_type="audio/mpeg")
    # return signed URL valid 1 hour (adjust as needed)
    url = blob.generate_signed_url(expiration=3600)
    return url

def save_turn(uid: str, session_id: str, turn_doc: dict):
    if not db:
        return
    session_ref = db.collection("users").document(uid).collection("voiceSessions").document(session_id)
    session_ref.set({"createdAt": firestore.SERVER_TIMESTAMP}, merge=True)
    turns_ref = session_ref.collection("turns")
    turns_ref.document(turn_doc["turnId"]).set(turn_doc)

# ---------------- Endpoint ----------------

@app.post("/api/voice/turn")
async def voice_turn(
    audio: Optional[UploadFile] = File(None),
    transcript: Optional[str] = Form(None),
    uid: str = Form(...),
    sessionId: str = Form(...)
):
    # 1) get user text + detect language
    user_text = ""
    detected_lang = "en"
    if audio:
        raw = await audio.read()
        user_text, detected_lang = transcribe_audio_bytes(raw)
    elif transcript:
        user_text = transcript.strip()
        try:
            detected_lang = lang_detect(user_text)
        except:
            detected_lang = "en"
    else:
        return JSONResponse({"error": "No audio or transcript provided"}, status_code=400)

    if not user_text:
        return JSONResponse({"error": "No speech detected"}, status_code=400)

    # 2) ask LLM for assistant reply + AI analysis (both generated)
    assistant_text, analysis = call_ollama_for_reply_and_analysis(user_text, lang_code=detected_lang)

    # 3) TTS generate mp3
    turn_id = str(uuid.uuid4())[:12]
    tmp_mp3 = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False)
    tmp_mp3.close()
    try:
        synthesize_reply_to_mp3(assistant_text, detected_lang, tmp_mp3.name)
        with open(tmp_mp3.name, "rb") as f:
            audio_bytes = f.read()
    except Exception as e:
        print("TTS error:", e)
        audio_bytes = None

    # 4) upload audio to storage (optional) or fallback to base64
    audio_url = None
    audio_base64 = None
    if audio_bytes:
        if BUCKET:
            try:
                audio_url = upload_file_to_storage(uid, sessionId, turn_id, tmp_mp3.name)
            except Exception as e:
                print("Upload failed:", e)
        audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
    try:
        os.unlink(tmp_mp3.name)
    except: pass

    # 5) save to firestore
    ts = int(time.time() * 1000)
    turn_doc = {
        "turnId": turn_id,
        "ts": ts,
        "lang": detected_lang,
        "userText": user_text,
        "assistantText": assistant_text,
        "analysis": analysis,
        "audioUrl": audio_url or None
    }
    try:
        save_turn(uid, sessionId, turn_doc)
    except Exception as e:
        print("Firestore save failed:", e)

    # 6) respond
    resp = {"assistantText": assistant_text, "analysis": analysis, "lang": detected_lang}
    if audio_url:
        resp["audioUrl"] = audio_url
    elif audio_base64:
        resp["audioBase64"] = audio_base64
    return JSONResponse(resp)
