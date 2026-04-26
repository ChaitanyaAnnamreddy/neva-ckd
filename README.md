# Neva — ML-Powered CKD Risk Assessment

A web application that uses machine learning to predict chronic kidney disease (CKD) risk based on patient questionnaire data and optional urine strip test results.

## Features

- **ML-Powered Predictions**: Multiple models trained and evaluated (XGBoost selected with 99% F1 score)
- **REST API Backend**: Flask server for risk prediction with SHAP explainability
- **Personalized Scores**: Real-time risk percentages (0-100%) based on patient data
- **Risk Factors**: Shows top 3 contributing factors for each prediction
- **Responsive UI**: React/Vite frontend with real-time assessment updates
- **Comprehensive Documentation**: Guides for setup, API usage, and testing

## Tech Stack

- **Frontend**: React 18 + Vite + Firebase Auth
- **Backend**: Flask + XGBoost + SHAP
- **ML Model**: XGBoost Classifier
- **Database**: Firestore (optional)
- **Dataset**: UCI Chronic Kidney Disease (400 patients, 24 features)

## Quick Start

### Prerequisites

- **Python 3.9+**
- **Node.js 16+**
- **macOS only**: `brew install libomp` (for XGBoost)

### 1. Clone Repository

```bash
git clone https://github.com/ChaitanyaAnnamreddy/neva-ckd.git
cd neva-ckd
```

### 2. Install Dependencies

```bash
# Python dependencies
pip3 install pandas numpy scikit-learn xgboost shap joblib flask flask-cors ucimlrepo

# Node dependencies
npm install
```

### 3. Configure Environment

Create `.env` file in project root:

```bash
VITE_API_URL=http://localhost:5001
```

Optional Firebase configuration (add to `.env`):
```bash
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Start Servers

**Option A: Use startup script (recommended)**
```bash
./start.sh
```

**Option B: Manual startup**

Terminal 1 — Backend API:
```bash
python3 backend.py
```

Terminal 2 — Frontend:
```bash
npm run dev
```

### 5. Open App

Visit `http://localhost:5173` in your browser.

## Usage

1. **Fill Questionnaire**
   - Age group
   - Medical conditions (diabetes, hypertension, kidney issues)
   - Lifestyle habits (exercise, water intake, smoking, alcohol)
   - Medication status

2. **Optional Urine Strip Test**
   - Protein levels
   - Glucose levels
   - Blood presence
   - Other urinalysis markers

3. **Get Risk Assessment**
   - Risk level (Low/Moderate/High)
   - Risk percentage (0-100%)
   - Top 3 contributing factors
   - Personalized recommendations

## API Documentation

### Health Check

```bash
GET http://localhost:5001/health
```

Response:
```json
{
  "status": "ok",
  "model": "XGBoost"
}
```

### Predict Risk

```bash
POST http://localhost:5001/predict
Content-Type: application/json

{
  "questionnaire": {
    "age": "45–59",
    "conditions": ["Diabetes", "High Blood Pressure"],
    "water": "<1L",
    "exercise": "Rarely",
    "habits": ["Smoking"]
  },
  "strip": {
    "protein": "Neg",
    "glucose": "Neg",
    "blood": "Neg"
  }
}
```

Response:
```json
{
  "risk_level": "moderate",
  "score": 0.523,
  "percentage": 52.3,
  "factors": ["hemo", "sc", "al"],
  "success": true
}
```

### Get Model Contract

```bash
GET http://localhost:5001/contract
```

Returns model metadata, feature list, and default values.

## Project Structure

```
neva-ckd/
├── backend.py                 # Flask API server
├── model.pkl                  # Trained XGBoost model
├── features.pkl               # Feature column order
├── contract.json              # Model metadata
├── train.py                   # Model training script
│
├── src/
│   ├── components/            # React components
│   ├── utils/                 # Utility functions
│   ├── constants/             # App constants
│   ├── firebase.js            # Firebase config
│   ├── main.jsx               # React entry point
│   └── neva-ui.jsx            # Main app component
│
├── index.html                 # HTML template
├── vite.config.js             # Vite config
├── package.json               # Node dependencies
│
├── .env.example               # Environment template
├── start.sh                   # Startup script
│
└── docs/                      # Documentation
    ├── README.md              # This file
    ├── QUICKSTART.md          # Quick setup
    ├── ML_INTEGRATION.md      # Technical details
    └── ...
```

## Development

### Run Tests

```bash
# Test API predictions
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{
    "questionnaire": {"age": "30–44", "conditions": []},
    "strip": null
  }'
```

### Retrain Model

```bash
python3 train.py
```

This will:
1. Download UCI CKD dataset
2. Clean and impute data
3. Train three models: Logistic Regression (baseline), Neural Network, and XGBoost
4. Compare performance metrics and select best model
5. Generate SHAP explanations for selected model
6. Save model, features, and contract files with all model metrics

### View Logs

```bash
# Backend logs
tail -f /tmp/backend.log

# Frontend logs
tail -f /tmp/frontend.log
```

## Model Performance

### Selected Model: XGBoost

XGBoost was selected after comparing three machine learning approaches:

| Model | F1 Score | AUC | Status |
|-------|----------|-----|--------|
| **XGBoost** | **0.9899** | **1.0000** | ✅ Selected |
| Logistic Regression | 0.9495 | 0.9820 | Baseline |
| Neural Network | 0.9412 | 0.9693 | Comparative |

**Why XGBoost?**
- Highest F1 score (0.9899) and perfect AUC (1.0)
- Best generalization on test set (80 samples)
- Faster inference time for real-time predictions
- Excellent feature importance via SHAP values
- More interpretable than neural networks

### Top Risk Factors (SHAP Importance)

1. **Hemoglobin** (2.27) — Low blood oxygen
2. **Specific Gravity** (1.30) — Urine concentration
3. **Serum Creatinine** (0.94) — Kidney function
4. **Albumin/Protein** (0.71) — Proteinuria
5. **Hypertension** (0.41) — Blood pressure

## Risk Thresholds

- **Low Risk**: < 35% probability
- **Moderate Risk**: 35-65% probability
- **High Risk**: > 65% probability

## Troubleshooting

### Backend won't start

```bash
# Check if port 5001 is in use
lsof -ti:5001 | xargs kill -9

# Restart
python3 backend.py
```

### Frontend shows blank page

1. Hard refresh: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows)
2. Check browser console for errors (F12)
3. Verify `.env` has `VITE_API_URL=http://localhost:5001`

### Model prediction errors

```bash
# Verify model files exist
ls -la model.pkl features.pkl contract.json

# If missing, retrain
python3 train.py
```

### XGBoost import error

```bash
# macOS: Install OpenMP
brew install libomp

# Then reinstall XGBoost
pip3 install --upgrade xgboost
```

## Deployment

### Production Setup

1. **Backend**: Deploy Flask server using Gunicorn
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5001 backend:app
   ```

2. **Frontend**: Build and serve static files
   ```bash
   npm run build
   # Serve dist/ folder with nginx or similar
   ```

3. **Environment**: Set production API URL
   ```bash
   export VITE_API_URL=https://api.your-domain.com
   npm run build
   ```

4. **Firebase**: Configure Firebase credentials for production

## Documentation

- **[QUICKSTART.md](QUICKSTART.md)** — 5-minute setup guide
- **[ML_INTEGRATION.md](ML_INTEGRATION.md)** — Technical architecture
- **[EXAMPLE_PREDICTIONS.md](EXAMPLE_PREDICTIONS.md)** — Real prediction examples
- **[TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)** — 29-point test suite
- **[INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md)** — Detailed overview
- **[DOCS_INDEX.md](DOCS_INDEX.md)** — Documentation map

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push and create a pull request

## License

[Your License Here]

## Support

For issues or questions, please check the documentation or open a GitHub issue.

---

**Status**: ✅ Production Ready  
**Last Updated**: April 2026  
**Model Version**: 1.0 (99% F1 Score)
