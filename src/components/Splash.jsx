import { useState } from "react";
import avatarSvg from "../assets/Avatar Image.svg";
import background1Svg from "../assets/Background (1).svg";

export function Splash({ onNext, userName }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100%", padding:"32px 24px", textAlign:"center", background:"linear-gradient(180deg, #faf8f6 0%, #f5f3f0 50%, #ffffff 100%)" }}>
      {/* Header with logo and title */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-start", width:"100%", marginBottom:40, gap:8 }}>
        <img src={background1Svg} alt="Neva Logo" width="20" height="20" />
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"100%", marginBottom:40 }}>
        <span style={{ color:"#b4a5c9", fontSize:12, letterSpacing:"0.1em", fontWeight:600 }}>NEVA</span>
      </div>

      {/* Avatar with glow */}
      <div style={{ position:"relative", marginBottom:40 }}>
        <div style={{ position:"absolute", inset:-20, borderRadius:"50%", background:"radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0.05) 100%)" }}/>
        <img src={avatarSvg} alt="Neva Avatar" width="140" height="140" style={{ position:"relative", filter:"drop-shadow(0 12px 40px rgba(37,99,235,0.15))", borderRadius:"50%" }} />
      </div>

      {/* Greeting */}
      <h1 style={{ fontFamily:"system-ui, sans-serif", fontSize:26, fontWeight:400, color:"#1a1a1a", margin:"0 0 20px", lineHeight:1.3 }}>
        Hi {userName || "Friend"}, I'm Neva AI
      </h1>

      {/* Card with info */}
      <div style={{ background:"#ffffff", borderRadius:20, padding:"24px", marginBottom:28, border:"1px solid rgba(0,0,0,0.06)", boxShadow:"0 4px 16px rgba(0,0,0,0.04)", width:"100%", maxWidth:320 }}>
        <p style={{ color:"#1a1a1a", fontSize:16, fontWeight:500, lineHeight:1.5, margin:"0 0 10px" }}>
          Let's check your kidney health
        </p>
        <p style={{ color:"#6b7280", fontSize:14, margin:0 }}>
          This will take less than 2 minutes.
        </p>
      </div>

      {/* Privacy badge */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginBottom:32, background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:16, padding:"8px 14px" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
        <span style={{ color:"#059669", fontSize:12, fontWeight:500 }}>This is private and not a diagnosis</span>
      </div>

      {/* CTA Button */}
      <button onClick={onNext} style={{ width:"100%", maxWidth:300, padding:"16px 32px", borderRadius:28, border:"none", background:"linear-gradient(135deg, #6366f1 0%, #5b5cef 100%)", color:"#ffffff", fontWeight:700, fontSize:16, cursor:"pointer", boxShadow:"0 6px 20px rgba(99,102,241,0.3)", marginBottom:28, fontFamily:"system-ui, sans-serif", transition:"all 0.2s" }}>
        Start Assessment →
      </button>

      {/* Audio button */}
      <button onClick={() => setIsPlaying(!isPlaying)} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:"none", border:"none", color:"#6366f1", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"system-ui, sans-serif", transition:"opacity 0.2s" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#c7d2fe">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 8v8M9 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span>Tap to hear this</span>
      </button>
    </div>
  );
}
