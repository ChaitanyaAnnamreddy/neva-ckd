# 09 — Sub-Agent System
**Last updated**: 22 April 2026

> **Living document** — update this file when anything in this section changes. Never delete; annotate or supersede. Log changes in the `## History` section at the bottom. See `MASTER_PLAN.md` for the full maintenance protocol.

---

## How It Works

You can run this two ways:

**Multi-agent (faster):** 3 Claude windows open simultaneously, each with its own prompt. They work in parallel through shared files.

**Single-agent (simpler):** One Claude window. Copy-paste the relevant agent prompt when switching phases. Same checklists, same contract.json, just sequential instead of parallel.

Both work. The checklists and contract.json spec are useful either way — they prevent scope creep and keep handoffs clean between phases even if it's all in one chat.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Agent: ML  │     │ Agent: Back  │     │ Agent: Front │
│  (Colab)    │     │  (Flask)     │     │  (HTML/JS)   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       ▼                   ▼                   ▼
   model.pkl          app.py              index.html
   features.pkl       /predict API        style.css
   contract.json      /explain API        
       │                   │                   │
       └───────────────────┴───────────────────┘
                           │
                    Shared repo folder
                    + contract.json
```

---

## Communication Protocol

Agents don't talk to each other. They read/write shared files.

### The contract file: `contract.json`

This is the single source of truth between agents. ML agent writes it. Backend reads it. Frontend reads it.

```json
{
  "model_status": "not_started",
  "features": [],
  "feature_count": 0,
  "default_values": {},
  "risk_thresholds": { "low": 0.35, "moderate": 0.65 },
  "sample_request": {},
  "sample_response": {},
  "api_routes": {
    "predict": { "method": "POST", "path": "/predict", "status": "not_started" },
    "explain": { "method": "POST", "path": "/explain", "status": "not_started" }
  },
  "last_updated_by": "",
  "last_updated_at": ""
}
```

### Update flow

| When | Who updates `contract.json` | What changes |
|---|---|---|
| Model trained | ML agent | `features`, `feature_count`, `default_values`, `sample_request`, `sample_response`, `model_status: "done"` |
| API built | Backend agent | `api_routes[*].status: "live"` |
| Feature mapping changes | ML agent | `features`, `default_values` |

### Rules
- Only one agent writes at a time
- Always update `last_updated_by` and `last_updated_at`
- Other agents read before starting their work
- If contract is missing or `model_status: "not_started"`, backend/frontend use hardcoded defaults (provided in their prompts)

---

## Agent 1: ML Agent

**When to open**: Hour 0 (start of hackathon)
**When done**: model.pkl + features.pkl + contract.json written
**Platform**: Google Colab chat / Claude window

### Prompt (copy-paste this into a new Claude chat)

```
You are the ML agent for the Neva AI hackathon project — a kidney disease risk screening app.

YOUR JOB: Train an XGBoost model on the UCI CKD dataset and export it. Nothing else.

CONTEXT:
- Dataset: UCI CKD (id=336), 400 rows, 25 features, binary label (ckd/notckd)
- Primary model: XGBoost. Also train Logistic Regression as baseline.
- Target: F1 > 0.96
- Platform: Google Colab

STEPS (do these in order, check each off):
- [ ] pip install ucimlrepo xgboost scikit-learn shap joblib pandas
- [ ] Load UCI CKD: fetch_ucirepo(id=336)
- [ ] Clean: drop columns with >40% missing, impute rest (median/mode), encode yes/no→1/0
- [ ] Split: 80/20 train/test, random_state=42
- [ ] Train LogisticRegression(max_iter=1000), print classification_report
- [ ] Train XGBClassifier(n_estimators=100, max_depth=4), print classification_report
- [ ] Pick winner (likely XGBoost), save with joblib: model.pkl + features.pkl (column name list)
- [ ] Create contract.json with: feature names, default values for all features, sample request/response
- [ ] Test: manually predict with a fake "high risk" input and a fake "low risk" input

OUTPUT FILES (download all 3):
1. model.pkl — the trained model
2. features.pkl — list of feature column names in exact order
3. contract.json — the API contract (see format below)

contract.json format:
{
  "model_status": "done",
  "features": ["age", "bp", ...],
  "feature_count": N,
  "default_values": {"age": 40, "bp": 80, ...},
  "risk_thresholds": {"low": 0.35, "moderate": 0.65},
  "sample_request": {"age": 60, "dm": 1, "htn": 1, ...},
  "sample_response": {"risk": "high", "score": 0.91, "factors": ["al", "sc", "hemo"]}
}

Default values should be HEALTHY defaults — assume no disease unless the user says otherwise.

DO NOT: build Flask, build UI, tune Gemini prompts, or work on anything outside model training.
When done, tell me "ML DONE — download model.pkl, features.pkl, contract.json from Colab files."
```

---

## Agent 2: Backend Agent

**When to open**: After ML agent delivers model.pkl (or immediately with hardcoded defaults)
**When done**: Flask app running, /predict and /explain both return correct JSON
**Platform**: Claude chat window or terminal

### Prompt (copy-paste this into a new Claude chat)

```
You are the Backend agent for the Neva AI hackathon project — a kidney disease risk screening app.

YOUR JOB: Build a Flask app with two POST routes: /predict and /explain. Nothing else.

CONTEXT:
- Flask app serves index.html and handles API calls
- Model: XGBoost saved as model.pkl, features in features.pkl
- Gemini API for /explain (key is in .env as GEMINI_API_KEY)
- Read contract.json for feature names, defaults, and sample I/O

STEPS (do these in order, check each off):
- [ ] Create app.py with Flask + CORS
- [ ] Load model.pkl and features.pkl on startup
- [ ] Read contract.json for DEFAULT_VALUES and feature list
- [ ] POST /predict: accept JSON body, build feature row using defaults for missing features, return {risk, score, factors}
- [ ] SHAP explainer created once on startup (not per request), top 3 factors per prediction
- [ ] Fallback: if SHAP crashes, use model.feature_importances_ instead
- [ ] POST /explain: call Gemini with risk + factors, return {explanation}
- [ ] Fallback: if Gemini fails, return hardcoded template
- [ ] GET / serves templates/index.html
- [ ] Test both routes with curl or Postman
- [ ] Create requirements.txt with pinned versions

GEMINI PROMPT (use this exactly):
"""
A user completed a kidney health screening on a mobile app in Bengaluru, India.
Risk level: {risk_level}
Top contributing factors: {', '.join(factors)}

Write a 3-sentence, warm, non-alarming explanation for a non-medical user in simple English.
Then give exactly 3 specific, actionable preventive tips relevant to Bengaluru's hot climate and lifestyle.
Format as: one paragraph for the explanation, then a numbered list for tips.
Keep total response under 150 words.
Do not use medical jargon. Do not say "consult a doctor" more than once.
Respond in plain text only. No markdown, no formatting, no asterisks.
"""

FALLBACK EXPLANATIONS (use if Gemini fails):
low: "Your kidney health indicators look reassuring right now. Staying consistent with healthy habits will keep it that way. 1. Drink at least 2-3 litres of water daily, especially during Bengaluru's hot months. 2. Get a routine blood pressure and blood sugar check once a year. 3. Limit processed foods and excess salt in your diet."
moderate: "Some factors suggest your kidneys may be under mild stress. Catching this now means you have real options. 1. See a doctor for a basic kidney function test within the next few weeks. 2. In Bengaluru's heat, aim for 3 litres of water daily and avoid peak outdoor hours. 3. If you have diabetes or high BP, make sure both are well-controlled."
high: "Several indicators suggest elevated kidney health risk. Acting now can prevent serious, costly damage later. 1. Book a doctor's appointment this week and ask for a full kidney panel. 2. Avoid painkillers like ibuprofen without medical advice. 3. Track your water intake daily and aim for pale yellow urine."

RISK THRESHOLDS:
- score < 0.35 → "low"
- 0.35 ≤ score < 0.65 → "moderate"  
- score ≥ 0.65 → "high"

IF contract.json IS NOT READY YET, use these hardcoded defaults:
{"age": 40, "bp": 80, "sg": 1.015, "al": 0, "su": 0, "rbc": 1, "pc": 1, "pcc": 0, "ba": 0, "bgr": 100, "bu": 20, "sc": 1.0, "sod": 140, "pot": 4.0, "hemo": 13, "pcv": 40, "wc": 7500, "rc": 5, "htn": 0, "dm": 0, "cad": 0, "appet": 1, "pe": 0, "ane": 0}

DO NOT: train models, build UI, create CSS, write the pitch.
When done, tell me "BACKEND DONE — run python app.py, test /predict and /explain."
```

---

## Agent 3: Frontend Agent

**When to open**: After backend is running (or immediately building static UI)
**When done**: index.html shows all screens, calls Flask API, displays results
**Platform**: Claude chat window

### Prompt (copy-paste this into a new Claude chat)

```
You are the Frontend agent for the Neva AI hackathon project — a kidney disease risk screening app.

YOUR JOB: Build a single index.html file with all screens. Nothing else.

CONTEXT:
- Plain HTML + CSS + vanilla JS. No React, no npm, no build step.
- File: templates/index.html (served by Flask)
- Styles: static/style.css
- Calls Flask at http://localhost:5000/predict and /explain
- Read contract.json for feature names and sample I/O to know what to send/receive

SCREENS (all in one HTML file, show/hide with JS):
1. Splash — "Neva" heading, stat pills, CTA button
2. Questionnaire — 8 questions, one at a time, progress bar
3. Results — risk badge, score bar, contributing factors
4. Explanation — Gemini output with numbered tips + disclaimer

QUESTIONS:
1. Age group: 18-29 / 30-44 / 45-59 / 60+
2. History of diabetes? Yes / No
3. High blood pressure? Yes / No
4. Daily water intake: < 1L / 1-2L / 2-3L / 3L+
5. Outdoor heat exposure: Rarely / 1-2 hrs/day / 3-5 hrs/day / 5+ hrs/day
6. Ankle or foot swelling? Yes / No
7. Frequent fatigue? Yes / No
8. Appetite recently? Good / Reduced / Poor

ANSWER → MODEL FEATURE ENCODING:
{
  age: "18-29"→25, "30-44"→37, "45-59"→52, "60+"→65,
  diabetes: "yes"→dm:1, "no"→dm:0,
  htn: "yes"→htn:1, "no"→htn:0,
  hydration: not sent to model (contextual only),
  heat: not sent to model (contextual only),
  swelling: "yes"→pe:1, "no"→pe:0,
  fatigue: "yes"→ane:1, "no"→ane:0,
  appetite: "Good"→appet:1, "Reduced"→appet:0, "Poor"→appet:0
}
All other model features use defaults from contract.json or:
{"bp":80,"sg":1.015,"al":0,"su":0,"rbc":1,"pc":1,"pcc":0,"ba":0,"bgr":100,"bu":20,"sc":1.0,"sod":140,"pot":4.0,"hemo":13,"pcv":40,"wc":7500,"rc":5,"cad":0}

API CALLS:
POST /predict → send all features → receive {risk, score, factors}
POST /explain → send {risk, factors} → receive {explanation}

DESIGN TOKENS:
--bg: #0a0f1a
--card: #111827
--border: #1e293b
--teal: #14b8a6
--teal-glow: rgba(20,184,166,0.15)
--text: #f1f5f9
--muted: #64748b
--low: #22c55e
--moderate: #f59e0b
--high: #ef4444
Font: 'DM Serif Display' for headings (load from Google Fonts), system-ui for body
Max-width: 420px, centered

STEPS (check each off):
- [ ] Create templates/index.html with all 4 screen divs
- [ ] Create static/style.css with design tokens
- [ ] Splash screen with stat pills + CTA
- [ ] Questionnaire: show/hide one question at a time, progress bar, back button
- [ ] On last question submit: POST /predict, show loading spinner
- [ ] Results screen: risk badge, animated score bar, factor chips
- [ ] After results load: POST /explain, show loading
- [ ] Explanation screen: Gemini text + numbered tips + disclaimer
- [ ] Test full flow end-to-end

ESCAPE HATCHES:
- If multi-step JS is buggy: put all questions on one page as a normal form. Style it later.
- If API calls fail: show error message with "try again" button, don't crash the page.
- If score bar animation is glitchy: skip animation, show static bar.

DO NOT: train models, modify app.py, write the pitch, add Firebase.
When done, tell me "FRONTEND DONE — open http://localhost:5000 and test full flow."
```

---

## Coordination Workflow

### Phase 1 (Hour 0–4): ML + setup
```
You:      Create repo, folder structure, .gitignore, requirements.txt
Agent ML: Open Colab, paste prompt, run notebook
Output:   model.pkl, features.pkl, contract.json → download to repo root
```

### Phase 2 (Hour 4–7): Backend + Frontend start in parallel
```
Agent Backend: Paste prompt, build app.py using contract.json
Agent Frontend: Paste prompt, build index.html + style.css (can start with static UI before API is ready)
You:           Review both, test, commit
```

### Phase 3 (Hour 7–10): Integration + polish
```
Agent Frontend: Wire up fetch() calls to live Flask
You:            Test end-to-end, fix bugs
Agent Frontend: Polish styling, animations
You:            Commit working version — this is your safety checkpoint
```

---

## Handoff Files

| File | Written by | Read by | Purpose |
|---|---|---|---|
| `contract.json` | ML agent | Backend + Frontend | Feature list, defaults, sample I/O, risk thresholds |
| `model.pkl` | ML agent | Backend | Trained model |
| `features.pkl` | ML agent | Backend | Feature column order |
| `app.py` | Backend agent | Frontend (knows the API shape) | Flask routes |
| `index.html` | Frontend agent | You (review) | All UI screens |
| `style.css` | Frontend agent | You (review) | All styles |

---

## If An Agent Goes Off Track

Signs:
- Starts building things outside its scope (ML agent making Flask routes)
- Asks too many questions instead of using defaults
- Overengineers (adds auth, adds database, adds error tracking)

Fix: paste this into the chat:
```
STOP. Re-read your original prompt. You are the [ML/Backend/Frontend] agent only.
Do not build anything outside your scope. Use defaults from contract.json where needed.
Continue with your checklist from where you left off.
```

---

## Emergency: Agent Is Stuck

If an agent can't complete its task, you have these options:

| Agent stuck | Fallback |
|---|---|
| ML agent | Use the hardcoded defaults in backend prompt. Build rule-based scoring in app.py instead of model. |
| Backend agent | Build Flask yourself — it's ~60 lines. Copy from `04_backend_implementation.md`. |
| Frontend agent | Build a single-page form with no multi-step. All questions visible. Ugly but works. |

---

## History
<!-- [Time] — what changed and why -->
