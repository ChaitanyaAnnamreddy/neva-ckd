import { RISK_CONFIG, EXPLANATIONS } from "../constants";
import { InfoCircle, ExclamationTriangle } from "react-bootstrap-icons";

export function Explanation({ riskLevel = "low", onNext, onBack }) {
  const explanation = EXPLANATIONS[riskLevel] || EXPLANATIONS.low;
  const { summary, tips } = explanation;
  const cfg = RISK_CONFIG[riskLevel] || RISK_CONFIG.low;

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg, #faf9ff 0%, #f4f2fb 40%, #fdf8f5 100%)", padding:"24px", display:"flex", flexDirection:"column" }}>
      {/* Header with back button */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:32, animation:"fadeInUp 0.4s ease both" }}>
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
      <h1 style={{ fontSize:32, fontWeight:700, color:"#1a1a1a", margin:"0 0 24px", fontFamily:"system-ui, sans-serif", animation:"fadeInUp 0.4s ease both", animationDelay:"0.1s" }}>
        What this means for you
      </h1>

      {/* Summary Card */}
      <div style={{ background:"#ffffff", borderRadius:24, padding:"24px", marginBottom:32, border:"1px solid rgba(0,0,0,0.05)", boxShadow:"0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)", borderLeft:`5px solid ${cfg.color}`, animation:"fadeInUp 0.4s ease both", animationDelay:"0.15s" }}>
        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
          <div style={{ width:40, height:40, borderRadius:"50%", background:`${cfg.color}15`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <InfoCircle size={20} color={cfg.color} />
          </div>
          <p style={{ color:"#4b5563", fontSize:15, lineHeight:1.7, margin:0, fontWeight:500 }}>{summary}</p>
        </div>
      </div>

      {/* Recommended Actions */}
      <div style={{ marginBottom:32, animation:"fadeInUp 0.4s ease both", animationDelay:"0.2s" }}>
        <p style={{ color:"#1a1a1a", fontSize:15, fontWeight:600, margin:"0 0 16px" }}>Recommended actions</p>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {tips.map((tip, i) => (
            <div key={i} style={{ background:"#ffffff", borderRadius:16, padding:"16px", display:"flex", gap:16, alignItems:"flex-start", border:"1px solid rgba(0,0,0,0.05)", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", animation:"fadeInUp 0.4s ease both", animationDelay:`${0.25 + i * 0.08}s` }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:cfg.color, color:"#ffffff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14, flexShrink:0, boxShadow:`0 4px 12px ${cfg.color}30` }}>
                {i + 1}
              </div>
              <p style={{ color:"#4b5563", fontSize:14, lineHeight:1.6, margin:0 }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background:"linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(217,119,6,0.04) 100%)", border:"1px solid rgba(251,146,60,0.2)", borderLeft:`4px solid #f97316`, borderRadius:16, padding:"16px", marginBottom:32, display:"flex", gap:12, alignItems:"flex-start", animation:"fadeInUp 0.4s ease both", animationDelay:"0.5s" }}>
        <div style={{ flexShrink:0, marginTop:2 }}>
          <ExclamationTriangle size={20} color="#ea580c" />
        </div>
        <p style={{ color:"#92400e", fontSize:13, lineHeight:1.6, margin:0 }}>
          <strong>Disclaimer:</strong> This is an awareness tool, not a medical diagnosis. Always consult a qualified doctor for professional medical advice.
        </p>
      </div>

      {/* CTA Button */}
      <button onClick={onNext} style={{ width:"100%", padding:"16px 24px", borderRadius:28, border:"none", background:"linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)", color:"#ffffff", fontWeight:700, fontSize:16, cursor:"pointer", boxShadow:"0 8px 24px rgba(99,102,241,0.35)", transition:"all 0.2s", marginTop:"auto", animation:"fadeInUp 0.4s ease both", animationDelay:"0.55s" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(99,102,241,0.45)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.35)"; }}>
        Go to My Dashboard →
      </button>
    </div>
  );
}
