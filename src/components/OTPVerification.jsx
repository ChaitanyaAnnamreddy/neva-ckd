import { useState } from "react";
import { COLORS } from "../constants";

export function OTPVerification({ method, target, onBack, onVerify }) {
  const [code, setCode] = useState("");
  const label = method === "phone" ? "phone" : "email";

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px", background:"linear-gradient(180deg,#eff6ff 0%,#f8fafc 45%,#ffffff 100%)" }}>
      <div style={{ width:"100%", maxWidth:420, background:"#fff", borderRadius:24, padding:28, boxShadow:"0 20px 60px rgba(15,23,42,0.08)" }}>
        <h2 style={{ fontSize:28, fontWeight:800, margin:0, color:"#0f172a", fontFamily:"Poppins, system-ui, sans-serif" }}>Verify {label}</h2>
        <p style={{ color:"#475569", margin:"10px 0 24px" }}>Enter the code sent to {target || label}.</p>
        <input value={code} onChange={e => setCode(e.target.value.replace(/[^0-9]/g, ""))} placeholder="1234" maxLength={6} style={{ width:"100%", padding:16, borderRadius:16, border:`1px solid ${COLORS.cardBorder}`, marginBottom:14, outline:"none", fontSize:18, letterSpacing:"0.24em", textAlign:"center", fontFamily:"Poppins, system-ui, sans-serif" }} />
        <button onClick={onVerify} style={{ width:"100%", padding:16, borderRadius:16, border:"none", background:COLORS.primary, color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer" }}>Verify</button>
        <button onClick={onBack} style={{ width:"100%", padding:16, borderRadius:16, border:`1px solid ${COLORS.cardBorder}`, background:"transparent", color:"#1a1a1a", fontWeight:700, fontSize:15, cursor:"pointer", marginTop:12 }}>Back</button>
      </div>
    </div>
  );
}
