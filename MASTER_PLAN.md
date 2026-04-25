# Neva AI — Master Plan
**Event**: Build for Bengaluru · REVA University · 25–26 April 2026
**Last updated**: 22 April 2026
**Status**: Pre-hackathon planning

---

## How This Document System Works

> This is a living document system. Every file here should be updated as decisions are made, scope changes, or new information arrives. Never delete old content — mark it as superseded, move it to a `## History` section, or strike through it. The goal is a full audit trail of what was decided and why.

**Rule: add, annotate, supersede. Never destructively delete.**

---

## Plan Maintenance Protocol

### When to update
Update the relevant plan file immediately when any of these happen — not later, not after the hackathon:

| Trigger | Which file | What to do |
|---|---|---|
| A decision is made | `MASTER_PLAN.md` | Add row to Decisions Log with date + reasoning |
| A decision changes | `MASTER_PLAN.md` + relevant sub-plan | Add new row, annotate old row as superseded, update sub-plan |
| Phase completed | `02_timeline.md` | Mark tasks done, log actual time in History |
| Model results are in | `03_ml_implementation.md` | Fill in Actual Results table |
| Gemini prompt is tuned | `04_backend_implementation.md` | Add new prompt version with date under Prompt Tuning Notes |
| A screen changes during build | `05_ui_implementation.md` | Update screen spec, log in History |
| Something is cut mid-hackathon | `02_timeline.md` + `07_deferred.md` | Note cut in timeline History, move full spec to deferred |
| Something promoted from deferred | `07_deferred.md` + relevant impl file | Log promotion in deferred History, add to impl file |
| A blocker appears | `MASTER_PLAN.md` | Add to Blockers table |
| A blocker is resolved | `MASTER_PLAN.md` | Mark resolved in Blockers table, don't delete the row |

### How to update (rules)
- **Never delete.** Strike through (`~~text~~`) or annotate as superseded instead.
- **Always date entries.** Use `[HH:MM Day N]` during hackathon, `DD MMM YYYY` outside.
- **One sentence minimum on why** — "changed because X" not just "changed."
- **Update the Status table** in this file whenever a sub-plan's status changes.
- **Re-read the relevant plan file before starting each phase** — it may have been updated since you last looked.

### Phase boundary checklist
Run this at the end of each phase before starting the next:
- [ ] Status table in this file current
- [ ] Completed tasks checked off in `02_timeline.md`
- [ ] Actual time logged in `02_timeline.md` History
- [ ] Any decisions made this phase added to Decisions Log
- [ ] Actual Results filled in if model was trained (`03_ml_implementation.md`)
- [ ] Any new blockers added or resolved in Blockers table

---

---

## Sub-Plans Index

| File | What it covers | Status |
|---|---|---|
| `MASTER_PLAN.md` | This file — index, decisions log, team context | 🟡 Active |
| `plans/01_project_overview.md` | Problem, solution, goals, constraints | 🟡 Active |
| `plans/02_timeline.md` | 30-hour hackathon schedule, phases, roles | 🟡 Active |
| `plans/03_ml_implementation.md` | Dataset decisions, model training, export, API spec | 🟡 Active |
| `plans/04_backend_implementation.md` | Flask app, routes, Gemini integration, fallbacks | 🟡 Active |
| `plans/05_ui_implementation.md` | Screen specs, component design, styling tokens | 🟡 Active |
| `plans/06_pitch_plan.md` | Deck structure, talking points, demo flow | ⚪ Not started |
| `plans/07_deferred.md` | Everything cut from MVP — full specs preserved | 🟡 Active |
| `plans/08_implementation_spec.md` | Repo structure, known issues, quick fixes, deploy options, pre-hackathon checklist | 🟡 Active |
| `plans/09_sub_agents.md` | Agent prompts, checklists, communication protocol, contract.json spec | 🟡 Active |

**Status key**: 🟢 Done · 🟡 Active / in progress · 🔴 Blocked · ⚪ Not started · ✅ Shipped

---

## Team

| Person | Role | Owns |
|---|---|---|
| Chaitanya | Solo coder | All implementation — ML, Flask, HTML/CSS/JS |
| Designer | Visual design | Figma mocks, pitch deck visuals |
| Marketer | Comms | Pitch deck content, README copy, demo narrative |

---

## Key Decisions Log

> Add every significant decision here with date and reasoning. This prevents relitigating the same questions during the hackathon.

| # | Date | Decision | Reasoning |
|---|---|---|---|
| 1 | 22 Apr | UCI CKD as sole training dataset | Only dataset with CKD label. Kaggle variants had no labels, unit issues, or too few rows. |
| 2 | 22 Apr | XGBoost as primary model | Best F1 on UCI CKD. SHAP support for explainability. Logistic Regression kept as baseline. |
| 3 | 22 Apr | Plain HTML + Flask for MVP, not React + Firebase | Zero setup time. Firebase adds 2–3 hrs config overhead with no demo value. Migrate post-hackathon. |
| 4 | 22 Apr | Gemini API stays in MVP | Required Google tech for judging criteria. Called from Flask. |
| 5 | 22 Apr | Urinalysis dataset not used for training | No CKD label. UTI diagnosis only. Useful only for strip UI value ranges. |
| 6 | 22 Apr | Santhosh DS1/DS2 skipped entirely | DS1: all CKD patients, no healthy control. DS2: blood glucose in mmol/L vs UCI's mg/dL — 18× unit mismatch. |
| 7 | 22 Apr | Strip camera deferred | Requires labelled strip image dataset. Manual input form in MVP instead. |
| 8 | 22 Apr | XGBoost as model, UCI solo as dataset | Full 10-alternative analysis done. XGBoost wins on accuracy (99% F1). UCI solo is sufficient — merging adds ~1 hr wrangling for marginal gain. LR kept as baseline. Neural net, ensemble, LLM scoring, rule-based all evaluated and rejected or deferred. See `plans/03_ml_implementation.md`. |
| 9 | 22 Apr | Google Colab for training | Zero setup, free GPU, auto-saves to Drive, counts as Google tech. Export model.pkl → drop into Flask folder. |
| 10 | 23 Apr | Firebase Hosting + Cloud Run for deployment | Frontend on Firebase Hosting, Flask API on Cloud Run. Gives live URL + 5 Google technologies for judging. Localhost remains primary demo, live URL is backup. ~45 min setup after Phase 3. |
| 11 | 23 Apr | Responsive web app, not native mobile/desktop | One HTML file, max-width 420px centered card. Works on both desktop and mobile browsers. No React Native, no Flutter, no Electron. |
| 10 | 22 Apr | Google tech strategy: Gemini (core) + Colab + Fonts, Firebase as roadmap | Stacks 3 real usages + 2 roadmap mentions. Pitch Gemini as essential ("turns a number into behaviour change"), not as a checkbox. See `02_timeline.md`. |
| 11 | 22 Apr | Mentoring/judging: be ready from hour 3, commit after every phase | Schedule unknown. Plan assumes worst case. Strategy documented in `02_timeline.md`. |

---

## Current Blockers

| Blocker | Owner | Status | Notes |
|---|---|---|---|
| ~~Gemini API key needed~~ | Chaitanya | ✅ Resolved | Key obtained and tested |
| UCI dataset access | Chaitanya | ✅ Ready | Via `ucimlrepo` pip package — no account needed |
| Mentoring/judging schedule unknown | All | 🟡 Open | Plan assumes they can happen any time. Be demo-ready from hour 3. |

---

## What "Done" Looks Like

**Minimum to demo (must have):**
- [ ] Form → prediction → risk level displayed
- [ ] Gemini explanation rendered on results screen
- [ ] End-to-end works without errors on a clean run

**Good demo (should have):**
- [ ] Multi-step question UI (not one big form)
- [ ] Styled risk result with colour band
- [ ] Top 3 contributing factors shown

**Strong demo (nice to have, time permitting):**
- [ ] Splash screen
- [ ] Animated score bar
- [ ] Strip value input as second input method
