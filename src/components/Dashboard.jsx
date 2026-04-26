import { useState, useEffect } from "react";
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
          <Fire size={32} color="#f97316" fill="#f97316" />
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
              onClick={() => updateWaterIntake(i+1)}
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

      {/* Hydration History */}
      <div style={{ background:"#ffffff", borderRadius:20, padding:"24px", marginBottom:32, border:"1px solid #e5e5e5", boxShadow:"0 4px 16px rgba(0,0,0,0.04)" }}>
        <p style={{ color:"#1a1a1a", fontSize:15, fontWeight:600, margin:"0 0 16px" }}>Last 7 days</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:8 }}>
          {Array.from({length:7}).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayAmount = hydrationHistory[dateStr] || 0;
            const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
            return (
              <div key={i} style={{ textAlign:"center" }}>
                <p style={{ color:"#9ca3af", fontSize:11, fontWeight:600, margin:"0 0 8px" }}>{dayName}</p>
                <div style={{ width:"100%", height:40, background:"#f3f4f6", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, height:`${(dayAmount/8)*100}%`, background:"#06b6d4", transition:"height 0.3s" }} />
                  <span style={{ color:"#1a1a1a", fontSize:12, fontWeight:600, position:"relative", zIndex:1 }}>{dayAmount}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Section */}
      <div style={{ marginBottom:32 }}>
        <p style={{ color:"#1a1a1a", fontSize:15, fontWeight:600, margin:"0 0 16px" }}>Achievements</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[
            { icon: <Droplet size={28} color="#2563EB" fill="#2563EB" />, label:"First Screen", earned:true },
            { icon: <Fire size={28} color="#f97316" fill="#f97316" />, label:`${streak}-Day Streak`, earned: streak >= 3 },
            { icon: <Lightbulb size={28} color="#d1d5db" />, label:"Hydration Pro", earned: water >= 6 },
            { icon: <Star size={28} color="#d1d5db" />, label:"30-Day Check", earned: streak >= 30 },
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
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", marginBottom:8 }}>{b.icon}</div>
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
