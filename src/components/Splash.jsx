import { useState } from "react";
import { ShieldCheck, PlayCircle } from "react-bootstrap-icons";
import avatarSvg from "../assets/Avatar Image.svg";
import background1Svg from "../assets/Background (1).svg";

export function Splash({ onNext, userName }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudioClick = () => {
    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const text = `Hi ${userName || "Friend"}, I'm Neva AI. Let's check your kidney health. This will take less than 2 minutes. Click on Start Assessment to begin.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      setIsPlaying(true);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100%", padding:"32px 24px", textAlign:"center", background:"linear-gradient(160deg, #f0edff 0%, #faf5ff 55%, #fff8f3 100%)" }}>
      {/* Header with logo and title */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-start", width:"100%", marginBottom:40, gap:8 }}>
        <img src={background1Svg} alt="Neva Logo" width="20" height="20" />
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"100%", marginBottom:40 }}>
        <span style={{ color:"#b4a5c9", fontSize:12, letterSpacing:"0.1em", fontWeight:600 }}>NEVA</span>
      </div>

      {/* Avatar with multi-ring glow */}
      <div style={{ position:"relative", marginBottom:40 }}>
        {/* Outer ambient glow */}
        <div style={{ position:"absolute", inset:-32, borderRadius:"50%", background:"radial-gradient(circle at 50% 50%, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 50%, transparent 70%)" }}/>
        {/* Middle ring */}
        <div style={{ position:"absolute", inset:-12, borderRadius:"50%", border:"1.5px solid rgba(99,102,241,0.12)" }}/>
        <img src={avatarSvg} alt="Neva Avatar" width="140" height="140" style={{ position:"relative", filter:"drop-shadow(0 16px 40px rgba(99,102,241,0.20))", borderRadius:"50%", animation:"fadeInScale 0.5s ease both", animationDelay:"0.1s" }} />
      </div>

      {/* Greeting */}
      <h1 style={{ fontFamily:"system-ui, sans-serif", fontSize:26, fontWeight:400, color:"#1a1a1a", margin:"0 0 20px", lineHeight:1.3 }}>
        Hi {userName || "Friend"}, I'm Neva AI
      </h1>

      {/* Card with info */}
      <div style={{ background:"#ffffff", borderRadius:24, padding:"24px", marginBottom:24, border:"1px solid rgba(0,0,0,0.05)", boxShadow:"0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)", width:"100%", maxWidth:340, animation:"fadeInUp 0.5s ease both", animationDelay:"0.2s" }}>
        <p style={{ color:"#1a1a1a", fontSize:16, fontWeight:500, lineHeight:1.5, margin:"0 0 10px" }}>
          Let's check your kidney health
        </p>
        <p style={{ color:"#6b7280", fontSize:14, margin:0 }}>
          This will take less than 2 minutes.
        </p>
      </div>

      {/* Privacy badge */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:28, background:"linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(5,150,105,0.06) 100%)", border:"1.5px solid rgba(16,185,129,0.20)", borderRadius:100, padding:"8px 18px", animation:"fadeInUp 0.5s ease both", animationDelay:"0.3s" }}>
        <ShieldCheck size={16} color="#10b981" />
        <span style={{ color:"#059669", fontSize:12, fontWeight:500 }}>This is private and not a diagnosis</span>
      </div>

      {/* CTA Button */}
      <button onClick={onNext} style={{ width:"100%", maxWidth:320, padding:"18px 32px", borderRadius:28, border:"none", background:"linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)", color:"#ffffff", fontWeight:700, fontSize:16, cursor:"pointer", boxShadow:"0 8px 24px rgba(99,102,241,0.35)", marginBottom:20, fontFamily:"system-ui, sans-serif", transition:"transform 0.15s ease, box-shadow 0.15s ease", letterSpacing:"0.02em", animation:"fadeInUp 0.5s ease both", animationDelay:"0.4s" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(99,102,241,0.45)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.35)"; }}>
        Start Assessment →
      </button>

      {/* Audio button */}
      <button onClick={handleAudioClick} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:"rgba(99,102,241,0.08)", border:"1.5px solid rgba(99,102,241,0.18)", borderRadius:100, padding:"10px 20px", color:"#6366f1", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"system-ui, sans-serif", transition:"all 0.2s ease", opacity: isPlaying ? 0.7 : 1 }}>
        <PlayCircle size={18} color="#c7d2fe" fill="#c7d2fe" />
        <span>{isPlaying ? "Playing..." : "Tap to hear this"}</span>
      </button>
    </div>
  );
}
