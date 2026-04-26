import { useState } from "react";
import { auth, provider, db } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { Telephone, Envelope, ShieldCheck } from "react-bootstrap-icons";
import { COLORS } from "../constants";

export function WelcomeScreen({ onSignIn, onChooseMethod }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleClick() {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const firstName = firebaseUser.displayName?.split(" ")[0] || firebaseUser.email?.split("@")[0] || "User";

      await setDoc(doc(db, "users", firebaseUser.uid), {
        uid: firebaseUser.uid,
        firstName,
        email: firebaseUser.email || "",
        createdAt: serverTimestamp(),
      }, { merge: true });

      onSignIn({ uid: firebaseUser.uid, firstName, email: firebaseUser.email || "" });
      setLoading(false);
    } catch (err) {
      console.error("Google sign-in failed:", err);
      setError("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", background:"linear-gradient(160deg, #f0edff 0%, #faf5ff 55%, #fff8f3 100%)" }}>
      <div style={{ width:"100%", maxWidth:360, textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", animation:"fadeInScale 0.5s ease both" }}>
        {/* Logo */}
        <div style={{ position:"relative", width:100, height:100, marginBottom:32 }}>
          {/* Outer glow */}
          <div style={{ position:"absolute", inset:-16, borderRadius:"50%", background:"radial-gradient(circle at 50% 50%, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 50%, transparent 70%)" }}/>
          {/* Logo circle */}
          <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#e5e0fa", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 24px rgba(99,102,241,0.2)" }}>
            <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="16" fill="none"/>
              <path d="M11.8333 19.5834C13.6667 19.5834 15.1667 18.0584 15.1667 16.2084C15.1667 15.2417 14.6917 14.325 13.7417 13.55C12.7917 12.775 12.075 11.625 11.8333 10.4167C11.5917 11.625 10.8833 12.7834 9.925 13.55C8.96667 14.3167 8.5 15.25 8.5 16.2084C8.5 18.0584 10 19.5834 11.8333 19.5834" stroke="#4C3B9E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.4667 11.5C17.0393 10.584 17.4456 9.57405 17.6667 8.51666C18.0833 10.6 19.3333 12.6 21 13.9333C22.6667 15.2667 23.5 16.85 23.5 18.5167C23.5098 20.8725 22.0976 23.0015 19.9235 23.9087C17.7493 24.816 15.2427 24.3223 13.575 22.6583" stroke="#4C3B9E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 style={{ fontSize:36, fontWeight:800, color:"#1a1a1a", margin:"0 0 4px", fontFamily:"system-ui, sans-serif", animation:"fadeInUp 0.5s ease both", animationDelay:"0.1s" }}>Welcome to Neva</h1>
        <p style={{ fontSize:28, margin:"0 0 24px", animation:"fadeInUp 0.5s ease both", animationDelay:"0.15s" }}>👋</p>

        {/* Subheading */}
        <p style={{ color:"#9ca3af", fontSize:18, margin:"0 0 40px", fontFamily:"system-ui, sans-serif", animation:"fadeInUp 0.5s ease both", animationDelay:"0.2s" }}>Let's get you started</p>
      </div>

      {/* Sign-in Options */}
      <div style={{ width:"100%", maxWidth:360, display:"flex", flexDirection:"column", gap:14, animation:"fadeInUp 0.5s ease both", animationDelay:"0.25s" }}>
        {/* Google Button */}
        <button onClick={handleGoogleClick} disabled={loading} style={{ width:"100%", padding:"16px 20px", borderRadius:24, border:"1px solid rgba(0,0,0,0.08)", background:"#ffffff", color:"#1a1a1a", fontWeight:600, fontSize:15, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, display:"flex", alignItems:"center", justifyContent:"center", gap:12, boxShadow:"0 4px 12px rgba(0,0,0,0.08)", fontFamily:"system-ui, sans-serif", transition:"all 0.2s" }} onMouseEnter={(e) => !loading && (e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)")} onMouseLeave={(e) => !loading && (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)")}>
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.3 30.2 0 24 0 14.8 0 7 5.4 3.2 13.3l7.9 6.1C13 13.5 18 9.5 24 9.5z"/>
            <path fill="#34A853" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.4c-.5 2.8-2.1 5.1-4.5 6.7l7 5.4C43.1 36.8 46.1 31 46.1 24.5z"/>
            <path fill="#4A90D9" d="M11.1 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.7-4.6l-7.9-6.1A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.8l8.6-6.2z"/>
            <path fill="#FBBC05" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7-5.4c-2.2 1.5-5 2.3-8.9 2.3-6 0-11-4-12.9-9.5l-8.6 6.2C7 43 15 48 24 48z"/>
          </svg>
          <span>{loading ? "Signing in..." : "Continue with Google"}</span>
        </button>
        {error && <div style={{ color: "#ef4444", fontSize: 13, textAlign: "center", animation:"fadeInUp 0.3s ease both" }}>{error}</div>}

        {/* Divider */}
        <div style={{ display:"flex", alignItems:"center", gap:12, margin:"8px 0" }}>
          <div style={{ flex:1, height:"1px", background:"#e5e7eb" }}/>
          <span style={{ color:"#9ca3af", fontSize:13, fontWeight:500 }}>OR</span>
          <div style={{ flex:1, height:"1px", background:"#e5e7eb" }}/>
        </div>

        {/* Phone Button */}
        <button onClick={() => onChooseMethod("phone")} style={{ width:"100%", padding:"16px 20px", borderRadius:24, border:"none", background:"linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)", color:"#ffffff", fontWeight:600, fontSize:15, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:12, boxShadow:"0 8px 24px rgba(99,102,241,0.35)", fontFamily:"system-ui, sans-serif", transition:"all 0.2s", animation:"slideUp 0.4s ease both", animationDelay:"0.3s" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(99,102,241,0.45)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.35)"; }}>
          <Telephone size={20} />
          <span>Continue with Phone</span>
        </button>

        {/* Email Button */}
        <button onClick={() => onChooseMethod("email")} style={{ width:"100%", padding:"16px 20px", borderRadius:24, border:"none", background:"linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)", color:"#ffffff", fontWeight:600, fontSize:15, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:12, boxShadow:"0 8px 24px rgba(99,102,241,0.35)", fontFamily:"system-ui, sans-serif", transition:"all 0.2s", animation:"slideUp 0.4s ease both", animationDelay:"0.35s" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(99,102,241,0.45)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.35)"; }}>
          <Envelope size={20} />
          <span>Continue with Email</span>
        </button>
      </div>

      {/* Security Note */}
      <div style={{ marginTop:40, display:"flex", alignItems:"center", justifyContent:"center", gap:8, animation:"fadeInUp 0.5s ease both", animationDelay:"0.4s" }}>
        <ShieldCheck size={20} color="#10b981" />
        <span style={{ color:"#9ca3af", fontSize:13, fontFamily:"system-ui, sans-serif" }}>Your data is private & secure</span>
      </div>
    </div>
  );
}
