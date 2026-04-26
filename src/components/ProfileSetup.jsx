import { useState } from "react";
import { COLORS } from "../constants";
import background1Svg from "../assets/Background (1).svg";

export function ProfileSetup({ onNext, onBack, userName: initialName }) {
  const [name, setName] = useState(initialName || "");
  const [error, setError] = useState("");

  function submit() {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setError("");
    onNext({
      name: name.trim(),
    });
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", background:"linear-gradient(180deg, #faf8f6 0%, #f5f3f0 50%, #ffffff 100%)" }}>
      <div style={{ width:"100%", maxWidth:380 }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-start", marginBottom:32, gap:8 }}>
          <img src={background1Svg} alt="Neva Logo" width="20" height="20" />
          <span style={{ color:"#b4a5c9", fontSize:12, letterSpacing:"0.1em", fontWeight:600 }}>NEVA</span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize:28, fontWeight:700, color:"#1a1a1a", margin:"0 0 8px", fontFamily:"system-ui, sans-serif" }}>What's your name?</h1>
        <p style={{ color:"#6b7280", fontSize:15, margin:"0 0 32px", lineHeight:1.5 }}>We'll use this to personalize your assessment.</p>

        {/* Name Input */}
        <div style={{ marginBottom:28 }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            autoFocus
            style={{ width:"100%", padding:16, borderRadius:16, border:`1px solid ${COLORS.cardBorder}`, outline:"none", fontSize:15, fontFamily:"system-ui, sans-serif" }}
          />
        </div>

        {/* Error Message */}
        {error && <div style={{ color:COLORS.red, fontSize:13, marginBottom:20, textAlign:"center" }}>{error}</div>}

        {/* Buttons */}
        <div style={{ display:"flex", gap:12 }}>
          <button
            onClick={onBack}
            style={{
              flex:1,
              padding:16,
              borderRadius:16,
              border:`1px solid ${COLORS.cardBorder}`,
              background:"transparent",
              color:"#1a1a1a",
              fontWeight:700,
              fontSize:15,
              cursor:"pointer",
            }}
          >
            Back
          </button>
          <button
            onClick={submit}
            style={{
              flex:1,
              padding:16,
              borderRadius:16,
              border:"none",
              background:COLORS.primary,
              color:"#ffffff",
              fontWeight:700,
              fontSize:15,
              cursor:"pointer",
              boxShadow:"0 4px 12px rgba(37,99,235,0.25)",
            }}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
