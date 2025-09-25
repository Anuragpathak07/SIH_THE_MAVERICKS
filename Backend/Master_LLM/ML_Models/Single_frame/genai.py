# D:\SIH\Backend\Master_LLM\ML_Models\Single_frame\genai.py

import sys
import os

# Ensure Single_frame is in path
sys.path.append(os.path.dirname(__file__))

from model.outer_surface import predict_image  # now it will work

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
def summarize_predictions(predictions):
    """
    Summarize ML predictions and generate risk analysis.
    Input: list of prediction dicts from Roboflow
    Output: dict with risk assessment
    """
    highest_conf = 0
    for p in predictions:
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


# ---------------- Frame Anomaly Check ----------------
def check_frame_for_anomaly(image_path):
    workspace_name = "asn-rvnzk"
    workflow_id = "custom-workflow"
    env_path = r"D:\RockFall_ML-GenAI\.env"

    # Get raw predictions (no threshold filtering)
    predictions = predict_image(
        image_path=image_path,
        workspace_name=workspace_name,
        workflow_id=workflow_id,
        env_path=env_path
    )

    # Summarize predictions
    summary = summarize_predictions(predictions)

    # Add True/False anomaly flag based on risk level
    summary["is_anomalous"] = summary["riskLevel"] in ["High", "Critical"]

    return summary


# ---------------- Example Usage ----------------
if __name__ == "__main__":
    image_path = r"D:\SIH\Backend\Master_LLM\ML_Models\Single_frame\static\WhatsApp Image 2025-08-18 at 22.57.36_d1295c29.jpg"
    result = check_frame_for_anomaly(image_path)
    print(result)
    if result["is_anomalous"]:
        print("🚨 Anomaly Detected!")
    else:
        print("✅ Frame is normal")
