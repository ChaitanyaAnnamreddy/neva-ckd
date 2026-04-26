# Quick Start — Neva AI with ML Model

## What Changed?

The app now uses a **real XGBoost ML model** instead of hardcoded rules:
- ❌ Old: Risk score was hardcoded as 22%, 58%, or 85%
- ✅ New: Risk score comes from ML model prediction (0-100%)

## One-Time Setup

```bash
# 1. Install Python dependencies
pip3 install pandas numpy scikit-learn xgboost shap joblib flask flask-cors ucimlrepo
brew install libomp  # Mac only

# 2. Train the model (creates model.pkl)
python3 train.py

# 3. Install Node dependencies
npm install
```

## Run the App

### Option A: Use the startup script (easiest)
```bash
./start.sh
```
This starts both the backend API and frontend dev server.

### Option B: Manually start both
```bash
# Terminal 1 — Backend API (port 5000)
python3 backend.py

# Terminal 2 — Frontend (port 5173)
npm run dev
```

Then open: **http://localhost:5173**

## How the ML Integration Works

1. **You fill out the questionnaire** (age, conditions, symptoms)
2. **Frontend calls the API**: `POST http://localhost:5000/predict`
3. **Backend loads the trained XGBoost model** and runs prediction
4. **Returns actual risk percentage** (e.g., 34%, 56%, 72%)
5. **Frontend displays the ML prediction** instead of hardcoded value

### Example API Response
```json
{
  "risk_level": "moderate",
  "score": 0.567,
  "percentage": 56.7,
  "factors": ["hemoglobin", "creatinine", "protein"],
  "success": true
}
```

## Key Files

| File | Purpose |
|------|---------|
| `train.py` | Trains XGBoost model on UCI CKD dataset |
| `backend.py` | Flask API that loads model and serves predictions |
| `model.pkl` | Trained XGBoost model (created by train.py) |
| `features.pkl` | Feature column order (created by train.py) |
| `contract.json` | Model metadata & defaults (created by train.py) |
| `src/utils/scoreRisk.js` | Calls backend API (was hardcoded rules) |
| `src/components/Results.jsx` | Shows real ML predictions (was hardcoded %) |
| `.env` | Tells frontend where the API is |

## Verify It's Working

### Check backend health
```bash
curl http://localhost:5000/health
# Should return: {"status":"ok","model":"XGBoost"}
```

### Get model info
```bash
curl http://localhost:5000/contract | jq .
```

### Send a test prediction
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "questionnaire": {"age": "45–59", "conditions": ["Diabetes"]},
    "strip": {"protein": "Neg"}
  }'
```

## What the ML Model Does

- **Input**: 24 health features (age, hemoglobin, creatinine, protein, etc.)
- **Output**: Probability of CKD (0-100%)
- **Accuracy**: 99% F1 score on test data
- **Top factors**: Hemoglobin, Creatinine, Protein in urine

## Troubleshooting

### Backend won't start
```
Error: "Model file not found: model.pkl"
→ Run: python3 train.py
```

### Frontend shows hardcoded percentage (22%, 58%, 85%)
→ Backend API not running or not responding
→ Check: `curl http://localhost:5000/health`

### Port already in use
```
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### CORS errors
→ Backend already includes CORS headers for localhost
→ Make sure `VITE_API_URL=http://localhost:5000` in `.env`

## Next Steps

1. Test the full flow in the frontend
2. Verify risk scores change based on your answers
3. Check that top factors match what you expect
4. See `ML_INTEGRATION.md` for detailed documentation

---

**Ready to test?** Run `./start.sh` and go to http://localhost:5173 🚀
