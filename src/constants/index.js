export const COLORS = {
  bg: "#0a0f1a",
  card: "#111827",
  cardBorder: "#1e293b",
  primary: "#2563EB",
  primaryDim: "#1D4ED8",
  primaryGlow: "rgba(37,99,235,0.15)",
  secondary: "#F97316",
  red: "#ef4444",
  green: "#22c55e",
  text: "#f1f5f9",
  muted: "#64748b",
  subtle: "#1e293b",
};

export const RISK_CONFIG = {
  low:      { label: "Low Risk",      color: "#22c55e", bg: "rgba(34,197,94,0.12)",  icon: "◉", bar: 22 },
  moderate: { label: "Moderate Risk", color: COLORS.secondary, bg: "rgba(249,115,22,0.12)", icon: "◉", bar: 58 },
  high:     { label: "High Risk",     color: "#ef4444", bg: "rgba(239,68,68,0.12)",  icon: "◉", bar: 85 },
};

export const QUESTIONS = [
  { id: "age",       label: "Age group",              type: "select", options: ["18–29","30–44","45–59","60+"] },
  { id: "diabetes",  label: "History of diabetes?",   type: "yesno" },
  { id: "htn",       label: "High blood pressure?",   type: "yesno" },
  { id: "hydration", label: "Daily water intake",     type: "select", options: ["< 1L","1–2L","2–3L","3L+"] },
  { id: "heat",      label: "Outdoor heat exposure",  type: "select", options: ["Rarely","1–2 hrs/day","3–5 hrs/day","5+ hrs/day"] },
  { id: "swelling",  label: "Ankle/foot swelling?",   type: "yesno" },
  { id: "fatigue",   label: "Frequent fatigue?",      type: "yesno" },
  { id: "appetite",  label: "Appetite recently?",     type: "select", options: ["Good","Reduced","Poor"] },
];

export const STRIP_BANDS = [
  { name: "Protein",          values: ["Neg","Trace","1+","2+","3+"], key: "protein" },
  { name: "Glucose",          values: ["Neg","Trace","1+","2+"],      key: "glucose" },
  { name: "Blood",            values: ["Neg","Trace","1+","2+"],      key: "blood" },
  { name: "Specific Gravity", values: ["1.005","1.010","1.015","1.020","1.025"], key: "sg" },
  { name: "pH",               values: ["5","6","7","8","9"],          key: "ph" },
];

export const EXPLANATIONS = {
  low: {
    summary: "Your kidney health indicators look reassuring right now.",
    tips: [
      "Keep drinking 2–3L of water daily — especially important in Bengaluru's heat.",
      "Get a blood pressure and blood sugar check once a year as a routine precaution.",
      "Limit processed foods and salt to stay ahead of risk factors.",
    ],
  },
  moderate: {
    summary: "Some factors suggest your kidneys may be under stress. This isn't an alarm — it's a nudge to act early.",
    tips: [
      "See a doctor for a basic kidney function test (serum creatinine + urine protein) within the next few weeks.",
      "In Bengaluru's heat, aim for 3L of water daily and avoid peak outdoor hours.",
      "If you have diabetes or BP, ensure they're well-controlled — these are the top kidney risk drivers.",
    ],
  },
  high: {
    summary: "Several indicators suggest elevated kidney health risk. Early action now can prevent serious damage.",
    tips: [
      "Book a nephrology or general physician appointment this week — don't delay.",
      "Request a full kidney panel: serum creatinine, eGFR, urine microalbumin.",
      "Start tracking your daily water intake and avoid NSAIDs (like ibuprofen) without medical advice.",
    ],
  },
};

export const SCREENS = ["profile","splash","questionnaire","strip","results","explanation","dashboard"];
