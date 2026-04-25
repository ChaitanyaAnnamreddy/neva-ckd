# 08 — Implementation Spec & Troubleshooting
**Last updated**: 22 April 2026

> **Living document** — update this file when anything in this section changes. Never delete; annotate or supersede. Log changes in the `## History` section at the bottom. See `MASTER_PLAN.md` for the full maintenance protocol.

---

## Repo Structure (MVP — keep it flat)

```
neva-ai/
├── app.py                  # Flask app — all routes in one file
├── model.pkl               # Trained XGBoost model (from Colab)
├── features.pkl            # Feature column names in order (from Colab)
├── requirements.txt        # pip freeze of just what's needed
├── .env                    # GEMINI_API_KEY (gitignored)
├── .gitignore
├── templates/
│   └── index.html          # Single page — all screens in one file
├── static/
│   └── style.css           # All styles in one file
├── ml/
│   └── train.ipynb         # Colab notebook (committed for judges)
└── README.md
```

**Why flat**: one coder, 30 hours, no build step. Every file is findable in 2 seconds. 
**Do NOT** create: `src/`, `components/`, `utils/`, `config/`, `tests/`. You won't need them.

---

## requirements.txt

```
flask==3.0.0
flask-cors==4.0.0
xgboost==2.0.3
scikit-learn==1.4.0
shap==0.44.0
joblib==1.3.2
google-generativeai==0.8.0
python-dotenv==1.0.0
numpy==1.26.4
pandas==2.2.0
```

Pin versions. Don't use `>=`. You don't want a breaking update mid-hackathon.

---

## .gitignore

```
.env
__pycache__/
*.pyc
.DS_Store
venv/
```

---

## Startup sequence (on hackathon day)

```bash
# 1. Clone and enter
git clone <your-repo-url>
cd neva-ai

# 2. Virtual env (optional but recommended)
python3 -m venv venv
source venv/bin/activate

# 3. Install
pip install -r requirements.txt

# 4. Set Gemini key
echo "GEMINI_API_KEY=your_key_here" > .env

# 5. Drop model files from Colab
# Download model.pkl and features.pkl from Google Drive → root folder

# 6. Run
python app.py
# → http://localhost:5000
```

**Total setup time**: ~5 minutes on a clean machine.

---

## Known Issues + Quick Alternatives

### Issue 1: CORS errors when HTML calls Flask

**Symptom**: Browser console shows `Access-Control-Allow-Origin` error.
**Cause**: HTML opened as file, not served by Flask. Or CORS not configured.
**Fix**:
```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
```
**Make sure** you're opening `http://localhost:5000`, not the HTML file directly.

---

### Issue 2: model.pkl won't load — version mismatch

**Symptom**: `ModuleNotFoundError` or `pickle.UnpicklingError` when Flask loads model.
**Cause**: Colab had different scikit-learn/XGBoost version than local.
**Fix A**: Pin exact same versions in requirements.txt as Colab:
```python
# Run this in Colab before exporting
import sklearn, xgboost
print(f"scikit-learn=={sklearn.__version__}")
print(f"xgboost=={xgboost.__version__}")
```
**Fix B** (faster): Export model as JSON instead of pickle:
```python
# In Colab
model.save_model('model.json')

# In Flask
from xgboost import XGBClassifier
model = XGBClassifier()
model.load_model('model.json')
```
JSON export has no version dependency. Use this if pickle gives trouble.

---

### Issue 3: Gemini API returns 429 (rate limit) or 403 (key issue)

**Symptom**: `/explain` endpoint fails intermittently or always.
**Fix A**: Check key is set: `echo $GEMINI_API_KEY`
**Fix B**: Switch to fallback templates immediately — don't debug API during hackathon:
```python
@app.route('/explain', methods=['POST'])
def explain():
    data = request.json
    risk = data.get('risk', 'moderate')
    try:
        # Try Gemini
        response = gemini.generate_content(prompt)
        return jsonify({'explanation': response.text})
    except Exception as e:
        # Fallback
        return jsonify({'explanation': FALLBACK_EXPLANATIONS[risk]})
```
**Always have fallbacks loaded and tested before relying on Gemini.**

---

### Issue 4: SHAP is slow or crashes

**Symptom**: `/predict` takes 5+ seconds or crashes on TreeExplainer.
**Cause**: SHAP recalculates explanations on every request.
**Fix A**: Precompute explainer once on startup, not per request:
```python
# On startup
explainer = shap.TreeExplainer(model)

# In route — reuse
sv = explainer.shap_values([row])
```
**Fix B** (if SHAP still crashes): Use XGBoost's built-in feature importance instead:
```python
importance = model.feature_importances_
top_features = [feature_cols[i] for i in importance.argsort()[-3:][::-1]]
```
Less precise than SHAP per-prediction but instant and never crashes.

---

### Issue 5: Feature mismatch — form sends wrong shape to model

**Symptom**: `ValueError: X has N features, but model expects M`.
**Cause**: Form doesn't send all features, or sends them in wrong order.
**Fix**: Always build input from the saved feature list:
```python
feature_cols = joblib.load('features.pkl')  # exact order from training
row = [data.get(f, DEFAULT_VALUES[f]) for f in feature_cols]
```
Where `DEFAULT_VALUES` is:
```python
DEFAULT_VALUES = {
    'age': 40, 'bp': 80, 'sg': 1.015, 'al': 0, 'su': 0,
    'rbc': 1, 'pc': 1, 'pcc': 0, 'ba': 0, 'bgr': 100,
    'bu': 20, 'sc': 1.0, 'sod': 140, 'pot': 4.0, 'hemo': 13,
    'pcv': 40, 'wc': 7500, 'rc': 5, 'htn': 0, 'dm': 0,
    'cad': 0, 'appet': 1, 'pe': 0, 'ane': 0
}
```
The questionnaire only collects ~8 features. The rest use healthy defaults. This is correct for a screening tool — you don't want to assume disease.

---

### Issue 6: index.html multi-step JS breaks mid-build

**Symptom**: Question flow doesn't advance, or results screen doesn't show.
**Cause**: JS state management bug in vanilla JS (no framework to help).
**Fix**: Keep the simplest possible state machine:
```javascript
const SCREENS = ['splash', 'q-1', 'q-2', 'q-3', 'q-4', 'q-5', 'q-6', 'q-7', 'q-8', 'results', 'explanation'];
let current = 0;

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(el => el.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

function next() { current++; showScreen(SCREENS[current]); }
function back() { if (current > 0) { current--; showScreen(SCREENS[current]); } }
```
Every screen is a `<div class="screen" id="q-1">`. Only one visible at a time.
**Escape hatch**: If multi-step is too buggy, put ALL questions on one page as a normal form. Ugly but works. Style it later.

---

### Issue 7: Demo laptop runs out of battery / crashes

**Preparation**:
- Take screenshots of every screen before demo — save in `/screenshots/`
- Have the deck open on a second device (phone)
- Save the GitHub repo link somewhere outside the laptop (notes app, email to self)
- Commit + push frequently during the hackathon — every phase boundary at minimum

---

### Issue 8: Can't install packages — wifi is bad at venue

**Preparation**: Before arriving at the hackathon:
```bash
pip install -r requirements.txt  # on hotel/home wifi
pip download -r requirements.txt -d ./packages/  # offline backup
```
Then at venue if pip fails:
```bash
pip install --no-index --find-links=./packages/ -r requirements.txt
```

---

### Issue 9: Port 5000 already in use

**Symptom**: `Address already in use` when starting Flask.
**Fix**:
```bash
# Find what's using it
lsof -i :5000
# Kill it
kill -9 <PID>
# Or just use a different port
python app.py --port 5001
```
Update `fetch()` URLs in `index.html` if you change port.

---

### Issue 10: Gemini returns markdown/HTML instead of plain text

**Symptom**: Explanation shows raw `**bold**` or `## heading` in the UI.
**Fix A**: Add to prompt: `Respond in plain text only. No markdown, no formatting, no asterisks.`
**Fix B**: Strip it in Python:
```python
import re
clean = re.sub(r'[*#_`]', '', response.text)
```

---

## Deploy Options (ranked by speed)

| Option | Setup time | When to use |
|---|---|---|
| Demo locally on `localhost:5000` | 0 min | Default. Always have this working first. |
| ngrok tunnel | 2 min | Quick shareable URL for phone testing: `ngrok http 5000` |
| **Firebase Hosting + Cloud Run** | **~45 min** | **Live URL for judges. Best Google tech story. Do this after Phase 3.** |
| Railway.app | 10 min | Fallback if Firebase/Cloud Run gives trouble. |

---

## Deployment Plan: Firebase Hosting + Cloud Run

**Why this combo**: Firebase Hosting serves the static frontend (HTML/CSS/JS). Cloud Run serves the Flask API (model + Gemini). Both are Google Cloud — strong judging story. One URL, works on desktop and mobile.

**Architecture**:
```
Browser (desktop or mobile)
    │
    ▼
Firebase Hosting (static files)
    │  index.html, style.css
    │  fetch('/api/predict')  ──→  Cloud Run (Flask API)
    │  fetch('/api/explain')  ──→   model.pkl + Gemini
    ▼
https://neva-ckd.web.app
```

### Step 1: Restructure for deployment

Split the app into two parts:

```
neva-ckd/
├── frontend/                  # → Firebase Hosting
│   ├── index.html
│   ├── style.css
│   └── firebase.json
├── backend/                   # → Cloud Run
│   ├── app.py
│   ├── model.pkl
│   ├── features.pkl
│   ├── contract.json
│   ├── requirements.txt
│   └── Dockerfile
├── ml/
│   └── train.ipynb
└── README.md
```

### Step 2: Dockerize Flask for Cloud Run

Create `backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Cloud Run uses PORT env variable
CMD exec gunicorn --bind :$PORT app:app
```

Add `gunicorn` to `requirements.txt`:
```
gunicorn==21.2.0
```

### Step 3: Deploy backend to Cloud Run

```bash
cd backend

# Build and deploy (requires gcloud CLI)
gcloud run deploy neva-api \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key_here

# This gives you a URL like:
# https://neva-api-xxxxx-el.a.run.app
```

### Step 4: Update frontend API URLs

In `index.html`, change fetch URLs:
```javascript
// Local dev
// const API_BASE = 'http://localhost:5000';

// Production
const API_BASE = 'https://neva-api-xxxxx-el.a.run.app';
```

### Step 5: Deploy frontend to Firebase Hosting

```bash
cd frontend

# Init Firebase (one time)
firebase init hosting
# Select: use existing project → your Firebase project
# Public directory: .  (current folder)
# Single page app: Yes

# Deploy
firebase deploy --only hosting

# This gives you:
# https://neva-ckd.web.app
```

### Step 6: Enable CORS on Cloud Run

In `app.py`, make sure CORS allows your Firebase domain:
```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app, origins=['https://neva-ckd.web.app', 'http://localhost:5000'])
```

### What this gives you for judging

| Google tech | How it's used |
|---|---|
| Gemini 1.5 Flash API | AI-powered risk explanations |
| Google Colab | Model training |
| Cloud Run | Backend API hosting |
| Firebase Hosting | Frontend serving |
| Google Fonts | DM Serif Display typography |

That's **5 Google technologies** in one project. High-weightage judging criterion covered.

### Fallback if Cloud Run fails

If `gcloud` gives trouble or quota issues during the hackathon:
1. Use ngrok: `ngrok http 5000` → gives a public URL in 2 seconds
2. Deploy to Railway: `railway up` from the backend folder — free tier, no Docker needed
3. Demo on localhost — judges can see it works, live URL isn't mandatory

### Pre-hackathon prep for deployment

- [ ] Install `gcloud` CLI and authenticate: `gcloud auth login`
- [ ] Create a Google Cloud project (or use existing Firebase project)
- [ ] Enable Cloud Run API: `gcloud services enable run.googleapis.com`
- [ ] Enable Artifact Registry: `gcloud services enable artifactregistry.googleapis.com`
- [ ] Install Firebase CLI: `npm install -g firebase-tools && firebase login`
- [ ] Test Docker locally: `docker build -t neva-api . && docker run -p 5000:5000 neva-api`

---

## Responsive Web App (Desktop + Mobile)

Not building separate desktop/mobile apps. One responsive web app that works everywhere.

```
Desktop browser  →  https://neva-ckd.web.app  →  centered card, 420px max-width
Mobile browser   →  https://neva-ckd.web.app  →  full width, same layout
Phone home screen → "Add to Home Screen" → works like a native app (PWA-lite)
```

Key CSS for responsiveness (already in UI spec):
```css
body {
  background: #0a0f1a;
  display: flex;
  justify-content: center;
}

.app {
  width: 100%;
  max-width: 420px;
  min-height: 100vh;
}

/* On mobile it fills the screen, on desktop it's a centered phone-width card */
```

Optional: add this to `index.html` `<head>` to make it feel native on mobile:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#0a0f1a">
<meta name="apple-mobile-web-app-capable" content="yes">
<link rel="manifest" href="manifest.json">
```

---

## Pre-Hackathon Checklist

Do these before 25 April:

- [ ] Gemini API key obtained and tested: `curl` or quick Python script
- [ ] Google Colab: verify `!pip install ucimlrepo xgboost shap` works on your account
- [ ] `requirements.txt` tested locally: `pip install -r requirements.txt` completes without errors
- [ ] Git repo created (private is fine, make public before submission)
- [ ] Laptop charged, charger packed, extension board packed
- [ ] This plan downloaded / synced / accessible offline

---

## History
<!-- [Time] — what changed and why -->
