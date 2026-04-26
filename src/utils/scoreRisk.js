const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function scoreRisk(answers, stripResults) {
  try {
    // Map questionnaire answers to backend format
    // Handle both old format (simple yes/no) and new format (detailed form)
    const questionnaire = {
      age: answers.age,
      conditions: answers.conditions || [],
      appetite: answers.appetite,
      swelling: answers.swelling,
      fatigue: answers.fatigue,
      // New fields from detailed questionnaire
      water: answers.water,
      exercise: answers.exercise,
      habits: answers.habits || [],
    };

    // Handle old format (convert yes/no to conditions array if needed)
    if (answers.diabetes === "yes" && !questionnaire.conditions.includes("Diabetes")) {
      questionnaire.conditions.push("Diabetes");
    }
    if (answers.htn === "yes" && !questionnaire.conditions.includes("High Blood Pressure")) {
      questionnaire.conditions.push("High Blood Pressure");
    }

    console.log("Sending to API:", questionnaire);

    // Call backend API
    const response = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionnaire,
        strip: stripResults || null,
      }),
    });

    if (!response.ok) {
      console.error("API error:", response.status);
      return fallbackScoring(answers, stripResults);
    }

    const result = await response.json();
    if (!result.success) {
      console.error("Prediction failed:", result.error);
      return fallbackScoring(answers, stripResults);
    }

    // Store the full result (percentage, factors) in session storage for Results component
    sessionStorage.setItem("predictionResult", JSON.stringify({
      percentage: result.percentage,
      factors: result.factors,
      score: result.score,
    }));

    return result.risk_level;
  } catch (error) {
    console.error("Failed to call prediction API:", error);
    return fallbackScoring(answers, stripResults);
  }
}

// Fallback to rule-based scoring if API is unavailable
function fallbackScoring(answers, stripResults) {
  let score = 0;
  if (answers.diabetes === "yes") score += 25;
  if (answers.htn === "yes") score += 20;
  if (answers.age === "60+") score += 15;
  else if (answers.age === "45–59") score += 8;
  if (answers.swelling === "yes") score += 12;
  if (answers.fatigue === "yes") score += 8;
  if (answers.hydration === "< 1L") score += 10;
  if (answers.heat === "5+ hrs/day") score += 8;
  if (answers.appetite === "Poor") score += 7;
  if (stripResults?.protein && ["2+","3+"].includes(stripResults.protein)) score += 20;
  if (stripResults?.blood && ["1+","2+"].includes(stripResults.blood)) score += 10;
  if (score >= 50) return "high";
  if (score >= 25) return "moderate";
  return "low";
}

export function btnStyle(color, outline = false) {
  return {
    width:"100%", padding:"15px", borderRadius:12, fontWeight:600, fontSize:15,
    cursor:"pointer", border: outline ? `1.5px solid ${color}` : "none",
    background: outline ? "transparent" : color,
    color: outline ? color : "#fff",
    marginTop:8, letterSpacing:"0.02em",
  };
}
