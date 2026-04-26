import { useState, useEffect } from "react";
import { auth, provider, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { COLORS, SCREENS } from "./constants";
import { scoreRisk } from "./utils/scoreRisk";
import {
  WelcomeScreen,
  SignUpFlow,
  OTPVerification,
  ProfileSetup,
  Splash,
  Questionnaire,
  StripCamera,
  Results,
  Explanation,
  Dashboard,
} from "./components";

function NavDots({ current }) {
  return (
    <div style={{ display:"flex", justifyContent:"center", gap:6, padding:"10px 0 16px" }}>
      {SCREENS.map((s,i) => (
        <div key={s} style={{ width: s===current ? 18 : 6, height:6, borderRadius:3, background: s===current ? COLORS.primary : COLORS.subtle, transition:"width 0.3s, background 0.3s" }}/>
      ))}
    </div>
  );
}

export default function NevaApp() {
  const [screen, setScreen] = useState(() => localStorage.getItem("screen") || "welcome");
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [userName, setUserName] = useState(() => localStorage.getItem("userName") || "");
  const [authMethod, setAuthMethod] = useState("phone");
  const [contactValue, setContactValue] = useState("");
  const [profileData, setProfileData] = useState(() => JSON.parse(localStorage.getItem("profileData") || "null"));
  const [answers, setAnswers] = useState({});
  const [stripData, setStripData] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);
  const [questionnaireStep, setQuestionnaireStep] = useState(0);

  function handleQDone(ans) {
    setAnswers(ans);
    setScreen("strip");
  }

  async function handleStripDone(strip) {
    setStripData(strip);
    const risk = await scoreRisk(answers, strip);
    setRiskLevel(risk);
    setScreen("results");
  }

  async function handleStripSkip() {
    const risk = await scoreRisk(answers, null);
    setRiskLevel(risk);
    setScreen("results");
  }

  function handleStartSignup(method) {
    setAuthMethod(method);
    setScreen("signup");
  }

  function handleSignupSubmit(value) {
    setContactValue(value);
    setScreen("otp");
  }

  function handleOtpVerify() {
    setScreen("profile");
  }

  async function handleProfileSubmit(profile) {
    setProfileData(profile);
    setUserName(profile.name);

    if (user?.uid && db) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          firstName: profile.name,
        }, { merge: true });
      } catch (err) {
        console.error("Failed to save profile to Firebase (OK for development):", err);
      }
    }

    setScreen("splash");
  }

  function handleGoogleSignIn(loggedInUser) {
    if (loggedInUser && loggedInUser.uid) {
      setUser(loggedInUser);
      setUserName(loggedInUser.firstName || "");
      setProfileData({ name: loggedInUser.firstName || "Friend" });
      setScreen("splash");
    }
  }

  function handleLogout() {
    if (auth) {
      signOut(auth).catch(err => console.error("Logout failed:", err));
    }
    setUser(null);
    setUserName("");
    setProfileData(null);
    setAnswers({});
    setStripData(null);
    setRiskLevel(null);
    setScreen("welcome");
    localStorage.clear();
  }

  useEffect(() => {
    localStorage.setItem("screen", screen);
  }, [screen]);

  useEffect(() => {
    localStorage.setItem("userName", userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("profileData", JSON.stringify(profileData));
  }, [profileData]);

  useEffect(() => {
    if (!auth) {
      // Firebase not initialized (development mode without Firebase)
      console.log("Firebase not initialized - skipping auth listener");
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      if (firebaseUser) {
        const firstName = firebaseUser.displayName?.split(" ")[0] || firebaseUser.email?.split("@")[0] || "";
        setUser({ uid: firebaseUser.uid, firstName, email: firebaseUser.email || "" });
        setUserName(firstName);
        setScreen(prev => {
          if (["welcome", "signup", "otp"].includes(prev)) {
            return "splash";
          }
          return prev;
        });
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div style={{ background:COLORS.bg, minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"flex-start", fontFamily:"system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; }
        button { transition: opacity 0.15s, transform 0.1s; }
        button:hover { opacity: 0.88; }
        button:active { transform: scale(0.97); }
        ::-webkit-scrollbar { width: 0; }
      `}</style>
      <div style={{ width:"100%", maxWidth:420, minHeight:"100vh", background:COLORS.card, position:"relative", display:"flex", flexDirection:"column", borderLeft:`1px solid ${COLORS.cardBorder}`, borderRight:`1px solid ${COLORS.cardBorder}` }}>
        <div style={{ flex:1, overflowY:"auto" }}>
          {screen === "welcome"        && <WelcomeScreen onSignIn={handleGoogleSignIn} onChooseMethod={handleStartSignup} />}
          {screen === "signup"         && <SignUpFlow method={authMethod} onNext={handleSignupSubmit} onBack={() => setScreen("welcome")} />}
          {screen === "otp"            && <OTPVerification method={authMethod} target={contactValue} onBack={() => setScreen("signup")} onVerify={handleOtpVerify} />}
          {screen === "profile"        && <ProfileSetup onNext={handleProfileSubmit} onBack={() => setScreen("otp")} userName={userName} />}
          {screen === "splash"         && <Splash onNext={() => setScreen("questionnaire")} userName={userName} />}
          {screen === "questionnaire"  && <Questionnaire onDone={handleQDone} onLogout={handleLogout} onBack={() => setScreen("splash")} user={user} initialStep={questionnaireStep} onStepChange={setQuestionnaireStep} />}
          {screen === "strip"          && <StripCamera onDone={handleStripDone} onSkip={handleStripSkip} onBack={() => setScreen("questionnaire")} userName={userName} onLogout={handleLogout} answers={answers} />}
          {screen === "results"        && <Results riskLevel={riskLevel} answers={answers} stripData={stripData} onNext={() => setScreen("explanation")} onBack={() => setScreen("strip")} />}
          {screen === "explanation"    && <Explanation riskLevel={riskLevel} onNext={() => setScreen("dashboard")} onBack={() => setScreen("results")} />}
          {screen === "dashboard"      && <Dashboard riskLevel={riskLevel} onBack={() => setScreen("explanation")} />}
        </div>
        <NavDots current={screen} />
      </div>
    </div>
  );
}
