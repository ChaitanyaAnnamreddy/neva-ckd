# 05 — UI Implementation
**Last updated**: 22 April 2026
**Update this file when**: screen designs change, new screens are added, component behaviour is decided, styling tokens update.
> **Living document** — update this file when anything in this section changes. Never delete; annotate or supersede. Log changes in the `## History` section at the bottom. See `MASTER_PLAN.md` for the full maintenance protocol.


---

## Stack

Plain HTML + CSS + vanilla JS. No build step, no npm, no framework.
Served directly from Flask via `render_template('index.html')`.

---

## Design Tokens

```css
:root {
  --bg:        #0a0f1a;
  --card:      #111827;
  --border:    #1e293b;
  --teal:      #14b8a6;
  --teal-dim:  #0f766e;
  --teal-glow: rgba(20, 184, 166, 0.15);
  --text:      #f1f5f9;
  --muted:     #64748b;
  --low:       #22c55e;
  --moderate:  #f59e0b;
  --high:      #ef4444;
}
```

**Typography**: `DM Serif Display` (Google Fonts) for headings, `system-ui` for body.
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap" rel="stylesheet">
```

---

## Screen Flow

```
Splash → Questionnaire (8 steps) → Results → Explanation
```

All on one HTML page. JS shows/hides sections. No page reloads.

---

## Screen 1 — Splash

**Purpose**: set context, create urgency, get user to start.

Elements:
- Droplet emoji / icon, teal glow via `box-shadow`
- `<h1>` "Neva" in DM Serif Display, 42px
- Subtitle "Kidney Health Awareness" — teal, 13px, letter-spacing 0.18em, uppercase
- 3 stat pills (flexbox row):
  - "8–9M undetected in Karnataka"
  - "₹5–10L dialysis cost/year"
  - "Up to 50% preventable"
- CTA button: "Check My Kidney Risk →"
- Disclaimer: "Not a diagnostic tool. For awareness only." — 11px, muted

---

## Screen 2 — Questionnaire

**Purpose**: collect 8 inputs, one at a time.

Structure:
- Progress bar: `width: {step/8 * 100}%`, teal fill, transitions 0.3s
- Step counter: "3 / 8" — top right, muted
- Back arrow: top left, shows from step 2 onward
- Question text: DM Serif Display, 28px
- Auto-advance on selection (no Next button needed for yes/no and single-select)

### Questions

| # | Question | Type | Options |
|---|---|---|---|
| 1 | Age group | select | 18–29 · 30–44 · 45–59 · 60+ |
| 2 | History of diabetes? | yes/no | Yes · No |
| 3 | High blood pressure? | yes/no | Yes · No |
| 4 | Daily water intake | select | < 1L · 1–2L · 2–3L · 3L+ |
| 5 | Outdoor heat exposure | select | Rarely · 1–2 hrs/day · 3–5 hrs/day · 5+ hrs/day |
| 6 | Ankle or foot swelling? | yes/no | Yes · No |
| 7 | Frequent fatigue? | yes/no | Yes · No |
| 8 | Appetite recently? | select | Good · Reduced · Poor |

### Button styles
- Yes/No: two buttons side by side, flex row, `flex: 1`
- Multiple choice: full-width stacked buttons
- Selected state: `border: 1.5px solid var(--teal)`, `background: var(--teal-glow)`
- Unselected: `border: 1.5px solid var(--border)`, transparent background

---

## Screen 3 — Results

**Purpose**: show risk level clearly. Don't bury it. Don't alarm unnecessarily.

Elements:
- Risk badge card: background tinted with risk colour at 12% opacity, border at 30% opacity
  - Emoji: 🟢 / 🟡 / 🔴 at 48px
  - Risk label: DM Serif Display, 32px, risk colour
  - Subtitle: "Kidney health risk assessment" — muted, 13px
- Score bar:
  - Label row: "Risk score" left, percentage right (risk colour)
  - Bar: `height: 8px`, teal fill animated from 0% → score% on mount (`transition: width 1s cubic-bezier(0.4,0,0.2,1)`)
  - Low/Moderate/High markers below bar
- Contributing factors: list of chips, each with small arrow in risk colour
- CTA: "See Personalised Advice →"

---

## Screen 4 — Explanation

**Purpose**: deliver Gemini's advice. Make it feel human, not clinical.

Elements:
- Header: small teal label "✦ Gemini AI Advice"
- Title: "What this means for you" — DM Serif Display, 26px
- Summary card: left border 3px in risk colour, `#1e293b` background, explanation paragraph
- Tips section:
  - Label: "Recommended actions" — muted caps
  - 3 numbered items: circular badge (teal bg, teal text) + tip text (muted, 14px, line-height 1.65)
- Disclaimer box: amber background tint, amber border, amber text — "⚠ This is an awareness tool, not a medical diagnosis. Always consult a qualified doctor."
- Loading state: show spinner + "Gemini is generating your personalised advice…" while fetch is in-flight

---

## JS Logic Outline

```javascript
// State
let answers = {};
let currentStep = 0;
const questions = [...]; // array of question configs

// Navigation
function goToStep(n) { /* show/hide question divs, update progress bar */ }
function selectAnswer(questionId, value) {
  answers[questionId] = value;
  if (currentStep < questions.length - 1) goToStep(currentStep + 1);
  else submitQuestionnaire();
}

// Submission
async function submitQuestionnaire() {
  showScreen('results-loading');
  const payload = buildPayload(answers); // map UI answers → model features
  const prediction = await fetch('/predict', { method: 'POST', body: JSON.stringify(payload), headers: {'Content-Type': 'application/json'} }).then(r => r.json());
  showResults(prediction);
  const explanation = await fetch('/explain', { method: 'POST', body: JSON.stringify(prediction), headers: {'Content-Type': 'application/json'} }).then(r => r.json());
  showExplanation(explanation);
}

// Answer encoding (UI value → model feature value)
function buildPayload(answers) {
  return {
    age:   ageGroupToNumber(answers.age),
    dm:    answers.diabetes === 'yes' ? 1 : 0,
    htn:   answers.htn === 'yes' ? 1 : 0,
    appet: answers.appetite === 'Good' ? 1 : 0,
    pe:    answers.swelling === 'yes' ? 1 : 0,
    ane:   answers.fatigue === 'yes' ? 1 : 0,
    // defaults for fields not collected in basic form:
    bp: 80, al: 0, sg: 1.015, rbc: 1, bgr: 100, bu: 20, sc: 1.0,
    sod: 140, pot: 4.0, hemo: 13, pcv: 40, wc: 7500, rc: 5
  };
}
```

---

## Component Notes

| Component | Spec |
|---|---|
| Buttons | `border-radius: 12px`, full width, 15px font, 15px vertical padding, `transition: opacity 0.15s` |
| Cards | `border-radius: 14px`, `var(--card)` fill, `var(--border)` border, 1px |
| Progress bar | height 3px, `var(--teal)` fill, `border-radius: 2px`, `transition: width 0.3s` |
| Risk score bar | height 8px, `border-radius: 4px`, animate on mount |
| Spinner | CSS border spinner, teal, centered |

---

## Disclaimer Copy (use verbatim)

Show on splash screen (small print) and explanation screen (amber box):

**Splash (short):** "Not a medical diagnostic tool. For health awareness only."

**Results/Explanation (full):** "Neva is a health awareness and early screening tool. It does not diagnose, treat, or prevent any medical condition. Results are based on a statistical model and should not replace professional medical advice. If your result indicates moderate or high risk, please consult a qualified doctor."

---

## Loading & Error States

### Loading (while waiting for /predict + /explain)
- Show on results screen: spinner + "Analysing your responses…"
- Show on explanation screen: spinner + "Gemini is generating your advice…"
- Simple CSS spinner — don't overthink this

### Error states
- If `/predict` fails: "Something went wrong. Please try again." + retry button
- If `/explain` fails: show results without explanation + note "AI advice temporarily unavailable"
- Never show a blank screen. Always show something.

---

- All buttons are `<button>` elements, not `<div>`
- Form inputs have visible labels
- Risk result announced via `aria-live="polite"` region
- Colour is never the only indicator — emoji + text always accompanies risk colour

---

## History
<!-- Log design changes during hackathon -->
<!-- [Time] — what changed and why -->
