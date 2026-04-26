# Project Structure

The application has been refactored into a modular architecture for better maintainability and scalability.

## Directory Layout

```
src/
├── neva-ui.jsx                 # Main app entry point & routing logic
├── main.jsx                    # React DOM render
├── firebase.js                 # Firebase configuration
├── components/                 # React components
│   ├── index.js               # Component exports
│   ├── WelcomeScreen.jsx      # Initial sign-in screen
│   ├── SignUpFlow.jsx         # Phone/Email sign-up
│   ├── OTPVerification.jsx    # OTP verification
│   ├── Splash.jsx             # Post-auth greeting
│   ├── Questionnaire.jsx      # Health questionnaire (9 questions)
│   ├── StripCamera.jsx        # Urine strip scanning & instructions
│   ├── Results.jsx            # Risk score results
│   ├── Explanation.jsx        # Personalized advice
│   └── Dashboard.jsx          # User dashboard with hydration tracker
├── constants/                  # Global constants
│   └── index.js               # COLORS, RISK_CONFIG, QUESTIONS, etc.
├── utils/                      # Utility functions
│   └── scoreRisk.js           # Risk calculation & style helpers
└── assets/                     # SVG icons & illustrations
    ├── Avatar Image.svg
    ├── Background*.svg
    ├── Collect Urine Sample.svg
    ├── exercise-*.svg
    ├── water-*.svg
    ├── work-*.svg
    └── ... other SVGs
```

## Component Overview

### Screen Components
- **WelcomeScreen**: Google, phone, and email sign-in options
- **SignUpFlow**: Email/phone input with validation
- **OTPVerification**: OTP code entry
- **Splash**: Post-login greeting with app intro
- **Questionnaire**: Multi-step health questionnaire with Firestore auto-save
- **StripCamera**: Urine strip scanning with 4-step instructions
- **Results**: Risk score display with contributing factors
- **Explanation**: AI-generated personalized health advice
- **Dashboard**: User hydration tracker and achievement badges

### Feature: Instructions Screen
When users click "View instructions" on the Insight page:
1. Displays a 4-step instruction flow
2. Each step shows title, description, and large illustration
3. Navigation with Back/Next buttons
4. Step indicator badge (Step 1/4, etc.)
5. On final step, clicking "Next" advances to results review

## Constants (`constants/index.js`)

- **COLORS**: Color palette for the app
- **RISK_CONFIG**: Risk level configurations (low/moderate/high)
- **QUESTIONS**: Deprecated, kept for reference
- **STRIP_BANDS**: Urine strip test parameters
- **EXPLANATIONS**: Risk level explanations and tips
- **SCREENS**: Navigation screen names

## Utils (`utils/scoreRisk.js`)

- **scoreRisk()**: Calculates kidney health risk based on answers and strip data
- **btnStyle()**: Helper for consistent button styling

## Data Flow

1. User completes questionnaire → Data saved to Firestore
2. User views instructions (4 steps) → Can navigate between steps
3. User completes strip analysis → Risk score calculated
4. Results displayed → Personalized advice shown
5. Dashboard → Track daily hydration & achievements

## Firebase Integration

- Auth: Google Sign-In with PopUp
- Firestore Collections:
  - `users/{uid}` - User profile
  - `users/{uid}/assessments/{docId}` - Assessment history with nested fields:
    - `identity.age`, `identity.gender`
    - `healthConditions.conditions`, `.medication`, `.medicationType`
    - `lifestyle.work`, `.exercise`, `.habits`, `.waterIntake`

## Key Improvements

✓ **Modular**: Each screen is its own file (~100-400 lines each)
✓ **Maintainable**: Easy to locate and update specific features
✓ **Scalable**: New screens can be added without affecting existing ones
✓ **DRY**: Constants and utils avoid code repetition
✓ **Type-safe**: Ready for TypeScript migration if needed
✓ **Performance**: Build still under 700KB (includes large SVGs)
