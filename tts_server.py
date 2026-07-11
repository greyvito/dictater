import os
import sys
import io
import json
import urllib.parse
import urllib.request
import tempfile
import wave
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn

# Port configuration
PORT = 5002

# Device configuration (Apple Silicon optimized)
def get_device():
    try:
        import torch
        if torch.backends.mps.is_available():
            return "mps"
    except ImportError:
        pass
    return "cpu"

DEVICE = get_device()

# Directories
MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
os.makedirs(MODELS_DIR, exist_ok=True)

# Helper: Download files safely
def download_file(url, dest_path, desc="file"):
    if os.path.exists(dest_path):
        return
    print(f"Downloading {desc} from {url}...")
    try:
        urllib.request.urlretrieve(url, dest_path)
        print(f"Downloaded {desc} successfully to {dest_path}")
    except Exception as e:
        print(f"Error downloading {desc}: {e}")
        raise e

# Reference Audio for F5-TTS / Chatterbox
REF_AUDIO_URL = "https://raw.githubusercontent.com/SWivid/F5-TTS/main/src/f5_tts/infer/examples/basic/basic_ref_en.wav"
REF_AUDIO_PATH = os.path.join(MODELS_DIR, "ref_audio.wav")
REF_TEXT = "Some call me nature, others call me mother nature."

# Global Engine Instances (Lazy Loaded)
global_kokoro = None
global_piper = None
global_f5 = None
global_f5_vocoder = None
global_chatterbox = None

# --- ENGINE INITIALIZERS & SYNTHESIZERS ---

def get_kokoro_mlx():
    global global_kokoro
    if global_kokoro is None:
        from kokoro_mlx import KokoroTTS
        print("Initializing kokoro-mlx on Apple Silicon...")
        global_kokoro = KokoroTTS.from_pretrained()
    return global_kokoro

def run_kokoro_mlx(text, voice, speed):
    import soundfile as sf
    tts = get_kokoro_mlx()
    # kokoro-mlx generate takes voice and speed parameters
    result = tts.generate(text, voice=voice, speed=speed)
    
    wav_io = io.BytesIO()
    sf.write(wav_io, result.audio, 24000, format='WAV', subtype='PCM_16')
    return wav_io.getvalue()

def get_piper_model():
    onnx_path = os.path.join(MODELS_DIR, "en_US-lessac-medium.onnx")
    json_path = onnx_path + ".json"
    
    download_file(
        "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/lessac/medium/en_US-lessac-medium.onnx",
        onnx_path,
        "Piper ONNX model (~15MB)"
    )
    download_file(
        "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json",
        json_path,
        "Piper model config"
    )
    return onnx_path

def get_piper():
    global global_piper
    if global_piper is None:
        from piper.voice import PiperVoice
        print("Initializing Piper TTS...")
        model_path = get_piper_model()
        global_piper = PiperVoice.load(model_path)
    return global_piper

def run_piper(text, speed):
    import numpy as np
    import soundfile as sf
    from piper.voice import SynthesisConfig
    
    voice = get_piper()
    wav_io = io.BytesIO()
    
    # Configure speed using SynthesisConfig length_scale (1.0 / speed)
    syn_config = SynthesisConfig(length_scale=1.0 / float(speed))
    
    chunks = list(voice.synthesize(text, syn_config=syn_config))
    if not chunks:
        return b""
        
    # Concatenate all float audio arrays
    audio_data = np.concatenate([chunk.audio_float_array for chunk in chunks])
    sample_rate = chunks[0].sample_rate
    
    sf.write(wav_io, audio_data, sample_rate, format='WAV', subtype='PCM_16')
    return wav_io.getvalue()

def get_f5():
    global global_f5
    if global_f5 is None:
        from f5_tts.infer.utils_infer import load_model
        from f5_tts.model import DiT
        from huggingface_hub import hf_hub_download
        print(f"Initializing F5-TTS on device: {DEVICE}...")
        
        # Download reference audio
        download_file(REF_AUDIO_URL, REF_AUDIO_PATH, "F5-TTS official English reference audio")
        
        # Download checkpoint
        ckpt_path = hf_hub_download(repo_id="SWivid/F5-TTS", filename="F5TTS_Base/model_1200000.safetensors")
        
        model_cfg = dict(dim=1024, depth=22, heads=16, ff_mult=2, text_dim=512, conv_layers=4)
        global_f5 = load_model(DiT, model_cfg, ckpt_path, device=DEVICE)
    return global_f5

def get_f5_vocoder():
    global global_f5_vocoder
    if global_f5_vocoder is None:
        from f5_tts.infer.utils_infer import load_vocoder
        print("Loading F5-TTS vocoder (vocos)...")
        global_f5_vocoder = load_vocoder(vocoder_name='vocos', device=DEVICE)
    return global_f5_vocoder

def run_f5(text, speed):
    import soundfile as sf
    from f5_tts.infer.utils_infer import infer_process
    
    model = get_f5()
    vocoder = get_f5_vocoder()
    print(f"Generating F5-TTS speech at speed={speed}...")
    audio, sr, _ = infer_process(
        ref_audio=REF_AUDIO_PATH,
        ref_text=REF_TEXT,
        gen_text=text,
        model_obj=model,
        vocoder=vocoder,
        speed=float(speed),
        device=DEVICE
    )
    
    wav_io = io.BytesIO()
    sf.write(wav_io, audio, sr, format='WAV', subtype='PCM_16')
    return wav_io.getvalue()

def get_chatterbox():
    global global_chatterbox
    if global_chatterbox is None:
        from chatterbox.tts import ChatterboxTTS
        print(f"Initializing Chatterbox TTS on device: {DEVICE}...")
        download_file(REF_AUDIO_URL, REF_AUDIO_PATH, "Chatterbox reference audio")
        global_chatterbox = ChatterboxTTS.from_pretrained(device=DEVICE)
    return global_chatterbox

def run_chatterbox(text):
    import torchaudio as ta
    tts = get_chatterbox()
    print("Generating Chatterbox speech...")
    
    # Generate audio tensor using the reference audio
    audio = tts.generate(text, audio_prompt_path=REF_AUDIO_PATH)
    
    wav_io = io.BytesIO()
    # Save torch tensor to WAV using model's sample rate
    ta.save(wav_io, audio.cpu(), sample_rate=tts.sr, format="wav")
    return wav_io.getvalue()

# --- SYSTEM CHECK AVAILABILITY ---

def check_engines():
    engines = {
        "kokoro-mlx": {"available": False, "install_cmd": "pip install kokoro-mlx soundfile mlx"},
        "piper": {"available": False, "install_cmd": "pip install piper-tts"},
        "f5-tts": {"available": False, "install_cmd": "pip install f5-tts torch torchaudio soundfile huggingface_hub"},
        "chatterbox": {"available": False, "install_cmd": "pip install chatterbox-tts torch torchaudio soundfile"}
    }
    
    # Check kokoro-mlx
    try:
        import kokoro_mlx
        import mlx.core
        engines["kokoro-mlx"]["available"] = True
    except Exception:
        pass
        
    # Check piper
    try:
        import piper
        engines["piper"]["available"] = True
    except Exception:
        pass
        
    # Check F5-TTS
    try:
        import f5_tts
        import torch
        engines["f5-tts"]["available"] = True
    except Exception:
        pass
        
    # Check Chatterbox
    try:
        import chatterbox
        import torch
        engines["chatterbox"]["available"] = True
    except Exception:
        pass
        
    return engines

# --- HTTP HANDLER ---

class TTSRequestHandler(BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        
        if parsed_url.path == '/status':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            
            engines = check_engines()
            response = {
                "status": "ok",
                "device": DEVICE,
                "engines": engines
            }
            self.wfile.write(json.dumps(response).encode('utf-8'))
            return
            
        elif parsed_url.path == '/tts':
            query = urllib.parse.parse_qs(parsed_url.query)
            text = query.get('text', [''])[0].strip()
            engine = query.get('engine', ['kokoro-mlx'])[0]
            voice = query.get('voice', ['af_heart'])[0]
            speed = float(query.get('speed', [1.0])[0])
            
            if not text:
                self.send_response(400)
                self.send_header('Content-Type', 'text/plain')
                self.end_headers()
                self.wfile.write(b"Error: 'text' parameter is required")
                return
                
            engines_status = check_engines()
            if engine not in engines_status:
                self.send_response(400)
                self.send_header('Content-Type', 'text/plain')
                self.end_headers()
                self.wfile.write(f"Error: Unknown engine '{engine}'".encode('utf-8'))
                return
                
            if not engines_status[engine]["available"]:
                self.send_response(412) # Precondition Failed
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                err_response = {
                    "error": f"Engine '{engine}' is not installed.",
                    "install_cmd": engines_status[engine]["install_cmd"]
                }
                self.wfile.write(json.dumps(err_response).encode('utf-8'))
                return
                
            try:
                print(f"Request: engine={engine}, voice={voice}, speed={speed}, text={text[:40]}...")
                
                # Execute TTS
                if engine == 'kokoro-mlx':
                    wav_data = run_kokoro_mlx(text, voice, speed)
                elif engine == 'piper':
                    wav_data = run_piper(text, speed)
                elif engine == 'f5-tts':
                    wav_data = run_f5(text, speed)
                elif engine == 'chatterbox':
                    wav_data = run_chatterbox(text)
                else:
                    raise ValueError(f"Unhandled engine {engine}")
                
                # Send WAV audio stream
                self.send_response(200)
                self.send_header('Content-Type', 'audio/wav')
                self.send_header('Content-Length', str(len(wav_data)))
                self.end_headers()
                self.wfile.write(wav_data)
                
            except Exception as e:
                import traceback
                traceback.print_exc()
                self.send_response(500)
                self.send_header('Content-Type', 'text/plain')
                self.end_headers()
                self.wfile.write(f"Inference Error: {str(e)}".encode('utf-8'))
                return
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not Found")

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    pass

def run_server():
    server_address = ('', PORT)
    httpd = ThreadedHTTPServer(server_address, TTSRequestHandler)
    print(f"\n==========================================")
    print(f"  Local TTS Server running on port {PORT}")
    print(f"  API Endpoints:")
    print(f"    - GET http://localhost:{PORT}/status  (Checks available engines)")
    print(f"    - GET http://localhost:{PORT}/tts     (Generates speech)")
    print(f"==========================================\n")
    
    # Inform availability
    status = check_engines()
    print("Engine Installation Status:")
    for eng, info in status.items():
        state = "[AVAILABLE]" if info["available"] else "[NOT INSTALLED]"
        print(f"  - {eng}: {state}")
        if not info["available"]:
            print(f"    Install with: {info['install_cmd']}")
            
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down TTS server...")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
