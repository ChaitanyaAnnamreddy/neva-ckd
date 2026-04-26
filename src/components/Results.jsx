import { useState, useEffect } from "react";
import { RISK_CONFIG } from "../constants";

export function Results({ riskLevel = "low", answers, stripData, onNext, onBack }) {
  const cfg = RISK_CONFIG[riskLevel] || RISK_CONFIG.low;
  const [animated, setAnimated] = useState(false);
  const [predictionScore, setPredictionScore] = useState(null);
  const [predictionFactors, setPredictionFactors] = useState([]);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
    // Retrieve ML prediction result from session storage
    const stored = sessionStorage.getItem("predictionResult");
    if (stored) {
      try {
        const result = JSON.parse(stored);
        setPredictionScore(result.percentage);
        setPredictionFactors(result.factors || []);
      } catch (e) {
        console.error("Failed to parse prediction result:", e);
      }
    }
  }, []);

  // Use ML model factors if available, otherwise fall back to questionnaire
  let factors = [];
  if (predictionFactors && predictionFactors.length > 0) {
    // Map ML feature names to readable labels
    const featureLabels = {
      hemo: "Low Hemoglobin",
      sc: "High Serum Creatinine",
      al: "Proteinuria (Albumin)",
      bgr: "High Blood Glucose",
      bu: "High Blood Urea",
      sg: "Low Specific Gravity",
      rbc: "Red Blood Cell Issues",
      pc: "Protein Casts",
      htn: "Hypertension",
      dm: "Diabetes",
      age: "Age Risk Factor",
      pe: "Peripheral Edema",
      ane: "Anemia",
      wbc: "White Blood Cell Casts",
      ba: "Bacteria Present",
    };
    factors = predictionFactors.map(f => featureLabels[f] || f);
  } else {
    // Fallback to questionnaire-based factors
    if (answers?.conditions?.includes("Diabetes")) factors.push("Diabetes history");
    if (answers?.conditions?.includes("High Blood Pressure")) factors.push("High blood pressure");
    if (answers?.conditions?.includes("Kidney Issues")) factors.push("Kidney issues");
    if (stripData?.protein && stripData.protein !== "Neg") factors.push(`Protein in urine (${stripData.protein})`);
    if (answers?.water === "<1L") factors.push("Low hydration");
  }

  const getRiskIcon = () => {
    if (riskLevel === "low") return (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    );
    if (riskLevel === "moderate") return (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    );
    return (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    );
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(180deg, #faf8f6 0%, #f5f3f0 50%, #ffffff 100%)", padding:"24px", display:"flex", flexDirection:"column" }}>
      {/* Header with back button */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:32 }}>
        {onBack && (
          <button
            onClick={onBack}
            type="button"
            style={{
              background:"#e5e7eb",
              border:"none",
              width:40,
              height:40,
              borderRadius:"50%",
              cursor:"pointer",
              fontSize:18,
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              color:"#1a1a1a",
              transition:"all 0.2s",
              flexShrink:0
            }}
            onMouseEnter={(e) => e.target.style.background = "#d1d5db"}
            onMouseLeave={(e) => e.target.style.background = "#e5e7eb"}
          >
            ←
          </button>
        )}
        <p style={{ color:"#9ca3af", fontSize:12, letterSpacing:"0.12em", textTransform:"uppercase", fontWeight:600, margin:0 }}>Assessment Result</p>
      </div>

      {/* Risk Card */}
      <div style={{ background:"#ffffff", borderRadius:24, padding:"32px 24px", textAlign:"center", marginBottom:32, border:`1px solid ${cfg.color}20`, boxShadow:"0 4px 16px rgba(0,0,0,0.04)" }}>
        <div style={{ marginBottom:20 }}>
          {getRiskIcon()}
        </div>
        <h1 style={{ fontSize:32, fontWeight:700, color:"#1a1a1a", margin:"0 0 8px", fontFamily:"system-ui, sans-serif" }}>
          {cfg.label}
        </h1>
        <p style={{ color:"#6b7280", fontSize:15, margin:0 }}>Kidney health risk assessment</p>
      </div>

      {/* Risk Score */}
      <div style={{ background:"#ffffff", borderRadius:20, padding:"24px", marginBottom:32, border:"1px solid #e5e5e5" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <div>
            <p style={{ color:"#9ca3af", fontSize:12, fontWeight:600, textTransform:"uppercase", margin:"0 0 8px" }}>Risk Score</p>
            <p style={{ fontSize:36, fontWeight:700, color:cfg.color, margin:0 }}>{predictionScore !== null ? predictionScore : cfg.bar}%</p>
          </div>
          <div style={{ textAlign:"right" }}>
            <p style={{ color:"#9ca3af", fontSize:12, margin:"0 0 8px" }}>Assessment Range</p>
            <div style={{ display:"flex", gap:8 }}>
              <div style={{ width:32, height:8, background:"#e0e7ff", borderRadius:4 }} />
              <div style={{ width:32, height:8, background:"#fef3c7", borderRadius:4 }} />
              <div style={{ width:32, height:8, background:"#fee2e2", borderRadius:4 }} />
            </div>
          </div>
        </div>
        <div style={{ height:12, background:"#f3f4f6", borderRadius:6, overflow:"hidden" }}>
          <div style={{ width: animated ? `${predictionScore !== null ? predictionScore : cfg.bar}%` : "0%", height:"100%", background:cfg.color, borderRadius:6, transition:"width 1s cubic-bezier(0.4,0,0.2,1)" }}/>
        </div>
      </div>

      {/* Risk Trajectory */}
      <div style={{ background:"#ffffff", borderRadius:20, padding:"24px", marginBottom:32, border:"1px solid #e5e5e5" }}>
        <p style={{ color:"#1a1a1a", fontSize:15, fontWeight:600, margin:"0 0 20px" }}>Risk Trajectory</p>
        <div style={{ height:200, position:"relative", marginBottom:16 }}>
          {/* Grid lines */}
          <svg width="100%" height="100%" style={{ position:"absolute", top:0, left:0 }}>
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor={cfg.color} />
              </linearGradient>
            </defs>
            {/* Horizontal grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <line key={i} x1="0" y1={`${i * 50}`} x2="100%" y2={`${i * 50}`} stroke="#e5e5e5" strokeWidth="1" />
            ))}
            {/* Curve path */}
            <polyline
              points="0,120 50,100 100,80 150,70 200,60"
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: animated ? 1 : 0, transition:"opacity 0.8s" }}
            />
            {/* Data points */}
            <circle cx="0" cy="120" r="4" fill="#22c55e" style={{ opacity: animated ? 1 : 0, transition:"opacity 0.8s" }} />
            <circle cx="50" cy="100" r="4" fill="#22c55e" style={{ opacity: animated ? 1 : 0, transition:"opacity 0.8s 0.2s" }} />
            <circle cx="100" cy="80" r="4" fill="#f97316" style={{ opacity: animated ? 1 : 0, transition:"opacity 0.8s 0.4s" }} />
            <circle cx="150" cy="70" r="4" fill="#f97316" style={{ opacity: animated ? 1 : 0, transition:"opacity 0.8s 0.6s" }} />
            <circle cx="200" cy="60" r="5" fill={cfg.color} stroke="#ffffff" strokeWidth="2" style={{ opacity: animated ? 1 : 0, transition:"opacity 0.8s 0.8s" }} />
          </svg>
        </div>
        {/* Legend */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, fontSize:12 }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ width:8, height:8, background:"#22c55e", borderRadius:"50%", margin:"0 auto 4px" }} />
            <p style={{ color:"#6b7280", margin:0 }}>Week 1</p>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ width:8, height:8, background:"#f97316", borderRadius:"50%", margin:"0 auto 4px" }} />
            <p style={{ color:"#6b7280", margin:0 }}>Week 3</p>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ width:8, height:8, background:cfg.color, borderRadius:"50%", margin:"0 auto 4px" }} />
            <p style={{ color:"#6b7280", margin:0 }}>Today</p>
          </div>
        </div>
      </div>

      {/* Contributing Factors */}
      {factors.length > 0 && (
        <div style={{ marginBottom:32 }}>
          <p style={{ color:"#1a1a1a", fontSize:15, fontWeight:600, margin:"0 0 16px" }}>Key contributing factors</p>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {factors.map((f, i) => (
              <div key={i} style={{ background:"#ffffff", borderRadius:16, padding:"16px", display:"flex", alignItems:"center", gap:12, border:"1px solid #e5e5e5" }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:`${cfg.color}15`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2.5">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                  </svg>
                </div>
                <span style={{ color:"#4b5563", fontSize:14, fontWeight:500 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Button */}
      <button onClick={onNext} style={{ width:"100%", padding:"16px 24px", borderRadius:28, border:"none", background:cfg.color, color:"#ffffff", fontWeight:700, fontSize:16, cursor:"pointer", boxShadow:`0 6px 20px ${cfg.color}30`, transition:"all 0.2s", marginTop:"auto" }}>
        See Personalised Advice →
      </button>
    </div>
  );
}
