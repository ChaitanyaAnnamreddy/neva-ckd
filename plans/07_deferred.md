# 07 — Deferred Features
**Last updated**: 22 April 2026
**Update this file when**: a deferred feature gets promoted to active, specs are refined, or new deferred items are identified.
> **Living document** — update this file when anything in this section changes. Never delete; annotate or supersede. Log changes in the `## History` section at the bottom. See `MASTER_PLAN.md` for the full maintenance protocol.


> These are fully specced and ready to build — just not in the hackathon MVP. Nothing is deleted. Everything here gets built post-hackathon or if time allows after Phase 3.

---

## Priority Order (build in this order after MVP)

1. Strip camera UI — highest demo impact, already specced
2. Firebase integration — needed for user history + deployment
3. Dashboard screen — engagement story for pitch
4. React migration — cleaner codebase, better mobile UX
5. CV model — requires external dataset, longer timeline
6. Engagement features — streaks, badges, challenges
7. ASHA / NGO portal — secondary user base

---

## Deferred: Strip Camera UI

**Why deferred**: requires camera API work + UI complexity. Manual input form is sufficient for MVP.
**Promote when**: Phase 3 is done and > 6 hrs remain.

Spec:
- Intro screen: step-by-step strip instructions (buy · dip · wait 60s · scan)
- Camera capture: `navigator.mediaDevices.getUserMedia`, canvas overlay with alignment guide
- Mock CV output: after capture, simulate band reading with values from Kaggle urinalysis ranges
- Results: each band (Protein / Glucose / Blood / SG / pH) shown as pill row, detected value in teal, user can tap to correct
- Skip link: "Skip — use questionnaire only" (muted, underlined)

Strip band value ranges (from Kaggle urinalysis dataset):
| Band | Values |
|---|---|
| Protein | NEGATIVE · TRACE · 1+ · 2+ · 3+ |
| Glucose | NEGATIVE · TRACE · 1+ · 2+ · 3+ · 4+ |
| Blood | NEGATIVE · TRACE · 1+ · 2+ |
| Specific Gravity | 1.005 · 1.010 · 1.015 · 1.020 · 1.025 |
| pH | 5 · 6 · 7 · 8 · 9 |

---

## Deferred: Firebase Integration

**Why deferred**: 2–3 hrs setup with no visible demo value. Flask runs locally just as well.
**Promote when**: post-hackathon, for deployment + user history features.

Spec:
- Firebase Auth: Google Sign-In
- Firestore collections:
  - `users/{uid}` — display name, created_at
  - `screenings/{uid}/results/{id}` — answers, risk, score, factors, explanation, timestamp
  - `streaks/{uid}` — current_streak, last_screening_date, badges[]
- Move Flask `/predict` + `/explain` to Firebase Cloud Functions (Node.js)
- Firebase Hosting for public deployment
- Environment variables via Firebase config, not `.env`

---

## Deferred: Dashboard Screen

**Why deferred**: engagement feature, not core to CKD detection story.
**Promote when**: Firebase integration is done (needs Firestore for history).

Spec:
- Greeting + day streak counter (🔥 flame) — top right
- Last screening result card (risk colour background)
- Hydration tracker: 8 tap-to-fill glass bars, `localStorage` for state
  - Copy: "Great hydration! 🎉" / "Keep going — aim for 6–8 glasses." / "Drink more water — kidneys need it."
- Badges grid (2×2):
  - First Screen (earned on first prediction)
  - 3-Day Streak (earned after 3 consecutive days with a screening)
  - Hydration Pro (earned after 7 days hitting 6+ glasses)
  - 30-Day Check (earned after monthly re-screening)
  - Locked badges shown at 50% opacity
- Secondary CTA: "Retake Screening" (outlined button)

---

## Deferred: Tracker Conflicts (Firebase + React + Tailwind)

**Source**: Team tracker tasks #2, #6, #7, #8. Conflicts with MVP plan (decision #3).
**Why deferred**: Firebase, React, and Tailwind each add 1–2 hrs of setup with zero demo value. Flask + plain HTML achieves the same result in 5 minutes of setup.
**Promote when**: Post-hackathon, when building v2 for production.

Tracker tasks that need updating:
- ~~"Set up Firebase project — Firestore + Hosting, install React + Tailwind"~~ → "Set up Flask project + folder structure"
- ~~"Implement Figma designs into React"~~ → "Implement UI screens in HTML/CSS/JS"
- ~~"Connect Firebase Firestore"~~ → move to stretch goal
- ~~"Deploy MVP to Firebase Hosting"~~ → "Test demo on localhost. If time: ngrok or Railway"

---

## Deferred: Full Tech Stack Migration

**Why deferred**: React + Vite + Firebase takes time to scaffold correctly.
**Promote when**: post-hackathon, when building v2.

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + TailwindCSS |
| Auth & DB | Firebase Auth + Firestore |
| Backend | Firebase Cloud Functions (Node.js) |
| Hosting | Firebase Hosting |
| CV model | MobileNet-V2 fine-tuned on labelled urine strip images |

Migration path: plain HTML → React component-by-component. Screens map 1:1.

---

## Deferred: CV Model (MobileNet-V2)

**Why deferred**: requires labelled urine strip image dataset — not available now.
**Promote when**: partner with a lab or hospital to collect + label strip images.

Spec:
- Architecture: MobileNet-V2 or EfficientNet-Lite (optimised for mobile inference)
- Task: detect colour changes on each band → output value (e.g. Protein: "2+")
- Training data needed: ~500–1000 labelled strip images per band value
- Output mapped to model features via the feature mapping table in `03_ml_implementation.md`
- Deployment: TensorFlow Lite for on-device inference (offline capable)
- Fallback: server-side inference via Flask if on-device is too slow

---

## Deferred: Engagement Features

- Streaks for hydration consistency (daily check-in)
- Badges for test completion and learning modules
- Community challenges: "30-day kidney care challenge"
- Seasonal heatwave alerts (triggered by Bengaluru temperature data via weather API)
- Kannada / Hindi language support (i18n strings, UI toggle)

---

## Deferred: Google Maps — Nearest PHC / Dialysis Centre

**Source**: Added from team tracker (22 Apr). Not in original plan.
**Why deferred**: New scope, not core to CKD detection story. But strong Google tech multiplier.
**Promote when**: Phases 1–3 done, UI working, and you want to boost Google tech score.

Spec:
- On the explanation screen (after risk result), show a "Find nearby kidney care" button
- Opens a Google Maps embed or link with pre-filled search: "nephrology clinic near me" or "dialysis centre near me"
- Simple implementation: just a link to `https://www.google.com/maps/search/nephrology+clinic+near+me/` — takes 5 minutes
- Advanced: embed Maps JavaScript API with markers for top 3 results — takes ~1 hour
- Pitch framing: "Neva doesn't just tell you your risk — it connects you to care within walking distance"
- Adds a second Google technology (Maps Platform) to the judging criteria

---

## Deferred: ASHA / NGO Portal

- Secondary user type: community health worker
- Bulk screening mode: run questionnaire for a patient, save to their profile
- Outreach dashboard: screenings done this week, % high risk, follow-up needed
- Export: CSV download of screening results for reporting
- Access control: ASHA workers see only their assigned area's data

---

## History
<!-- Log when items are promoted from deferred to active -->
<!-- [Time] — what moved and why -->
