import os
import json
from inference_sdk import InferenceHTTPClient
from dotenv import load_dotenv
from pprint import pprint

def predict_image(image_path, workspace_name, workflow_id, env_path, conf_threshold=0.4):
    # Load .env and API key
    load_dotenv(env_path)
    api_key = os.getenv("OUTER_SURFACE_API_KEY")
    if not api_key:
        raise ValueError("❌ API key not found in .env file")

    # Initialize Roboflow client
    client = InferenceHTTPClient(
        api_url="https://serverless.roboflow.com",
        api_key=api_key
    )

    # Run prediction
    result = client.run_workflow(
        workspace_name=workspace_name,
        workflow_id=workflow_id,
        images={"image": image_path},
        use_cache=True
    )

    # Clean predictions
    cleaned_predictions = []
    for pred in result[0]["model_predictions"]["predictions"]:
        if pred.get("confidence", 0) >= conf_threshold:
            pred_copy = {k: v for k, v in pred.items() if k != "points"}
            cleaned_predictions.append(pred_copy)

   
    # print(f"\n✅ Predictions for {os.path.basename(image_path)}:")
    # pprint(cleaned_predictions)

    return cleaned_predictions

if __name__ == "__main__":
    image_path = r"D:\SIH\Backend\Master_LLM\ML_Models\Single_frame\static\WhatsApp Image 2025-08-18 at 22.57.36_d1295c29.jpg"
    env_path = r"D:\RockFall_ML-GenAI\.env"  # Change if your .env is elsewhere
    workspace_name = "asn-rvnzk"
    workflow_id = "custom-workflow"
    conf_threshold = 0.4

    predictions = predict_image(
        image_path=image_path,
        workspace_name=workspace_name,
        workflow_id=workflow_id,
        env_path=env_path,
        conf_threshold=conf_threshold
    )