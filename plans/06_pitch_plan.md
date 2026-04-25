# 06 — Pitch Plan
**Last updated**: 22 April 2026
**Update this file when**: deck structure changes, new stats are found, demo flow is locked, talking points are refined.
> **Living document** — update this file when anything in this section changes. Never delete; annotate or supersede. Log changes in the `## History` section at the bottom. See `MASTER_PLAN.md` for the full maintenance protocol.

**Owner**: Marketer (content) + Designer (visuals). Chaitanya reviews for technical accuracy.

---

## Format

- 5-minute presentation + demo
- Judging criteria order to hit: Google Technologies → Problem–Solution Fit → Technical Implementation → Impact → UX

---

## Deck Structure (slides)

| # | Slide | Owner | Key content |
|---|---|---|---|
| 1 | Title | Designer | "Neva AI — Kidney Health Screening for Bengaluru" · team name |
| 2 | The problem | Marketer | 788M affected globally · 8–9M undetected in Karnataka · 90% undiagnosed · ₹5–10L dialysis cost |
| 3 | Why Bengaluru | Marketer | Heat stress + IT workers + no CKD registry + late-stage detection stats |
| 4 | The solution | Designer | App flow: question → model → Gemini advice. One-line: "3 minutes to know your risk." |
| 5 | How it works | Chaitanya | XGBoost trained on UCI CKD dataset · SHAP explainability · Gemini for plain-language output |
| 6 | Google tech | Chaitanya | Gemini 1.5 Flash API — show the actual prompt + output. Mention Firebase roadmap. |
| 7 | Live demo | All | Walk through the app end-to-end |
| 8 | Impact | Marketer | If 1% of Bengaluru's at-risk population screened → X early interventions. Dialysis cost saved. |
| 9 | Roadmap | Designer | Strip camera CV model · Firebase + auth · ASHA portal · Kannada language |
| 10 | Team | Designer | Names + roles |

---

## Demo Flow (rehearse this 3 times)

1. Open app on phone or laptop in mobile view (420px width)
2. Talk through splash screen — read out the stats
3. Go through questionnaire — use the "high risk" test case (diabetes: yes, htn: yes, swelling: yes, low water, high heat)
4. Show results screen — point to the risk band and contributing factors
5. Show explanation screen — read the first sentence of Gemini output
6. Say: "All of this in under 3 minutes, on any phone, no lab, no hospital."

**Test case for demo** (guaranteed high risk):
```
Age: 60+
Diabetes: Yes
Hypertension: Yes
Water intake: < 1L
Heat exposure: 5+ hrs/day
Swelling: Yes
Fatigue: Yes
Appetite: Poor
```

---

## Key Stats to Memorise

- 788M people affected by CKD globally (GBD 2023)
- 8–9M undetected in Karnataka (community meta-analysis, South India)
- 90% of CKD cases in India are undiagnosed in early stages
- ₹5–10 lakh per patient per year for dialysis
- Up to 50% of severe CKD cases preventable with early screening
- Only 20% of renal dysfunction patients at Bengaluru hospital had prior CKD diagnosis

---

## What to Say About Limitations

> "The computer vision model for strip analysis is on our roadmap — for this prototype, strip values are entered manually. The risk model is trained on the UCI CKD dataset and achieves 97% F1. Clinical validation would follow with hospital partnerships in Phase 2."

Say this proactively before judges ask. It builds credibility.

---

## SDG Alignment (for judges)

- **SDG 3**: Good Health & Well-being — direct early disease prevention
- **SDG 8**: Community Economic Development — preventing ₹5–10L/year dialysis burden on vulnerable households

---

## README Template

Copy this into `README.md` and fill in on hackathon day. Marketer writes prose, Chaitanya fills tech.

```markdown
# Neva AI — Kidney Health Screening for Bengaluru

> A 3-minute kidney risk screening powered by machine learning and Google's Gemini AI.
> Built at Build for Bengaluru Hackathon, April 2026.

## The Problem

[Marketer: 3-4 sentences. CKD stats, Karnataka burden, late detection, cost.]

## What Neva Does

[Marketer: 2-3 sentences. Questionnaire → ML risk score → Gemini explanation.]

## How It Works

1. User answers 8 health & lifestyle questions
2. XGBoost model (trained on UCI CKD dataset, F1: XX%) predicts CKD risk
3. SHAP values identify the top contributing factors
4. Gemini 1.5 Flash generates personalised, plain-language health advice

## Google Technologies Used

- **Gemini 1.5 Flash API** — generates personalised risk explanations and preventive tips
- **Google Colab** — model training and evaluation environment
- **Google Fonts** — DM Serif Display for UI typography

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML + CSS + vanilla JS |
| Backend | Python + Flask |
| ML | XGBoost + scikit-learn + SHAP |
| AI | Google Gemini 1.5 Flash API |

## Setup

git clone https://github.com/[your-username]/neva-ai.git
cd neva-ai
pip install -r requirements.txt
echo "GEMINI_API_KEY=your_key" > .env
python app.py
# Open http://localhost:5000

## Dataset

UCI Chronic Kidney Disease Dataset (CC BY 4.0)
Rubini, L., Soundarapandian, P., & Eswaran, P. (2015).
https://archive.ics.uci.edu/dataset/336/chronic+kidney+disease

## Disclaimer

Neva is a health awareness and early screening tool, not a medical diagnostic device.
Results are indicative only. Always consult a qualified medical professional for diagnosis and treatment.

## Team

- [Name] — [Role]
- [Name] — [Role]
- [Name] — [Role]
```

---

## History
<!-- Log pitch changes -->
<!-- [Time] — what changed and why -->
