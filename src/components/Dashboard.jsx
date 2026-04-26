import { useState } from "react";
import { RISK_CONFIG } from "../constants";

export function Dashboard({ riskLevel = "low", onBack }) {
  const [streak] = useState(3);
  const [water, setWater] = useState(5);
  const cfg = RISK_CONFIG[riskLevel] || RISK_CONFIG.low;
  const glasses = Array.from({length:8},(_,i)=>i<water);

  const getRiskIcon = () => {
    if (riskLevel === "low") return (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    );
    if (riskLevel === "moderate") return (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    );
    return (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2">
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
        <div>
          <p style={{ color:"#9ca3af", fontSize:13, margin:"0 0 8px" }}>Good morning</p>
          <h1 style={{ fontSize:32, fontWeight:700, color:"#1a1a1a", margin:0, fontFamily:"system-ui, sans-serif" }}>Your Dashboard</h1>
        </div>
      </div>

      {/* Streak Card */}
      <div style={{ background:"#ffffff", borderRadius:20, padding:"24px", marginBottom:24, border:"1px solid #e5e5e5", display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:"0 4px 16px rgba(0,0,0,0.04)" }}>
        <div>
          <p style={{ color:"#9ca3af", fontSize:12, fontWeight:600, textTransform:"uppercase", margin:"0 0 8px" }}>Current Streak</p>
          <p style={{ fontSize:36, fontWeight:700, color:"#f97316", margin:0 }}>{streak} days</p>
        </div>
        <div style={{ width:60, height:60, borderRadius:"50%", background:"#fed7aa", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#f97316">
            <path d="M13 2H11v5h2V2zm-3.5 1.57L4.93 3.5 6.34 8.07l1.41-1.41zM19 3.5l-5.5 5.5 1.41 1.41L20.07 3.5zM1 11h5v2H1zm17 0h5v2h-5zM4.93 19.07L3.5 20.5l5.57 5.57 1.41-1.41zm13.14.57l-1.41 1.41 5.57 5.57 1.41-1.41z"/>
          </svg>
        </div>
      </div>

      {/* Last Screening Card */}
      <div style={{ background:"#ffffff", borderRadius:20, padding:"24px", marginBottom:24, border:`2px solid ${cfg.color}20`, boxShadow:"0 4px 16px rgba(0,0,0,0.04)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <p style={{ color:"#9ca3af", fontSize:12, fontWeight:600, textTransform:"uppercase", margin:"0 0 8px" }}>Last Screening</p>
            <p style={{ fontSize:24, fontWeight:700, color:cfg.color, margin:0 }}>{cfg.label}</p>
          </div>
          {getRiskIcon()}
        </div>
      </div>

      {/* Hydration Card */}
      <div style={{ background:"#ffffff", borderRadius:20, padding:"24px", marginBottom:32, border:"1px solid #e5e5e5", boxShadow:"0 4px 16px rgba(0,0,0,0.04)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <p style={{ color:"#1a1a1a", fontSize:15, fontWeight:600, margin:0 }}>Hydration today</p>
          <p style={{ color:"#2563EB", fontSize:14, fontWeight:700, margin:0 }}>{water}/8 glasses</p>
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          {glasses.map((full, i) => (
            <button
              key={i}
              onClick={() => setWater(i+1)}
              style={{
                flex:1,
                height:40,
                borderRadius:10,
                background: full ? "#06b6d4" : "#f3f4f6",
                border:"none",
                cursor:"pointer",
                transition:"all 0.2s",
                boxShadow: full ? "0 2px 8px rgba(6,182,212,0.2)" : "none"
              }}
            />
          ))}
        </div>
        <p style={{ color:"#6b7280", fontSize:13, margin:0 }}>
          {water >= 6 ? "✓ Great hydration! Keep it up." : water >= 4 ? "Keep going — aim for 6–8 glasses." : "Drink more water — kidneys need it."}
        </p>
      </div>

      {/* Badges Section */}
      <div style={{ marginBottom:32 }}>
        <p style={{ color:"#1a1a1a", fontSize:15, fontWeight:600, margin:"0 0 16px" }}>Achievements</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[
            { icon:"💧", label:"First Screen", earned:true },
            { icon:"🔥", label:"3-Day Streak", earned:true },
            { icon:"💪", label:"Hydration Pro", earned:false },
            { icon:"⭐", label:"30-Day Check", earned:false },
          ].map((b, i) => (
            <div
              key={i}
              style={{
                background: b.earned ? "#e0e7ff" : "#f3f4f6",
                border: b.earned ? "2px solid #2563EB" : "1px solid #e5e5e5",
                borderRadius:16,
                padding:"16px",
                textAlign:"center",
                opacity: b.earned ? 1 : 0.6,
                transition:"all 0.2s"
              }}
            >
              <div style={{ fontSize:28, marginBottom:8 }}>{b.icon}</div>
              <p style={{ color: b.earned ? "#1a1a1a" : "#9ca3af", fontSize:12, fontWeight: b.earned ? 600 : 500, margin:0 }}>{b.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Retake Button */}
      <button
        style={{
          width:"100%",
          padding:"16px 24px",
          borderRadius:28,
          border:"none",
          background:"#2563EB",
          color:"#ffffff",
          fontWeight:700,
          fontSize:16,
          cursor:"pointer",
          boxShadow:"0 6px 20px rgba(37,99,235,0.3)",
          transition:"all 0.2s",
          marginTop:"auto"
        }}
      >
        Retake Screening
      </button>
    </div>
  );
}
