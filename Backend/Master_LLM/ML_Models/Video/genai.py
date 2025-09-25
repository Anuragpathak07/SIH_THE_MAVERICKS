
import os
import json
from typing import Any, Dict
import time
from dotenv import load_dotenv
from Master_LLM.ML_Models.Video.model.inside_cave import process_video_file

# ---- Load .env ----
load_dotenv()

# ---------------- Confidence Scaling ----------------
def scale_confidence(conf: float) -> int:
    """
    Scale confidence according to piecewise rules:
    Input conf is float between 0 and 1.
    """
    actual = conf * 100
    if actual <= 40:
        scaled = actual
    elif 40 < actual <= 55:
        scaled = 40 + (actual - 40) * (90 - 40) / (55 - 40)
    elif 55 < actual <= 60:
        scaled = 90 + (actual - 55) * (95 - 90) / (60 - 55)
    else:
        scaled = 98
    return int(round(scaled))

# ---------------- Own Summarization ----------------
def summarize_predictions(predictions: Dict[str, Any]) -> Dict[str, Any]:
    """
    Summarize ML predictions and generate risk analysis.
    """
    highest_conf = 0
    for frame, preds in predictions.items():
        for p in preds:
            conf = p.get("confidence", 0)
            if conf > highest_conf:
                highest_conf = conf

    conf_scaled = scale_confidence(highest_conf)

    # Determine risk level
    if conf_scaled <= 40:
        risk = "Low"
    elif conf_scaled <= 60:
        risk = "Medium"
    elif conf_scaled <= 75:
        risk = "High"
    else:
        risk = "Critical"

    # Determine trajectory
    if conf_scaled > 70:
        trajectory = "Unstable"
    elif conf_scaled > 50:
        trajectory = "Moderate"
    else:
        trajectory = "Stable"

    # Determine rock size
    if conf_scaled > 75:
        rock_size = "Large"
    elif conf_scaled > 50:
        rock_size = "Medium"
    else:
        rock_size = "Small"

    # Recommendations
    recommendations = []
    if risk in ["Low", "Medium"]:
        recommendations.append("Continue monitoring")
        if rock_size in ["Medium", "Large"]:
            recommendations.append("Schedule inspection")
    elif risk in ["High", "Critical"]:
        recommendations.append("Immediate inspection")
        recommendations.append("Evacuate personnel if necessary")
        if trajectory == "Unstable":
            recommendations.append("Reinforce support structures")

    # Remove duplicates
    recommendations = list(dict.fromkeys(recommendations))

    return {
        "riskLevel": risk,
        "confidence": conf_scaled,
        "trajectory": trajectory,
        "rockSize": rock_size,
        "recommendations": recommendations
    }

# ---------------- Core Function ----------------
def process_video_and_summarize(video_file: Any) -> Dict[str, Any]:
    start_time = time.perf_counter()
    try:
        all_predictions = process_video_file(video_file)
    except Exception as e:
        return {"success": False, "error": f"❌ Video processing failed: {e}"}

    analysis = summarize_predictions(all_predictions)

    end_time = time.perf_counter()
    elapsed = end_time - start_time
    # print(f"\n⏱ Total processing time: {elapsed:.2f} seconds")

    return {"success": True, "analysis": analysis}

# ---------------- Example Usage ----------------
if __name__ == "__main__":
    test_video = r"C:\Users\KAIZEN\Downloads\vedio_testing\inner_cave\generated-video.mp4"
    with open(test_video, "rb") as f:
        result = process_video_and_summarize(f)

    print("\n📌 Final API Response:")
    print(json.dumps(result, indent=2))
