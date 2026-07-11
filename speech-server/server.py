"""
Local Whisper speech server for Dictater (laptop use).
Requires: pip install -r requirements.txt

Run: uvicorn server:app --host 127.0.0.1 --port 3002
"""
from __future__ import annotations

import os
import tempfile
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

MODEL_SIZE = os.environ.get("WHISPER_MODEL", "tiny")
model = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model
    try:
        from faster_whisper import WhisperModel

        device = os.environ.get("WHISPER_DEVICE", "cpu")
        compute = os.environ.get("WHISPER_COMPUTE", "int8")
        print(f"Loading Whisper model '{MODEL_SIZE}' on {device}…")
        model = WhisperModel(MODEL_SIZE, device=device, compute_type=compute)
        print("Whisper ready.")
    except Exception as exc:
        print(f"Whisper failed to load: {exc}")
        model = None
    yield


app = FastAPI(title="Dictater Whisper", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {
        "available": model is not None,
        "engine": "whisper",
        "model": MODEL_SIZE,
    }


@app.post("/transcribe")
async def transcribe(
    audio: UploadFile = File(...),
    language: str = "en",
    prompt: str = "",
):
    if model is None:
        raise HTTPException(status_code=503, detail="Whisper model not loaded")

    data = await audio.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty audio")

    suffix = ".webm"
    if audio.filename and "." in audio.filename:
        suffix = "." + audio.filename.rsplit(".", 1)[-1].lower()

    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(data)
        tmp_path = tmp.name

    try:
        segments, _info = model.transcribe(
            tmp_path,
            language=language or "en",
            beam_size=5,
            initial_prompt=prompt or None,
            vad_filter=True,
        )
        text = " ".join(s.text.strip() for s in segments).strip()
        return {"text": text, "engine": "whisper"}
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass
