"""
Neva AI — CKD Risk Prediction API
Loads trained XGBoost model and serves predictions via REST API
Run: python backend.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import json
import os
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000", "*"])

# ============================================================
# Load model and metadata
# ============================================================
MODEL_PATH = "model.pkl"
FEATURES_PATH = "features.pkl"
CONTRACT_PATH = "contract.json"

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found: {MODEL_PATH}. Run 'python train.py' first.")

model = joblib.load(MODEL_PATH)
features = joblib.load(FEATURES_PATH)

with open(CONTRACT_PATH, "r") as f:
    contract = json.load(f)

print("✅ Model loaded successfully")
print(f"   Features: {len(features)}")
print(f"   Model F1: {contract['model_f1']}")

# Default values from training
DEFAULT_VALUES = contract["default_values"]
RISK_THRESHOLDS = contract["risk_thresholds"]

# ============================================================
# Utility functions
# ============================================================
def map_questionnaire_to_model_features(questionnaire_data, strip_data):
    """Convert questionnaire answers to model feature vector."""
    row = {}

    # Map each expected feature to its value
    for feature in features:
        if feature in DEFAULT_VALUES:
            row[feature] = DEFAULT_VALUES[feature]
        else:
            row[feature] = 0

    # Map questionnaire fields to model features
    # Age groups
    age_group = questionnaire_data.get("age", "30–44")
    if age_group == "18–29":
        row["age"] = 25
    elif age_group == "30–44":
        row["age"] = 37
    elif age_group == "45–59":
        row["age"] = 52
    elif age_group == "60+":
        row["age"] = 70

    # Blood pressure (use default for now, would need actual BP input)
    row["bp"] = questionnaire_data.get("bp", DEFAULT_VALUES.get("bp", 80.0))

    # Specific gravity (use default)
    row["sg"] = questionnaire_data.get("sg", DEFAULT_VALUES.get("sg", 1.02))

    # Water intake - dehydration is a risk factor
    water_intake = questionnaire_data.get("water", "")
    if water_intake == "<1L":
        row["sg"] = 1.030  # High specific gravity indicates dehydration
    elif water_intake == "1–2L":
        row["sg"] = 1.020
    elif water_intake == "2–3L":
        row["sg"] = 1.015
    elif water_intake == "3L+":
        row["sg"] = 1.010

    # Exercise - sedentary lifestyle increases risk
    exercise = questionnaire_data.get("exercise", "")
    if exercise == "Rarely":
        row["bgr"] = 130  # Sedentary → higher glucose
    elif exercise == "1–2 times/week":
        row["bgr"] = 115
    elif exercise == "Regularly":
        row["bgr"] = 100

    # Habits - smoking and alcohol harm kidneys
    habits = questionnaire_data.get("habits", [])
    if "Smoking" in habits:
        row["bgr"] = max(row["bgr"], 125)  # Smoking linked to higher glucose
    if "Alcohol" in habits:
        row["bu"] = 50  # Alcohol → higher urea

    # Albumin (proteinuria)
    if strip_data and "protein" in strip_data:
        protein_map = {"Neg": 0, "Trace": 1, "1+": 2, "2+": 3, "3+": 4}
        row["al"] = protein_map.get(strip_data["protein"], 0)

    # Glucose
    if strip_data and "glucose" in strip_data:
        glucose_map = {"Neg": 0, "Trace": 1, "1+": 2, "2+": 3}
        row["su"] = glucose_map.get(strip_data["glucose"], 0)

    # Blood in urine
    if strip_data and "blood" in strip_data:
        blood_map = {"Neg": 0, "Trace": 1, "1+": 2, "2+": 3}
        row["pc"] = blood_map.get(strip_data["blood"], 0)

    # Blood glucose (fasting) - use default
    row["bgr"] = questionnaire_data.get("bgr", DEFAULT_VALUES.get("bgr", 121.0))

    # Blood urea - use default
    row["bu"] = questionnaire_data.get("bu", DEFAULT_VALUES.get("bu", 42.0))

    # Serum creatinine - use default (key indicator)
    row["sc"] = questionnaire_data.get("sc", DEFAULT_VALUES.get("sc", 1.3))

    # Sodium - use default
    row["sod"] = questionnaire_data.get("sod", DEFAULT_VALUES.get("sod", 138.0))

    # Potassium - use default
    row["pot"] = questionnaire_data.get("pot", DEFAULT_VALUES.get("pot", 4.4))

    # Hemoglobin - important marker
    row["hemo"] = questionnaire_data.get("hemo", DEFAULT_VALUES.get("hemo", 12.65))

    # Packed cell volume - use default
    row["pcv"] = questionnaire_data.get("pcv", DEFAULT_VALUES.get("pcv", 40.0))

    # White blood cell count - use default
    row["wbcc"] = questionnaire_data.get("wbcc", DEFAULT_VALUES.get("wbcc", 8000))

    # Red blood cell count - use default
    row["rbcc"] = questionnaire_data.get("rbcc", DEFAULT_VALUES.get("rbcc", 4))

    # Binary conditions from questionnaire
    conditions = questionnaire_data.get("conditions", [])
    row["htn"] = 1 if "High Blood Pressure" in conditions else 0
    row["dm"] = 1 if "Diabetes" in conditions else 0
    row["cad"] = 1 if "Coronary Artery Disease" in conditions else 0
    row["appet"] = 0 if questionnaire_data.get("appetite") == "Poor" else 1
    row["pe"] = 1 if questionnaire_data.get("swelling") == "yes" else 0
    row["ane"] = 1 if questionnaire_data.get("fatigue") == "yes" else 0

    # RBC (red blood cell) morphology - use default
    row["rbc"] = questionnaire_data.get("rbc", DEFAULT_VALUES.get("rbc", 1))

    # White blood cell casts
    row["wbc"] = questionnaire_data.get("wbc", DEFAULT_VALUES.get("wbc", 0))

    # Red blood cell casts
    row["rc"] = questionnaire_data.get("rc", DEFAULT_VALUES.get("rc", 0))

    # Bacteria (use default)
    row["ba"] = questionnaire_data.get("ba", DEFAULT_VALUES.get("ba", 0))

    # Pus cell casts
    row["pcc"] = questionnaire_data.get("pcc", DEFAULT_VALUES.get("pcc", 0))

    return row


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": contract["model_name"]}), 200


@app.route("/predict", methods=["POST"])
def predict():
    """
    POST /predict
    Body: {
        "questionnaire": { ... user answers ... },
        "strip": { "protein": "Neg", "glucose": "Neg", ... }  (optional)
    }
    Returns: {
        "risk_level": "low|moderate|high",
        "score": 0.22,
        "percentage": 22,
        "factors": ["hemo", "sc", "al"],
        "thresholds": { "low": 0.35, "moderate": 0.65 }
    }
    """
    try:
        data = request.json or {}
        questionnaire = data.get("questionnaire", {})
        strip = data.get("strip", None)

        # Build feature vector
        row_dict = map_questionnaire_to_model_features(questionnaire, strip)
        row_df = pd.DataFrame([row_dict])

        # Reorder columns to match training
        row_df = row_df[features]

        # Get prediction probability
        prob = float(model.predict_proba(row_df)[0][1])

        # Apply risk multipliers based on questionnaire data
        # This compensates for the fact that we're using default lab values
        risk_multiplier = 1.0

        conditions = questionnaire.get("conditions", [])
        if "Diabetes" in conditions:
            risk_multiplier *= 2.5
        if "High Blood Pressure" in conditions:
            risk_multiplier *= 2.0
        if "Kidney Issues" in conditions:
            risk_multiplier *= 3.0

        habits = questionnaire.get("habits", [])
        if "Smoking" in habits:
            risk_multiplier *= 1.8
        if "Alcohol" in habits:
            risk_multiplier *= 1.5

        water = questionnaire.get("water", "")
        if water == "<1L":
            risk_multiplier *= 1.6

        exercise = questionnaire.get("exercise", "")
        if exercise == "Rarely":
            risk_multiplier *= 1.4

        # Apply multiplier but cap at 0.99 (don't go above 99%)
        prob = min(prob * risk_multiplier, 0.99)
        percentage = round(prob * 100, 1)

        # Determine risk level
        if prob < RISK_THRESHOLDS["low"]:
            risk_level = "low"
        elif prob < RISK_THRESHOLDS["moderate"]:
            risk_level = "moderate"
        else:
            risk_level = "high"

        # Get SHAP explanations (top 3 contributing factors)
        try:
            import shap
            explainer = shap.TreeExplainer(model)
            shap_values = explainer.shap_values(row_df)
            importance = pd.Series(np.abs(shap_values[0]), index=features)
            top_factors = importance.nlargest(3).index.tolist()
        except:
            # Fallback if SHAP fails
            top_factors = features[:3]

        return jsonify({
            "risk_level": risk_level,
            "score": round(prob, 3),
            "percentage": percentage,
            "factors": top_factors,
            "thresholds": RISK_THRESHOLDS,
            "success": True
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e),
            "success": False
        }), 400


@app.route("/contract", methods=["GET"])
def get_contract():
    """Return model contract for frontend to understand expected inputs."""
    return jsonify(contract), 200


if __name__ == "__main__":
    port = 5001
    print("\n" + "=" * 50)
    print("🚀 NEVA API SERVER")
    print("=" * 50)
    print(f"Starting on http://localhost:{port}")
    print(f"Health check: GET http://localhost:{port}/health")
    print(f"Predictions: POST http://localhost:{port}/predict")
    print(f"Contract: GET http://localhost:{port}/contract")
    print("=" * 50 + "\n")

    app.run(debug=True, port=port, host="0.0.0.0")
