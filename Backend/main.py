from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import tempfile
import subprocess
import uuid
from fastapi import Query

# Chatbot , ML imports and Realtime API
from Chatbot.Chatbot import process_user_query
from Master_LLM.ML_Models.Single_frame.genai import check_frame_for_anomaly
from Master_LLM.ML_Models.Video.genai import process_video_and_summarize
from Realtime_API.Realtime_API import get_weather


app = FastAPI(title="Gemini Mine Safety Bot API")

# ---- Enable CORS ----
origins = [
    "http://localhost:8080",  # React frontend
    "http://127.0.0.1:8080",
    "https://sih-nu-liart.vercel.app",
    "https://dynamic-curio-stream.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Request/Response Models ----
class QueryRequest(BaseModel):
    user_query: str
    user_id: str

class QueryResponse(BaseModel):
    response: str

# ---- Routes ----
@app.post("/chat", response_model=QueryResponse)
async def chat_with_bot(req: QueryRequest):
    # Call your chatbot logic with the user query
    result = process_user_query(req.user_query)

    # Ensure result contains "final" text
    if isinstance(result, dict) and "final" in result:
        return QueryResponse(response=result["final"])
    elif isinstance(result, str):
        return QueryResponse(response=result)
    else:
        return QueryResponse(response="⚠️ Unexpected response format from chatbot")

# ---- Video Prediction Endpoint ----

def convert_webm_to_mp4(webm_path: str) -> str:
    """Convert WebM to MP4 using ffmpeg for OpenCV compatibility."""
    mp4_path = webm_path.replace(".webm", ".mp4")
    command = [
        "ffmpeg", "-y", "-i", webm_path, "-c:v", "libx264", "-c:a", "aac", mp4_path
    ]
    subprocess.run(command, check=True)
    return mp4_path

@app.post("/predict_vedio")
async def predict_vedio(file: UploadFile = File(...)):
    try:
        # Save uploaded video temporarily
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in [".mp4", ".webm", ".mov", ".avi"]:
            return {"success": False, "error": "Unsupported video format."}

        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            tmp.write(file.file.read())
            tmp_video_path = tmp.name

        # If WebM, convert to MP4 for OpenCV
        if ext == ".webm":
            tmp_video_path = convert_webm_to_mp4(tmp_video_path)

        # Process the video
        with open(tmp_video_path, "rb") as video_file:
            predictions = process_video_and_summarize(video_file)

        # Cleanup temp file(s)
        try:
            os.remove(tmp_video_path)
        except:
            pass

        return predictions

    except subprocess.CalledProcessError as e:
        return {"success": False, "error": f"❌ ffmpeg conversion failed: {e}"}
    except Exception as e:
        return {"success": False, "error": f"❌ Video processing failed: {e}"}

# ---- Frame Prediction Endpoint ----
@app.post("/predict_frame")
async def predict_frame(file: UploadFile = File(...)):
    try:
        # Save uploaded file temporarily
        temp_filename = f"temp_{uuid.uuid4().hex}.jpg"
        temp_path = os.path.join("temp_uploads", temp_filename)
        os.makedirs("temp_uploads", exist_ok=True)

        with open(temp_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # Run anomaly detection (returns summary dict now)
        summary = check_frame_for_anomaly(temp_path)

        # Cleanup temporary file
        os.remove(temp_path)

        return {
            "success": True,
            "data": summary  # full JSON result with riskLevel, trajectory, recommendations, etc.
        }

    except Exception as e:
        return {"success": False, "error": f"❌ Frame prediction failed: {e}"}

# ---- Real time data Endpoint ----
@app.get("/realtimedata")
async def real_time_data(lat: float = Query(None), lon: float = Query(None)):
    """
    Get current temperature and 7-day rainfall forecast.
    If lat/lon not provided, defaults to Gokul Open Pit Mine, Nagpur.
    """
    data = get_weather(lat, lon)
    return data

# ---- Curl Endpoint ----
items = ["apple", "banana", "cherry", "date"]
counter = {"index": 0}  # keep track of current index

@app.post("/curl")
async def curl():
    idx = counter["index"]

    # If counter >= length → reset to 1 (skip 0)
    if idx >= len(items):
        counter["index"] = 1
        idx = 1

    # Fetch item
    result = items[idx]

    # Increment index for next request
    counter["index"] += 1

    return {"index": idx, "value": result}

# ---- Root Endpoint ----
@app.get("/")
async def root():
    return {"message": "✅ Gemini Mine Safety Bot API is running"}

