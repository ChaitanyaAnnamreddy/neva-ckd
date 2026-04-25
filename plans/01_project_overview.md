# 01 — Project Overview
**Last updated**: 22 April 2026
**Update this file when**: problem framing changes, solution scope shifts, or new research is added.
> **Living document** — update this file when anything in this section changes. Never delete; annotate or supersede. Log changes in the `## History` section at the bottom. See `MASTER_PLAN.md` for the full maintenance protocol.


---

## Problem

Chronic Kidney Disease (CKD) affects an estimated 8–9 million people in Karnataka, most undiagnosed. Current systems are hospital-centric and reactive — patients arrive at late stage when dialysis (₹5–10L/year) is the only option. No scalable community-level early screening exists.

Bengaluru-specific aggravators:
- Urban heat stress and low hydration awareness accelerating kidney damage
- IT sector workers: sedentary, long hours, chronically underhydrated
- Peri-urban and migrant populations with limited healthcare access

**Key stat for pitch**: 90% of CKD cases in India are undiagnosed in early stages when progression is still preventable.

---

## Solution

Neva AI — a kidney risk awareness and early screening platform.

1. User answers 8 lifestyle/symptom questions
2. XGBoost model (trained on UCI CKD dataset) scores risk: Low / Moderate / High
3. SHAP values identify top 3 contributing factors
4. Gemini API generates a personalised plain-language explanation + 3 actionable tips

**Not a diagnostic tool.** Positioned as awareness + behaviour change.

---

## Goals

**Hackathon goal**: working demo that impresses judges in a 5-minute presentation.
**Product goal**: reduce late-stage CKD in Bengaluru through early community screening.

---

## Constraints

- 30-hour build window, 25–26 April 2026
- 1 coder (Chaitanya), 1 designer, 1 marketer
- Must use Google technologies (Gemini API at minimum)
- Must address SDG 3 (Good Health & Well-being)
- No hardware — software-only solution

---

## Success Metrics (post-hackathon)

- Number of screenings completed
- % of users who follow up with a doctor (moderate/high risk)
- Retention: users returning for re-screening
- Accuracy: F1 score on held-out test set

---

## Research Sources

- GBD 2023: CKD is 9th leading cause of death globally, 788M affected
- ICMR: ~2.1% of Karnataka adults show detectable impairment (likely under-screening)
- Community meta-analyses, South India: 14–15% pooled CKD prevalence → 8–9M in Karnataka
- Indian Journal of Nephrology 2024: no dedicated CKD registry in Bengaluru
- Dr B.R. Ambedkar Medical College study 2025–26: 80% of renal dysfunction patients had no prior CKD diagnosis
- The Hindu 2026: nephrologists warning about heat + dehydration accelerating kidney damage
