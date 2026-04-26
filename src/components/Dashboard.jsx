import { useState, useEffect } from "react";
import React from "react";
import { RISK_CONFIG } from "../constants";
import { Fire, CheckCircle, Plus, Activity, InfoCircle, ExclamationCircle, Droplet, Lightbulb, Star } from "react-bootstrap-icons";

export function Dashboard({ riskLevel = "low", onBack, onRetake }) {
  const [streak, setStreak] = useState(1);
  const [water, setWater] = useState(0);
  const [hydrationHistory, setHydrationHistory] = useState({});
  const cfg = RISK_CONFIG[riskLevel] || RISK_CONFIG.low;
  const glasses = Array.from({length:8},(_,i)=>i<water);

  useEffect(() => {
    // Load hydration history from localStorage
    const saved = localStorage.getItem("hydrationHistory");
    const history = saved ? JSON.parse(saved) : {};
    setHydrationHistory(history);

    // Calculate streak
    let currentStreak = 1;
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date(today);

    while (history[checkDate.toISOString().split('T')[0]] >= 6) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
      if (currentStreak > 365) break; // Prevent infinite loop
    }
    setStreak(currentStreak);

    // Load today's water intake
    const todayWater = history[today] || 0;
    setWater(todayWater);
  }, []);

  const updateWaterIntake = (amount) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = { ...hydrationHistory, [today]: amount };
    setHydrationHistory(updated);
    setWater(amount);
    localStorage.setItem("hydrationHistory", JSON.stringify(updated));
  };

  const getRiskIcon = () => {
    if (riskLevel === "low") return <CheckCircle size={40} color={cfg.color} fill={cfg.color} />;
    if (riskLevel === "moderate") return <InfoCircle size={40} color={cfg.color} fill={cfg.color} />;
    return <ExclamationCircle size={40} color={cfg.color} fill={cfg.color} />;
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg, #faf9ff 0%, #f4f2fb 40%, #fdf8f5 100%)", padding:"24px", display:"flex", flexDirection:"column" }}>
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
      <div style={{ background:"linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fdba74 100%)", borderRadius:24, padding:"28px", marginBottom:24, border:"none", display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:"0 8px 24px rgba(249,115,22,0.30)", animation:"fadeInUp 0.4s ease both", animationDelay:"0.1s" }}>
        <div>
          <p style={{ color:"rgba(255,255,255,0.8)", fontSize:12, fontWeight:600, textTransform:"uppercase", margin:"0 0 8px", letterSpacing:"0.1em" }}>Current Streak</p>
          <p style={{ fontSize:36, fontWeight:700, color:"#ffffff", margin:0 }}>{streak} days</p>
        </div>
        <div style={{ width:60, height:60, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", animation:"glowPulse 2s ease-in-out infinite" }}>
          <Fire size={32} color="#ffffff" fill="#ffffff" />
        </div>
      </div>

      {/* Last Screening Card */}
      <div style={{ background:"#ffffff", borderRadius:24, padding:"24px", marginBottom:24, border:"1px solid rgba(0,0,0,0.05)", boxShadow:"0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)", animation:"fadeInUp 0.4s ease both", animationDelay:"0.15s" }}>
        <div style={{ height:4, background:cfg.color, borderRadius:"2px", marginBottom:16 }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <p style={{ color:"#9ca3af", fontSize:12, fontWeight:600, textTransform:"uppercase", margin:"0 0 8px", letterSpacing:"0.1em" }}>Last Screening</p>
            <p style={{ fontSize:24, fontWeight:700, color:cfg.color, margin:0 }}>{cfg.label}</p>
          </div>
          {getRiskIcon()}
        </div>
      </div>

      {/* Hydration Card */}
      <div style={{ background:"#ffffff", borderRadius:24, padding:"24px", marginBottom:32, border:"1px solid rgba(0,0,0,0.05)", boxShadow:"0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)", animation:"fadeInUp 0.4s ease both", animationDelay:"0.2s" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <p style={{ color:"#1a1a1a", fontSize:15, fontWeight:600, margin:0 }}>Hydration today</p>
          <p style={{ color:"#06b6d4", fontSize:14, fontWeight:700, margin:0 }}>{water}/8 glasses</p>
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          {glasses.map((full, i) => (
            <button
              key={i}
              onClick={() => updateWaterIntake(i+1)}
              style={{
                flex:1,
                height:48,
                borderRadius:100,
                background: full ? "linear-gradient(180deg, #22d3ee 0%, #06b6d4 100%)" : "#f3f4f6",
                border:"none",
                cursor:"pointer",
                transition:"all 0.2s",
                boxShadow: full ? "0 4px 12px rgba(6,182,212,0.25)" : "none",
                transform: full ? "scale(1.04)" : "scale(1)"
              }}
            />
          ))}
        </div>
        <p style={{ color:"#6b7280", fontSize:13, margin:0 }}>
          {water >= 6 ? "✓ Great hydration! Keep it up." : water >= 4 ? "Keep going — aim for 6–8 glasses." : "Drink more water — kidneys need it."}
        </p>
      </div>

      {/* Hydration History */}
      <div style={{ background:"#ffffff", borderRadius:24, padding:"24px", marginBottom:32, border:"1px solid rgba(0,0,0,0.05)", boxShadow:"0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)", animation:"fadeInUp 0.4s ease both", animationDelay:"0.25s" }}>
        <p style={{ color:"#1a1a1a", fontSize:15, fontWeight:600, margin:"0 0 16px" }}>Last 7 days</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:8 }}>
          {Array.from({length:7}).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayAmount = hydrationHistory[dateStr] || 0;
            const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
            const isToday = i === 0;
            return (
              <div key={i} style={{ textAlign:"center" }}>
                <p style={{ color:"#9ca3af", fontSize:11, fontWeight:600, margin:"0 0 8px" }}>{dayName}</p>
                <div style={{ width:"100%", height:64, background:"#f3f4f6", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", border: isToday ? "2px solid #06b6d4" : "none" }}>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, height:`${(dayAmount/8)*100}%`, background:"linear-gradient(180deg, #22d3ee 0%, #06b6d4 100%)", transition:"height 0.3s" }} />
                  <span style={{ color:"#1a1a1a", fontSize:12, fontWeight:600, position:"relative", zIndex:1 }}>{dayAmount}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Section */}
      <div style={{ marginBottom:32, animation:"fadeInUp 0.4s ease both", animationDelay:"0.3s" }}>
        <p style={{ color:"#1a1a1a", fontSize:15, fontWeight:600, margin:"0 0 16px" }}>Achievements</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[
            { icon: <Droplet size={28} />, label:"First Screen", earned:true, color:"#2563EB", gradient:"linear-gradient(135deg, #2563EB 0%, #1e40af 100%)" },
            { icon: <Fire size={28} />, label:`${streak}-Day Streak`, earned: streak >= 3, color:"#f97316", gradient:"linear-gradient(135deg, #f97316 0%, #dc2626 100%)" },
            { icon: <Lightbulb size={28} />, label:"Hydration Pro", earned: water >= 6, color:"#10b981", gradient:"linear-gradient(135deg, #10b981 0%, #059669 100%)" },
            { icon: <Star size={28} />, label:"30-Day Check", earned: streak >= 30, color:"#eab308", gradient:"linear-gradient(135deg, #eab308 0%, #ca8a04 100%)" },
          ].map((b, i) => (
            <div
              key={i}
              style={{
                background: b.earned ? "#ffffff" : "#f3f4f6",
                border: b.earned ? `1px solid rgba(0,0,0,0.05)` : "1px solid #e5e5e5",
                borderRadius:16,
                padding:"16px",
                textAlign:"center",
                opacity: b.earned ? 1 : 0.6,
                boxShadow: b.earned ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
                transition:"all 0.2s",
                animation: b.earned ? `fadeInScale 0.4s ease both` : "none",
                animationDelay: `${0.35 + i * 0.06}s`
              }}
            >
              <div style={{ width:40, height:40, borderRadius:"50%", background: b.earned ? b.gradient : "#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 8px", boxShadow: b.earned ? `0 4px 12px ${b.color}25` : "none" }}>
                {React.cloneElement(b.icon, { color: b.earned ? "#ffffff" : "#9ca3af", fill: b.earned ? "#ffffff" : "none" })}
              </div>
              <p style={{ color: b.earned ? "#1a1a1a" : "#9ca3af", fontSize:12, fontWeight: b.earned ? 600 : 500, margin:0 }}>{b.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Retake Button */}
      <button
        onClick={onRetake}
        style={{
          width:"100%",
          padding:"16px 24px",
          borderRadius:28,
          border:"none",
          background:"linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)",
          color:"#ffffff",
          fontWeight:700,
          fontSize:16,
          cursor:"pointer",
          boxShadow:"0 8px 24px rgba(99,102,241,0.35)",
          transition:"all 0.2s",
          marginTop:"auto",
          animation:"fadeInUp 0.4s ease both",
          animationDelay:"0.4s"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(99,102,241,0.45)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.35)";
        }}
      >
        Retake Screening
      </button>
    </div>
  );
}
