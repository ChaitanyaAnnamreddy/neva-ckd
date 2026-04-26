import { useState } from "react";
import { COLORS } from "../constants";

export function SignUpFlow({ method, onNext, onBack }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const label = method === "phone" ? "Phone number" : "Email address";
  const placeholder = method === "phone" ? "+91 98765 43210" : "you@example.com";

  function submit() {
    if (!value.trim()) {
      setError("Please enter your details.");
      return;
    }
    if (method === "email" && !value.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (method === "phone" && value.replace(/\D/g, "").length < 6) {
      setError("Enter a valid phone number.");
      return;
    }
    setError("");
    onNext(value.trim());
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px", background:"linear-gradient(180deg,#eff6ff 0%,#f8fafc 45%,#ffffff 100%)" }}>
      <div style={{ width:"100%", maxWidth:420, background:"#fff", borderRadius:24, padding:28, boxShadow:"0 20px 60px rgba(15,23,42,0.08)" }}>
        <h2 style={{ fontSize:28, fontWeight:800, margin:0, color:"#0f172a", fontFamily:"Poppins, system-ui, sans-serif" }}>Sign up</h2>
        <p style={{ color:"#475569", margin:"10px 0 24px" }}>Enter your {label.toLowerCase()} to receive your verification code.</p>
        <label style={{ display:"block", color:"#64748b", fontSize:13, marginBottom:10 }}>{label}</label>
        <input value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} style={{ width:"100%", padding:16, borderRadius:16, border:`1px solid ${COLORS.cardBorder}`, marginBottom:14, outline:"none", fontSize:15, fontFamily:"Poppins, system-ui, sans-serif" }} />
        {error ? <div style={{ color:COLORS.red, marginBottom:14, fontSize:13 }}>{error}</div> : null}
        <button onClick={submit} style={{ width:"100%", padding:16, borderRadius:16, border:"none", background:COLORS.primary, color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer" }}>Send code</button>
        <button onClick={onBack} style={{ width:"100%", padding:16, borderRadius:16, border:`1px solid ${COLORS.cardBorder}`, background:"transparent", color:"#1a1a1a", fontWeight:700, fontSize:15, cursor:"pointer", marginTop:12 }}>Back</button>
      </div>
    </div>
  );
}
