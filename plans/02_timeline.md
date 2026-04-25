# 02 — Timeline
**Last updated**: 22 April 2026
**Update this file when**: phases complete, time estimates prove wrong, scope is cut or added.
> **Living document** — update this file when anything in this section changes. Never delete; annotate or supersede. Log changes in the `## History` section at the bottom. See `MASTER_PLAN.md` for the full maintenance protocol.


---

## Phases

Build in order. Do not start the next phase until the current one's stop condition is met.

| Phase | What | Est. time | Stop condition |
|---|---|---|---|
| 1 | Working ML model | ~3 hrs | Model predicts correctly in a notebook |
| 2 | Flask API + bare HTML form | ~3 hrs | Form → submit → risk result + Gemini explanation end-to-end |
| 3 | UI polish | ~3 hrs | Demo-ready, styled, mobile layout |
| Buffer | Bug fixing | ~2 hrs | Always keep this. Something will break. |
| 4+ | Deferred features | remaining | Only if phases 1–3 are solid |

---

## 30-Hour Schedule

| Clock hours | Task | Who |
|---|---|---|
| 0–1 | Repo init, pip installs, Gemini API key, folder structure | Chaitanya |
| 1–4 | Phase 1 — ML notebook | Chaitanya |
| 1–4 | Figma wireframes for 4 screens | Designer |
| 4–7 | Phase 2 — Flask + bare HTML | Chaitanya |
| 4–7 | Pitch deck structure + problem slides | Marketer |
| 7–10 | Phase 3 — UI polish | Chaitanya |
| 10–12 | Buffer / bug fixing | Chaitanya |
| 12–14 | Deploy: Cloud Run (backend) + Firebase Hosting (frontend) → live URL | Chaitanya |
| 14–18 | Deferred features if time allows | Chaitanya |
| 18–22 | Pitch deck complete | Designer + Marketer |
| 22–26 | Demo dry runs × 3, screenshots, submission form | All |
| 26–30 | Sleep / rest | All |

---

## Cut Order (if running behind)

Cut in this order — lowest demo impact first:

1. **Dashboard screen** — show as static screenshot in pitch instead
2. **Strip camera** — replace with manual dropdown input for bands
3. **Splash screen** — start directly at questionnaire
4. **Animations** — static results are fine
5. **Gemini** — fallback to pre-written templates if API fails

---

## Roles

| Person | Responsibility |
|---|---|
| Chaitanya | All code: ML, Flask, HTML/CSS/JS |
| Designer | Figma mocks (screens 1–4), pitch visuals, demo screenshots |
| Marketer | Pitch deck content, problem story, impact numbers, README prose |

## Mentoring & Judging Strategy

You don't know the schedule yet. Plan for worst case: they could happen at any hour.

### Mentoring Round 1 (focus: idea validation + system design + Google tech)
**Be ready from hour 3 onward.** Have these ready to show:
- The Neva concept in one sentence: "Answer 8 questions, ML model scores CKD risk, Gemini explains it."
- A system diagram (draw on paper or whiteboard): Form → Flask → XGBoost → Gemini → Result
- Your Google tech usage: "Gemini API for AI explanations, Google Colab for model training, IDX/Firebase on the roadmap."
- The UCI CKD dataset — show F1 score if model is trained by then

**What to ask mentors:**
- "Is our Google tech usage strong enough for judging, or should we add Firebase?"
- "Does the UCI CKD dataset credibility hold for a healthcare hackathon?"
- "Any tips on what Round 2 judges specifically look for?"

### Mentoring Round 2 (focus: implementation progress + scalability)
**Be ready from hour 10 onward.** Have these ready:
- Working `/predict` endpoint — demo it live in browser or Postman
- Show Gemini explanation output for at least one test case
- Have an answer for scalability: "Flask is our prototype. Production path is Firebase Cloud Functions + Firestore."

### Judging Round 1 (idea clarity + progress)
**Must-have by this point:**
- [ ] Model trained and working
- [ ] At least one route functional (form → prediction)
- [ ] Clear one-sentence pitch rehearsed
- [ ] Can explain Google tech usage in 30 seconds

### Judging Round 2 — Final (working prototype + presentation)
**Must-have:**
- [ ] Full flow working: splash → questions → results → Gemini explanation
- [ ] Styled UI (doesn't need to be perfect, needs to look intentional)
- [ ] Pitch deck ready
- [ ] Demo rehearsed minimum 2 times

**Since you don't know the schedule:** commit and push after every phase completion. That way even if judging comes early, you have something to show at any point.

---

## Google Tech Strategy

Gemini API alone might feel thin for a criterion with "high weightage." Here's how to stack it without adding build time:

| Google Tech | What you're using it for | Build cost | When to mention |
|---|---|---|---|
| Gemini 1.5 Flash API | Plain-language risk explanations + preventive tips | Already in MVP | Demo + pitch |
| Google Colab | Model training environment | Already planned | Pitch + README |
| Google Fonts (DM Serif Display) | UI typography | 1 line of HTML | Mention briefly |
| Firebase (roadmap) | Auth + Firestore + Hosting for production version | 0 — just talk about it | Pitch roadmap slide |
| IDX / Firebase Studio (roadmap) | Development environment for v2 | 0 — just talk about it | If judges ask |

**Pitch framing:** "Gemini API is central to the product — it's what turns a raw risk score into actionable, personalised health guidance in plain language. Without it, the app outputs a number. With it, the app changes behaviour." That's the story. Don't list Google tech like a checklist — explain why it's essential.

---
