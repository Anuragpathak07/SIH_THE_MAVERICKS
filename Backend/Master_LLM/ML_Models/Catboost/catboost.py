import os
from catboost import CatBoostClassifier
import pandas as pd
import joblib

def predict_slope_stability(
    height, cohesion, friction_angle, unit_weight, slope_angle,
    water_depth_ratio, rainfall_mm_7d, temperature_c, vibrations_ms2
):
    # Determine absolute path to model file
    base_dir = os.path.dirname(__file__)  # Catboost folder
    model_path = os.path.join(base_dir, "slope_stability_catboost.cbm")
    le_path = os.path.join(base_dir, "label_encoder.pkl")

    # Load model
    cat_model = CatBoostClassifier()
    cat_model.load_model(model_path)

    # Load LabelEncoder if exists
    try:
        le = joblib.load(le_path)
    except:
        le = None

    # Prepare input
    user_df = pd.DataFrame([{
        "height": height,
        "cohesion": cohesion,
        "friction_angle": friction_angle,
        "unit_weight": unit_weight,
        "slope_angle": slope_angle,
        "water_depth_ratio": water_depth_ratio,
        "rainfall_mm_7d": rainfall_mm_7d,
        "temperature_c": temperature_c,
        "vibrations_ms2": vibrations_ms2
    }])

    # Predict
    prediction_encoded = cat_model.predict(user_df)
    prediction_proba = cat_model.predict_proba(user_df).tolist()

    if le:
        prediction_label = le.inverse_transform(prediction_encoded)[0]
    else:
        prediction_label = int(prediction_encoded[0])

    return {
        "prediction_label": prediction_label,
        "prediction_encoded": int(prediction_encoded[0]),
        "probabilities": prediction_proba
    }
