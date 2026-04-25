# 04 — Backend Implementation
**Last updated**: 22 April 2026
**Update this file when**: routes change, Gemini prompt is tuned, new endpoints added, Flask config changes.
> **Living document** — update this file when anything in this section changes. Never delete; annotate or supersede. Log changes in the `## History` section at the bottom. See `MASTER_PLAN.md` for the full maintenance protocol.


---

## Stack

- Python 3.10+
- Flask (lightweight, zero config)
- joblib (model loading)
- google-generativeai (Gemini SDK)
- flask-cors (allow HTML file to call Flask locally)

```
pip install flask flask-cors joblib xgboost scikit-learn google-generativeai shap
```

---

## File Structure

```
neva-ai/
├── app.py
├── model.pkl
├── features.pkl
├── templates/
│   └── index.html
├── static/
│   └── style.css
└── requirements.txt
```

---

## app.py — Full Structure

```python
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import numpy as np
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)

# Load model once on startup
model = joblib.load('model.pkl')
feature_cols = joblib.load('features.pkl')

# Gemini setup
genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))
gemini = genai.GenerativeModel('gemini-1.5-flash')

RISK_LABELS = {0: 'low', 1: 'moderate', 2: 'high'}

def score_to_risk(prob):
    if prob < 0.35: return 'low'
    if prob < 0.65: return 'moderate'
    return 'high'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    row = [data.get(f, 0) for f in feature_cols]
    prob = float(model.predict_proba([row])[0][1])
    risk = score_to_risk(prob)

    # SHAP top factors
    import shap
    explainer = shap.TreeExplainer(model)
    sv = explainer.shap_values([row])
    import pandas as pd
    importance = pd.Series(abs(sv[0]), index=feature_cols)
    factors = importance.nlargest(3).index.tolist()

    return jsonify({'risk': risk, 'score': round(prob, 3), 'factors': factors})

@app.route('/explain', methods=['POST'])
def explain():
    data = request.json
    risk = data.get('risk', 'moderate')
    factors = data.get('factors', [])

    prompt = f"""
A user completed a kidney health screening on a mobile app in Bengaluru, India.
Risk level: {risk}
Top contributing factors: {', '.join(factors)}

Write a 3-sentence, warm, non-alarming explanation for a non-medical user in simple English.
Then give exactly 3 specific, actionable preventive tips relevant to Bengaluru's hot climate and lifestyle.
Format as: one paragraph for the explanation, then a numbered list for tips.
Keep total response under 150 words.
Do not use medical jargon. Do not say "consult a doctor" more than once.
"""
    response = gemini.generate_content(prompt)
    return jsonify({'explanation': response.text})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

---

## Routes Summary

| Method | Route | Input | Output |
|---|---|---|---|
| GET | `/` | — | Serves `index.html` |
| POST | `/predict` | JSON: form answers | `{risk, score, factors}` |
| POST | `/explain` | JSON: `{risk, factors}` | `{explanation}` |

---

## Gemini Prompt

Current prompt (v1 — tune during Phase 2):

```
A user completed a kidney health screening on a mobile app in Bengaluru, India.
Risk level: {risk}
Top contributing factors: {', '.join(factors)}

Write a 3-sentence, warm, non-alarming explanation for a non-medical user in simple English.
Then give exactly 3 specific, actionable preventive tips relevant to Bengaluru's hot climate and lifestyle.
Format as: one paragraph for the explanation, then a numbered list for tips.
Keep total response under 150 words.
Do not use medical jargon. Do not say "consult a doctor" more than once.
```

**Prompt tuning notes**: update this section as you iterate during Phase 2.
<!-- [Time] — what changed in prompt and why -->

---

## Gemini Fallback Templates

If Gemini API quota is hit or key is unavailable, return these hardcoded responses:

```python
FALLBACK_EXPLANATIONS = {
    'low': """Your kidney health indicators look reassuring right now. 
              Staying consistent with healthy habits will keep it that way.\n
              1. Drink at least 2–3 litres of water daily, especially during Bengaluru's hot months.
              2. Get a routine blood pressure and blood sugar check once a year.
              3. Limit processed foods and excess salt in your diet.""",

    'moderate': """Some factors suggest your kidneys may be under mild stress — this is a nudge to act early, not an alarm.
                   Catching this now means you have real options.\n
                   1. See a doctor for a basic kidney function test (serum creatinine + urine protein) within the next few weeks.
                   2. In Bengaluru's heat, aim for 3 litres of water daily and avoid peak outdoor hours (12–4 PM).
                   3. If you have diabetes or high BP, make sure both are well-controlled — they are the top kidney risk drivers.""",

    'high': """Several indicators suggest elevated kidney health risk. Acting now can prevent serious, costly damage later.
               Please do not ignore this result.\n
               1. Book a doctor's appointment this week and ask for a full kidney panel: serum creatinine, eGFR, urine microalbumin.
               2. Avoid painkillers like ibuprofen without medical advice — they are hard on kidneys.
               3. Track your water intake daily and aim for pale yellow urine as a hydration indicator."""
}
```

---

## Environment Variables

```bash
export GEMINI_API_KEY=your_key_here
```

Add to a `.env` file (never commit to git):
```
GEMINI_API_KEY=your_key_here
```

Load with `python-dotenv` if needed:
```python
from dotenv import load_dotenv
load_dotenv()
```

---

## History
<!-- Log changes during hackathon -->
<!-- [Time] — what changed and why -->
