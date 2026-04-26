# ML Model Integration — Neva AI CKD Risk Assessment

## Overview

The Neva AI app now uses a **trained XGBoost machine learning model** (instead of hardcoded rules) to predict chronic kidney disease (CKD) risk. The model was trained on the **UCI CKD dataset** with 99% F1 accuracy.

## Architecture

```
Frontend (React/Vite)
    ↓
Calls /predict endpoint
    ↓
Backend API (Flask)
    ↓
Loads trained model.pkl
    ↓
Returns risk score + top factors
    ↓
Frontend displays ML prediction (not hardcoded%)
```

## How It Works

### 1. Model Training (`train.py`)
- Downloads UCI CKD dataset (400 samples, 24 features)
- Cleans and imputes missing values
- Trains XGBoost classifier with 99% F1 score
- Generates SHAP explanations for feature importance
- Exports: `model.pkl`, `features.pkl`, `contract.json`

### 2. Backend API (`backend.py`)
- Loads trained XGBoost model
- Accepts questionnaire + strip test data via REST API
- Maps user inputs to model features
- Returns:
  - Risk level: "low" | "moderate" | "high"
  - Risk score: 0.0-1.0 (from model probability)
  - Percentage: 0-100%
  - Top 3 contributing factors (from SHAP)

### 3. Frontend Integration (`src/utils/scoreRisk.js`)
- Replaced hardcoded rule-based scoring with API calls
- Calls `POST /predict` with user data
- Fallback to rule-based scoring if API is unavailable
- Stores prediction result in sessionStorage

### 4. Results Display (`src/components/Results.jsx`)
- Shows **actual ML prediction percentage** (not hardcoded 22%/58%/85%)
- Displays top 3 factors from SHAP explanations
- Maps medical feature names to readable labels

## Setup & Running

### Prerequisites
```bash
pip3 install pandas numpy scikit-learn xgboost shap joblib flask flask-cors ucimlrepo
brew install libomp  # For XGBoost on Mac
```

### Train the Model (One-time)
```bash
python3 train.py
```
Outputs:
- `model.pkl` — trained XGBoost model
- `features.pkl` — feature column order
- `contract.json` — API contract
- `model.json` — version-safe backup

### Start Both Servers
```bash
./start.sh
```

Or manually:
```bash
# Terminal 1 — Backend API
python3 backend.py

# Terminal 2 — Frontend dev server
npm run dev
```

### URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: http://localhost:5000/health
- API contract: http://localhost:5000/contract

## API Endpoints

### Health Check
```bash
GET /health
→ {"status": "ok", "model": "XGBoost"}
```

### Predict Risk
```bash
POST /predict
Content-Type: application/json

{
  "questionnaire": {
    "age": "45–59",
    "conditions": ["Diabetes", "High Blood Pressure"],
    "appetite": "Good",
    "swelling": "no",
    "fatigue": "no"
  },
  "strip": {
    "protein": "Neg",
    "glucose": "Neg",
    "blood": "Neg"
  }
}

→ {
  "risk_level": "moderate",
  "score": 0.523,
  "percentage": 52.3,
  "factors": ["hemo", "sc", "al"],
  "thresholds": {"low": 0.35, "moderate": 0.65},
  "success": true
}
```

### Get Contract
```bash
GET /contract
→ {
  "model_status": "done",
  "model_name": "XGBoost",
  "model_f1": 0.9899,
  "features": ["age", "bp", "sg", ...],
  "feature_count": 24,
  "default_values": {...},
  "risk_thresholds": {"low": 0.35, "moderate": 0.65},
  ...
}
```

## Model Details

### Performance
- **Model**: XGBoost Classifier
- **Training Data**: UCI CKD dataset (400 samples)
- **Train/Test Split**: 80/20
- **F1 Score**: 0.9899 (99%)
- **Precision**: 0.99 | **Recall**: 0.99

### Key Features (by SHAP importance)
1. **Hemoglobin** (2.27) — low hemoglobin is a strong CKD indicator
2. **Specific Gravity** (1.30) — urine concentration
3. **Serum Creatinine** (0.94) — kidney function marker
4. **Albumin/Protein** (0.71) — proteinuria indicator
5. **Hypertension** (0.41) — major risk factor

### Risk Thresholds
- **Low Risk**: Probability < 0.35 (displayed as ~0-35%)
- **Moderate Risk**: Probability 0.35-0.65 (displayed as ~35-65%)
- **High Risk**: Probability ≥ 0.65 (displayed as ~65-100%)

## Feature Mapping

Questionnaire → Model Features:
```
Age group      → age (continuous: 25, 37, 52, 70)
Diabetes       → dm (1 = yes, 0 = no)
Hypertension   → htn (1 = yes, 0 = no)
Appetite       → appet (1 = good, 0 = poor)
Swelling       → pe (peripheral edema: 1 = yes, 0 = no)
Fatigue        → ane (anemia: 1 = yes, 0 = no)
Protein (strip) → al (albumin: 0-4 scale)
Glucose (strip) → su (sugar: 0-3 scale)
Blood (strip)   → pc (protein casts: 0-3 scale)
```

Other features (hemoglobin, creatinine, etc.) use median defaults from training data when not provided.

## Troubleshooting

### "Model file not found: model.pkl"
→ Run `python3 train.py` first

### "Failed to connect to http://localhost:5000"
→ Backend API not running. Run `python3 backend.py` in another terminal

### "XGBoost Library could not be loaded"
→ Install OpenMP: `brew install libomp`

### API returns correct risk_level but percentage = cfg.bar (22%, 58%, 85%)
→ Session storage didn't pick up the prediction. Check browser console for errors

## Deployment

### Production Setup
1. Train model on full dataset: `python3 train.py`
2. Copy `model.pkl`, `features.pkl`, `contract.json` to server
3. Run Flask in production mode:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 backend:app
   ```
4. Set `VITE_API_URL` environment variable for frontend (e.g., `https://api.neva-health.com`)

### Docker (Optional)
Create `Dockerfile` and `requirements.txt` to containerize the backend.

## Files Changed
- ✅ `train.py` — Fixed missing value handling
- ✅ `backend.py` — New Flask API server
- ✅ `src/utils/scoreRisk.js` — Now calls API instead of hardcoded rules
- ✅ `src/components/Results.jsx` — Displays real ML predictions
- ✅ `.env` & `.env.example` — API URL configuration
- ✅ `start.sh` — Startup script for both servers

## Next Steps
1. Test the full flow with the frontend
2. Fine-tune feature defaults if needed
3. Collect real user data to improve the model over time
4. Consider periodic retraining as more data arrives

---

**Model trained with**: XGBoost 2.1.4 | scikit-learn 1.6.1 | pandas 2.3.3
**API framework**: Flask 3.1.3 | CORS enabled
