import { RISK_CONFIG, EXPLANATIONS } from "../constants";

export function Explanation({ riskLevel = "low", onNext, onBack }) {
  const explanation = EXPLANATIONS[riskLevel] || EXPLANATIONS.low;
  const { summary, tips } = explanation;
  const cfg = RISK_CONFIG[riskLevel] || RISK_CONFIG.low;

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
          <p style={{ color:"#9ca3af", fontSize:12, letterSpacing:"0.12em", textTransform:"uppercase", fontWeight:600, margin:0 }}>Personalized Guidance</p>
        </div>
      </div>

      {/* Title */}
      <h1 style={{ fontSize:32, fontWeight:700, color:"#1a1a1a", margin:"0 0 24px", fontFamily:"system-ui, sans-serif" }}>
        What this means for you
      </h1>

      {/* Summary Card */}
      <div style={{ background:"#ffffff", borderRadius:20, padding:"24px", marginBottom:32, border:`2px solid ${cfg.color}20`, boxShadow:"0 4px 16px rgba(0,0,0,0.04)" }}>
        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
          <div style={{ width:40, height:40, borderRadius:"50%", background:`${cfg.color}15`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <p style={{ color:"#4b5563", fontSize:15, lineHeight:1.7, margin:0, fontWeight:500 }}>{summary}</p>
        </div>
      </div>

      {/* Recommended Actions */}
      <div style={{ marginBottom:32 }}>
        <p style={{ color:"#1a1a1a", fontSize:15, fontWeight:600, margin:"0 0 16px" }}>Recommended actions</p>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {tips.map((tip, i) => (
            <div key={i} style={{ background:"#ffffff", borderRadius:16, padding:"16px", display:"flex", gap:16, alignItems:"flex-start", border:"1px solid #e5e5e5" }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:cfg.color, color:"#ffffff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, flexShrink:0 }}>
                {i + 1}
              </div>
              <p style={{ color:"#4b5563", fontSize:14, lineHeight:1.6, margin:0 }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background:"#fef3c7", border:"1px solid #fcd34d", borderRadius:16, padding:"16px", marginBottom:32, display:"flex", gap:12, alignItems:"flex-start" }}>
        <div style={{ flexShrink:0, marginTop:2 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <p style={{ color:"#92400e", fontSize:13, lineHeight:1.6, margin:0 }}>
          <strong>Disclaimer:</strong> This is an awareness tool, not a medical diagnosis. Always consult a qualified doctor for professional medical advice.
        </p>
      </div>

      {/* CTA Button */}
      <button onClick={onNext} style={{ width:"100%", padding:"16px 24px", borderRadius:28, border:"none", background:cfg.color, color:"#ffffff", fontWeight:700, fontSize:16, cursor:"pointer", boxShadow:`0 6px 20px ${cfg.color}30`, transition:"all 0.2s", marginTop:"auto" }}>
        Go to My Dashboard →
      </button>
    </div>
  );
}
