import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0a0f1a",
  card: "#111827",
  cardBorder: "#1e293b",
  teal: "#14b8a6",
  tealDim: "#0f766e",
  tealGlow: "rgba(20,184,166,0.15)",
  amber: "#f59e0b",
  red: "#ef4444",
  green: "#22c55e",
  text: "#f1f5f9",
  muted: "#64748b",
  subtle: "#1e293b",
};

const RISK_CONFIG = {
  low:      { label: "Low Risk",      color: "#22c55e", bg: "rgba(34,197,94,0.12)",  icon: "◉", bar: 22 },
  moderate: { label: "Moderate Risk", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", icon: "◉", bar: 58 },
  high:     { label: "High Risk",     color: "#ef4444", bg: "rgba(239,68,68,0.12)",  icon: "◉", bar: 85 },
};

const QUESTIONS = [
  { id: "age",       label: "Age group",              type: "select", options: ["18–29","30–44","45–59","60+"] },
  { id: "diabetes",  label: "History of diabetes?",   type: "yesno" },
  { id: "htn",       label: "High blood pressure?",   type: "yesno" },
  { id: "hydration", label: "Daily water intake",     type: "select", options: ["< 1L","1–2L","2–3L","3L+"] },
  { id: "heat",      label: "Outdoor heat exposure",  type: "select", options: ["Rarely","1–2 hrs/day","3–5 hrs/day","5+ hrs/day"] },
  { id: "swelling",  label: "Ankle/foot swelling?",   type: "yesno" },
  { id: "fatigue",   label: "Frequent fatigue?",      type: "yesno" },
  { id: "appetite",  label: "Appetite recently?",     type: "select", options: ["Good","Reduced","Poor"] },
];

const STRIP_BANDS = [
  { name: "Protein",          values: ["Neg","Trace","1+","2+","3+"], key: "protein" },
  { name: "Glucose",          values: ["Neg","Trace","1+","2+"],      key: "glucose" },
  { name: "Blood",            values: ["Neg","Trace","1+","2+"],      key: "blood" },
  { name: "Specific Gravity", values: ["1.005","1.010","1.015","1.020","1.025"], key: "sg" },
  { name: "pH",               values: ["5","6","7","8","9"],          key: "ph" },
];

function scoreRisk(answers, stripResults) {
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

const EXPLANATIONS = {
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

// ── Screens ──────────────────────────────────────────────────────────────────

function Splash({ onNext }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100%", padding:"32px 24px", textAlign:"center" }}>
      <div style={{ width:80, height:80, borderRadius:"50%", background:`radial-gradient(circle at 35% 35%, ${COLORS.teal}, #065f46)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, marginBottom:28, boxShadow:`0 0 40px ${COLORS.tealGlow}` }}>
        💧
      </div>
      <h1 style={{ fontFamily:"'DM Serif Display', Georgia, serif", fontSize:42, fontWeight:400, color:COLORS.text, margin:"0 0 8px", letterSpacing:"-0.5px" }}>
        Neva
      </h1>
      <p style={{ color:COLORS.teal, fontSize:13, letterSpacing:"0.18em", textTransform:"uppercase", margin:"0 0 28px", fontWeight:500 }}>
        Kidney Health Awareness
      </p>
      <p style={{ color:COLORS.muted, fontSize:15, lineHeight:1.7, maxWidth:300, margin:"0 0 40px" }}>
        Nearly <span style={{ color:COLORS.text }}>9 million people</span> in Karnataka have undetected kidney disease. A 3-minute check could change that.
      </p>
      <div style={{ display:"flex", flexDirection:"column", gap:10, width:"100%", maxWidth:320 }}>
        <StatPill label="CKD cases in Karnataka" value="~8–9M undetected" />
        <StatPill label="Dialysis cost per year" value="₹5–10 lakh" />
        <StatPill label="Cases preventable early" value="Up to 50%" color={COLORS.green} />
      </div>
      <button onClick={onNext} style={btnStyle(COLORS.teal)}>
        Check My Kidney Risk →
      </button>
      <p style={{ color:COLORS.muted, fontSize:11, marginTop:12 }}>Not a diagnostic tool. For awareness only.</p>
    </div>
  );
}

function StatPill({ label, value, color = COLORS.teal }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:COLORS.subtle, borderRadius:10, padding:"10px 16px", border:`1px solid ${COLORS.cardBorder}` }}>
      <span style={{ color:COLORS.muted, fontSize:12 }}>{label}</span>
      <span style={{ color, fontSize:12, fontWeight:600 }}>{value}</span>
    </div>
  );
}

function Questionnaire({ onDone }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const q = QUESTIONS[step];
  const progress = ((step) / QUESTIONS.length) * 100;

  function answer(val) {
    const next = { ...answers, [q.id]: val };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else onDone(next);
  }

  return (
    <div style={{ padding:"24px 24px 32px", display:"flex", flexDirection:"column", minHeight:"100%" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
        <button onClick={() => step > 0 && setStep(step-1)} style={{ background:"none", border:"none", color:COLORS.muted, fontSize:20, cursor:"pointer", padding:0 }}>←</button>
        <div style={{ flex:1, height:3, background:COLORS.subtle, borderRadius:2 }}>
          <div style={{ width:`${progress}%`, height:"100%", background:COLORS.teal, borderRadius:2, transition:"width 0.3s" }}/>
        </div>
        <span style={{ color:COLORS.muted, fontSize:12 }}>{step+1}/{QUESTIONS.length}</span>
      </div>

      <p style={{ color:COLORS.muted, fontSize:12, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8 }}>Question {step+1}</p>
      <h2 style={{ fontFamily:"'DM Serif Display', Georgia, serif", fontSize:28, color:COLORS.text, margin:"0 0 32px", lineHeight:1.3 }}>
        {q.label}
      </h2>

      {q.type === "yesno" && (
        <div style={{ display:"flex", gap:12 }}>
          {["Yes","No"].map(v => (
            <button key={v} onClick={() => answer(v.toLowerCase())} style={optionBtn(answers[q.id] === v.toLowerCase())}>
              {v}
            </button>
          ))}
        </div>
      )}

      {q.type === "select" && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {q.options.map(v => (
            <button key={v} onClick={() => answer(v)} style={optionBtnFull(answers[q.id] === v)}>
              {v}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StripCamera({ onDone, onSkip }) {
  const [mode, setMode] = useState("intro"); // intro | capture | results
  const [stripData, setStripData] = useState({});
  const [selected, setSelected] = useState({});

  function mockAnalyse() {
    setMode("results");
    setStripData({ protein:"1+", glucose:"Neg", blood:"Trace", sg:"1.015", ph:"6" });
    setSelected({ protein:"1+", glucose:"Neg", blood:"Trace", sg:"1.015", ph:"6" });
  }

  if (mode === "intro") return (
    <div style={{ padding:"32px 24px", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center" }}>
      <div style={{ fontSize:56, marginBottom:20 }}>🔬</div>
      <h2 style={{ fontFamily:"'DM Serif Display', Georgia, serif", fontSize:28, color:COLORS.text, margin:"0 0 12px" }}>Urine Strip Test</h2>
      <p style={{ color:COLORS.muted, fontSize:14, lineHeight:1.7, maxWidth:280, margin:"0 0 32px" }}>
        Use a standard urine dipstick. Dip it, wait 60 seconds, then scan the colour bands with your camera.
      </p>
      <div style={{ background:COLORS.subtle, borderRadius:12, padding:"16px 20px", width:"100%", maxWidth:320, marginBottom:32, textAlign:"left" }}>
        {["Buy strips at any pharmacy (₹2–5/strip)","Collect midstream urine sample","Dip for 2 seconds, lay flat","Scan after 60 seconds"].map((s,i) => (
          <div key={i} style={{ display:"flex", gap:10, marginBottom:i<3?10:0, alignItems:"flex-start" }}>
            <span style={{ color:COLORS.teal, fontSize:12, marginTop:2, fontWeight:700 }}>{i+1}.</span>
            <span style={{ color:COLORS.muted, fontSize:13 }}>{s}</span>
          </div>
        ))}
      </div>
      <button onClick={mockAnalyse} style={btnStyle(COLORS.teal)}>Scan Strip (Demo)</button>
      <button onClick={onSkip} style={{ background:"none", border:"none", color:COLORS.muted, fontSize:13, marginTop:12, cursor:"pointer", textDecoration:"underline" }}>
        Skip — use questionnaire only
      </button>
    </div>
  );

  if (mode === "results") return (
    <div style={{ padding:"24px" }}>
      <p style={{ color:COLORS.muted, fontSize:12, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:6 }}>Strip Analysis</p>
      <h2 style={{ fontFamily:"'DM Serif Display', Georgia, serif", fontSize:26, color:COLORS.text, margin:"0 0 8px" }}>Review Results</h2>
      <p style={{ color:COLORS.muted, fontSize:13, marginBottom:24 }}>Confirm or adjust the detected values.</p>
      {STRIP_BANDS.map(band => (
        <div key={band.key} style={{ marginBottom:16 }}>
          <p style={{ color:COLORS.text, fontSize:13, fontWeight:500, margin:"0 0 8px" }}>{band.name}</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {band.values.map(v => (
              <button key={v} onClick={() => setSelected({...selected,[band.key]:v})}
                style={{ padding:"6px 14px", borderRadius:8, border:`1.5px solid ${selected[band.key]===v ? COLORS.teal : COLORS.cardBorder}`, background: selected[band.key]===v ? COLORS.tealGlow : "transparent", color: selected[band.key]===v ? COLORS.teal : COLORS.muted, fontSize:12, cursor:"pointer", fontWeight: selected[band.key]===v ? 600 : 400 }}>
                {v}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={() => onDone(selected)} style={{...btnStyle(COLORS.teal), marginTop:16}}>
        Get My Risk Score →
      </button>
    </div>
  );
}

function Results({ riskLevel, answers, stripData, onNext }) {
  const cfg = RISK_CONFIG[riskLevel];
  const [animated, setAnimated] = useState(false);

  useEffect(() => { setTimeout(() => setAnimated(true), 100); }, []);

  const factors = [];
  if (answers.diabetes === "yes") factors.push("Diabetes history");
  if (answers.htn === "yes") factors.push("High blood pressure");
  if (answers.swelling === "yes") factors.push("Pedal swelling");
  if (answers.fatigue === "yes") factors.push("Chronic fatigue");
  if (stripData?.protein && stripData.protein !== "Neg") factors.push(`Protein in urine (${stripData.protein})`);
  if (answers.hydration === "< 1L") factors.push("Low hydration");

  return (
    <div style={{ padding:"24px" }}>
      <p style={{ color:COLORS.muted, fontSize:12, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:24 }}>Your Result</p>

      <div style={{ background:cfg.bg, border:`1.5px solid ${cfg.color}30`, borderRadius:16, padding:"28px 24px", textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:48, marginBottom:12 }}>
          {riskLevel === "low" ? "🟢" : riskLevel === "moderate" ? "🟡" : "🔴"}
        </div>
        <h2 style={{ fontFamily:"'DM Serif Display', Georgia, serif", fontSize:32, color:cfg.color, margin:"0 0 8px" }}>
          {cfg.label}
        </h2>
        <p style={{ color:COLORS.muted, fontSize:13 }}>Kidney health risk assessment</p>
      </div>

      <div style={{ marginBottom:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ color:COLORS.muted, fontSize:12 }}>Risk score</span>
          <span style={{ color:cfg.color, fontSize:12, fontWeight:600 }}>{cfg.bar}%</span>
        </div>
        <div style={{ height:8, background:COLORS.subtle, borderRadius:4 }}>
          <div style={{ width: animated ? `${cfg.bar}%` : "0%", height:"100%", background:cfg.color, borderRadius:4, transition:"width 1s cubic-bezier(0.4,0,0.2,1)" }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
          <span style={{ color:COLORS.green, fontSize:10 }}>Low</span>
          <span style={{ color:COLORS.amber, fontSize:10 }}>Moderate</span>
          <span style={{ color:COLORS.red, fontSize:10 }}>High</span>
        </div>
      </div>

      {factors.length > 0 && (
        <div style={{ marginBottom:24 }}>
          <p style={{ color:COLORS.text, fontSize:13, fontWeight:500, margin:"0 0 12px" }}>Key contributing factors</p>
          {factors.map((f,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", background:COLORS.subtle, borderRadius:8, marginBottom:8 }}>
              <span style={{ color:cfg.color, fontSize:10 }}>▶</span>
              <span style={{ color:COLORS.muted, fontSize:13 }}>{f}</span>
            </div>
          ))}
        </div>
      )}

      <button onClick={onNext} style={btnStyle(COLORS.teal)}>See Personalised Advice →</button>
    </div>
  );
}

function Explanation({ riskLevel, onNext }) {
  const { summary, tips } = EXPLANATIONS[riskLevel];
  const cfg = RISK_CONFIG[riskLevel];

  return (
    <div style={{ padding:"24px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
        <div style={{ width:28, height:28, borderRadius:"50%", background:`${COLORS.teal}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>✦</div>
        <span style={{ color:COLORS.teal, fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase" }}>Gemini AI Advice</span>
      </div>

      <h2 style={{ fontFamily:"'DM Serif Display', Georgia, serif", fontSize:26, color:COLORS.text, margin:"0 0 16px", lineHeight:1.4 }}>
        What this means for you
      </h2>

      <div style={{ background:COLORS.subtle, borderRadius:12, padding:"16px 18px", marginBottom:24, borderLeft:`3px solid ${cfg.color}` }}>
        <p style={{ color:COLORS.text, fontSize:14, lineHeight:1.7, margin:0 }}>{summary}</p>
      </div>

      <p style={{ color:COLORS.muted, fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:14 }}>Recommended actions</p>

      {tips.map((tip, i) => (
        <div key={i} style={{ display:"flex", gap:14, marginBottom:16, alignItems:"flex-start" }}>
          <div style={{ minWidth:28, height:28, borderRadius:"50%", background:`${COLORS.teal}15`, border:`1px solid ${COLORS.teal}40`, display:"flex", alignItems:"center", justifyContent:"center", color:COLORS.teal, fontSize:12, fontWeight:700, marginTop:1 }}>
            {i+1}
          </div>
          <p style={{ color:COLORS.muted, fontSize:14, lineHeight:1.65, margin:0 }}>{tip}</p>
        </div>
      ))}

      <div style={{ background:`${COLORS.amber}10`, border:`1px solid ${COLORS.amber}30`, borderRadius:12, padding:"12px 16px", marginTop:8, marginBottom:28 }}>
        <p style={{ color:COLORS.amber, fontSize:12, margin:0 }}>
          ⚠ This is an awareness tool, not a medical diagnosis. Always consult a qualified doctor.
        </p>
      </div>

      <button onClick={onNext} style={btnStyle(COLORS.teal)}>Go to My Dashboard →</button>
    </div>
  );
}

function Dashboard({ riskLevel }) {
  const [streak] = useState(3);
  const [water, setWater] = useState(5);
  const cfg = RISK_CONFIG[riskLevel];
  const glasses = Array.from({length:8},(_,i)=>i<water);

  return (
    <div style={{ padding:"24px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <p style={{ color:COLORS.muted, fontSize:12, margin:"0 0 2px" }}>Good morning</p>
          <h2 style={{ fontFamily:"'DM Serif Display', Georgia, serif", fontSize:24, color:COLORS.text, margin:0 }}>Your Dashboard</h2>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:20 }}>🔥</div>
          <p style={{ color:COLORS.amber, fontSize:11, margin:0, fontWeight:600 }}>{streak} day streak</p>
        </div>
      </div>

      <div style={{ background:cfg.bg, border:`1px solid ${cfg.color}30`, borderRadius:14, padding:"16px 18px", marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <p style={{ color:COLORS.muted, fontSize:11, margin:"0 0 4px" }}>Last screening</p>
          <p style={{ color:cfg.color, fontSize:16, fontWeight:600, margin:0 }}>{cfg.label}</p>
        </div>
        <span style={{ fontSize:28 }}>{riskLevel === "low" ? "🟢" : riskLevel === "moderate" ? "🟡" : "🔴"}</span>
      </div>

      <div style={{ background:COLORS.subtle, borderRadius:14, padding:"18px", marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <p style={{ color:COLORS.text, fontSize:14, fontWeight:500, margin:0 }}>Hydration today</p>
          <p style={{ color:COLORS.teal, fontSize:13, margin:0 }}>{water}/8 glasses</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {glasses.map((full,i) => (
            <button key={i} onClick={() => setWater(i+1)}
              style={{ flex:1, height:36, borderRadius:8, background: full ? COLORS.teal : COLORS.cardBorder, border:"none", cursor:"pointer", transition:"background 0.2s" }}>
            </button>
          ))}
        </div>
        <p style={{ color:COLORS.muted, fontSize:11, marginTop:10, margin:"10px 0 0" }}>
          {water >= 6 ? "Great hydration! 🎉" : water >= 4 ? "Keep going — aim for 6–8 glasses." : "Drink more water — kidneys need it."}
        </p>
      </div>

      <p style={{ color:COLORS.muted, fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>Badges</p>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:24 }}>
        {[
          { icon:"💧", label:"First Screen",  earned:true  },
          { icon:"🔥", label:"3-Day Streak",  earned:true  },
          { icon:"🌊", label:"Hydration Pro", earned:false },
          { icon:"🏆", label:"30-Day Check",  earned:false },
        ].map((b,i) => (
          <div key={i} style={{ flex:"1 0 42%", background: b.earned ? `${COLORS.teal}10` : COLORS.subtle, border:`1px solid ${b.earned ? COLORS.teal+"30" : COLORS.cardBorder}`, borderRadius:12, padding:"12px", textAlign:"center", opacity: b.earned ? 1 : 0.5 }}>
            <div style={{ fontSize:24 }}>{b.icon}</div>
            <p style={{ color: b.earned ? COLORS.teal : COLORS.muted, fontSize:11, margin:"4px 0 0", fontWeight: b.earned ? 600 : 400 }}>{b.label}</p>
          </div>
        ))}
      </div>

      <button style={btnStyle(COLORS.tealDim, true)}>
        Retake Screening
      </button>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function btnStyle(color, outline = false) {
  return {
    width:"100%", padding:"15px", borderRadius:12, fontWeight:600, fontSize:15,
    cursor:"pointer", border: outline ? `1.5px solid ${color}` : "none",
    background: outline ? "transparent" : color,
    color: outline ? color : "#fff",
    marginTop:8, letterSpacing:"0.02em",
  };
}

function optionBtn(active) {
  return {
    flex:1, padding:"16px", borderRadius:12, fontSize:16, fontWeight:500, cursor:"pointer",
    border:`1.5px solid ${active ? COLORS.teal : COLORS.cardBorder}`,
    background: active ? COLORS.tealGlow : "transparent",
    color: active ? COLORS.teal : COLORS.muted,
  };
}

function optionBtnFull(active) {
  return {
    width:"100%", padding:"14px 18px", borderRadius:12, fontSize:15, textAlign:"left", cursor:"pointer",
    border:`1.5px solid ${active ? COLORS.teal : COLORS.cardBorder}`,
    background: active ? COLORS.tealGlow : "transparent",
    color: active ? COLORS.teal : COLORS.text, fontWeight: active ? 600 : 400,
  };
}

// ── Nav dots ──────────────────────────────────────────────────────────────────

const SCREENS = ["splash","questionnaire","strip","results","explanation","dashboard"];

function NavDots({ current }) {
  return (
    <div style={{ display:"flex", justifyContent:"center", gap:6, padding:"10px 0 16px" }}>
      {SCREENS.map((s,i) => (
        <div key={s} style={{ width: s===current ? 18 : 6, height:6, borderRadius:3, background: s===current ? COLORS.teal : COLORS.subtle, transition:"width 0.3s, background 0.3s" }}/>
      ))}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function NevaApp() {
  const [screen, setScreen] = useState("splash");
  const [answers, setAnswers] = useState({});
  const [stripData, setStripData] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);

  function handleQDone(ans) {
    setAnswers(ans);
    setScreen("strip");
  }

  function handleStripDone(strip) {
    setStripData(strip);
    const risk = scoreRisk(answers, strip);
    setRiskLevel(risk);
    setScreen("results");
  }

  function handleStripSkip() {
    const risk = scoreRisk(answers, null);
    setRiskLevel(risk);
    setScreen("results");
  }

  return (
    <div style={{ background:COLORS.bg, minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"flex-start", fontFamily:"system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; }
        button { transition: opacity 0.15s, transform 0.1s; }
        button:hover { opacity: 0.88; }
        button:active { transform: scale(0.97); }
        ::-webkit-scrollbar { width: 0; }
      `}</style>
      <div style={{ width:"100%", maxWidth:420, minHeight:"100vh", background:COLORS.card, position:"relative", display:"flex", flexDirection:"column", borderLeft:`1px solid ${COLORS.cardBorder}`, borderRight:`1px solid ${COLORS.cardBorder}` }}>
        <div style={{ flex:1, overflowY:"auto" }}>
          {screen === "splash"         && <Splash onNext={() => setScreen("questionnaire")} />}
          {screen === "questionnaire"  && <Questionnaire onDone={handleQDone} />}
          {screen === "strip"          && <StripCamera onDone={handleStripDone} onSkip={handleStripSkip} />}
          {screen === "results"        && <Results riskLevel={riskLevel} answers={answers} stripData={stripData} onNext={() => setScreen("explanation")} />}
          {screen === "explanation"    && <Explanation riskLevel={riskLevel} onNext={() => setScreen("dashboard")} />}
          {screen === "dashboard"      && <Dashboard riskLevel={riskLevel} />}
        </div>
        <NavDots current={screen} />
      </div>
    </div>
  );
}
