import { useState, useEffect, useRef } from "react";
import { collection, doc, addDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Briefcase, Wrench, Shuffle, Activity, HeartPulse, HeartFill, Droplet } from "react-bootstrap-icons";
import { COLORS } from "../constants";
import borderAvatarSvg from "../assets/Background+Border.svg";

const ASSESSMENT_FLOW = [
  { id: "age", title: "Identity", step: "1 of 5", aiText: "Which age group are you in?", options: ["18–29", "30–44", "45–59", "60+"] },
  { id: "gender", title: "Identity", step: "1 of 5", aiText: "Got it. And your gender?", options: ["Female", "Male", "Other", "Prefer not to say"] },
  { id: "conditions", title: "Health Conditions", step: "2 of 5", aiText: "Do you have any of these conditions?", options: ["Diabetes", "High Blood Pressure", "Kidney Issues", "None", "Other"], multi: true },
  { id: "medication", title: "Health Conditions", step: "2 of 5", aiText: "Are you on any regular medication?", options: ["Yes", "No"] },
  { id: "medicationType", title: "Health Conditions", step: "2 of 5", aiText: "Which type?", options: ["BP meds", "Diabetes meds", "Other"], showIf: (ans) => ans.medication === "Yes" },
  { id: "work", title: "Lifestyle", step: "3 of 5", aiText: "What kind of work do you do?", options: ["Desk job", "Field work", "Mixed"] },
  { id: "exercise", title: "Lifestyle", step: "3 of 5", aiText: "How often do you exercise?", options: ["Rarely", "1–2 times/week", "Regularly"] },
  { id: "habits", title: "Lifestyle", step: "3 of 5", aiText: "Do you have any of these habits?", options: ["Smoking", "Alcohol", "None"], multi: true },
  { id: "water", title: "Lifestyle", step: "3 of 5", aiText: "How much water do you drink daily?", options: ["<1L", "1–2L", "2–3L", "3L+"] },
];

export function Questionnaire({ onDone, onLogout, onBack, user, initialStep = 0, onStepChange }) {
  const [step, setStep] = useState(initialStep);
  const [answers, setAnswers] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  const [assessmentDocId, setAssessmentDocId] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (onStepChange) {
      onStepChange(step);
    }
  }, [step, onStepChange]);

  useEffect(() => {
    if (user?.uid && !assessmentDocId) {
      createAssessmentDocument();
    }
  }, [user?.uid, assessmentDocId]);

  async function createAssessmentDocument() {
    try {
      const docRef = await addDoc(collection(doc(db, "users", user.uid), "assessments"), {
        startedAt: serverTimestamp(),
        status: "in_progress",
      });
      console.log("New assessment document created:", docRef.id);
      setAssessmentDocId(docRef.id);
    } catch (err) {
      console.error("Failed to create assessment document:", err);
    }
  }

  async function saveAssessmentData(updatedAnswers) {
    console.log("Updating assessment for user:", user?.uid);
    console.log("Updated answers:", updatedAnswers);

    if (user?.uid && assessmentDocId) {
      const updateData = {};

      if (updatedAnswers.age) updateData['identity.age'] = updatedAnswers.age;
      if (updatedAnswers.gender) updateData['identity.gender'] = updatedAnswers.gender;

      if (updatedAnswers.conditions && updatedAnswers.conditions.length > 0) updateData['healthConditions.conditions'] = updatedAnswers.conditions;
      if (updatedAnswers.medication) updateData['healthConditions.medication'] = updatedAnswers.medication;
      if (updatedAnswers.medicationType) updateData['healthConditions.medicationType'] = updatedAnswers.medicationType;

      if (updatedAnswers.work) updateData['lifestyle.work'] = updatedAnswers.work;
      if (updatedAnswers.exercise) updateData['lifestyle.exercise'] = updatedAnswers.exercise;
      if (updatedAnswers.habits && updatedAnswers.habits.length > 0) updateData['lifestyle.habits'] = updatedAnswers.habits;
      if (updatedAnswers.water) updateData['lifestyle.waterIntake'] = updatedAnswers.water;

      updateData.lastUpdated = serverTimestamp();

      try {
        await updateDoc(doc(db, "users", user.uid, "assessments", assessmentDocId), updateData);
        console.log("Assessment updated successfully");
        console.log("Updated fields:", updateData);
      } catch (err) {
        console.error("Failed to update assessment:", err);
      }
    } else {
      console.warn("Missing user ID or assessment document ID", { user: user?.uid, assessmentDocId });
    }
  }

  const currentQuestion = ASSESSMENT_FLOW[step];
  const totalQuestions = ASSESSMENT_FLOW.filter(q => !q.showIf || q.showIf(answers)).length;
  const visibleQuestions = ASSESSMENT_FLOW.filter((q, i) => i <= step && (!q.showIf || q.showIf(answers))).length;
  const progress = (visibleQuestions / totalQuestions) * 100;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [step]);

  function handleAnswer(val) {
    const newAnswers = { ...answers, [currentQuestion.id]: val };
    setAnswers(newAnswers);
    console.log("handleAnswer called, user object:", user);
    console.log("Calling saveAssessmentData with:", newAnswers);
    saveAssessmentData(newAnswers);

    let nextStep = step + 1;
    while (nextStep < ASSESSMENT_FLOW.length && ASSESSMENT_FLOW[nextStep].showIf && !ASSESSMENT_FLOW[nextStep].showIf(newAnswers)) {
      nextStep++;
    }

    if (nextStep < ASSESSMENT_FLOW.length) {
      setStep(nextStep);
    } else {
      onDone(newAnswers);
    }
  }

  function toggleMultiSelect(val) {
    const current = answers[currentQuestion.id] || [];
    const isArray = Array.isArray(current);
    const selected = isArray ? current : [current].filter(Boolean);

    if (selected.includes(val)) {
      const updated = selected.filter(v => v !== val);
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: updated.length > 0 ? updated : null }));
    } else {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: [...selected, val] }));
    }
  }

  function confirmMultiSelect() {
    const selected = answers[currentQuestion.id];
    if (!selected || (Array.isArray(selected) && selected.length === 0)) return;

    saveAssessmentData(answers);

    let nextStep = step + 1;
    while (nextStep < ASSESSMENT_FLOW.length && ASSESSMENT_FLOW[nextStep].showIf && !ASSESSMENT_FLOW[nextStep].showIf(answers)) {
      nextStep++;
    }

    if (nextStep < ASSESSMENT_FLOW.length) {
      setStep(nextStep);
    } else {
      onDone(answers);
    }
  }

  const selected = answers[currentQuestion.id];
  const selectedArray = Array.isArray(selected) ? selected : (selected ? [selected] : []);

  const getWorkIcon = (option) => {
    switch(option) {
      case "Desk job":
        return <Briefcase size={20} />;
      case "Field work":
        return <Wrench size={20} />;
      case "Mixed":
        return <Shuffle size={20} />;
      default:
        return null;
    }
  };

  const getExerciseIcon = (option) => {
    switch(option) {
      case "Rarely":
        return <Activity size={20} />;
      case "1–2 times/week":
        return <HeartPulse size={20} />;
      case "Regularly":
        return <HeartFill size={20} />;
      default:
        return null;
    }
  };

  const getWaterIcon = (option) => {
    switch(option) {
      case "<1L":
        return <Droplet size={20} />;
      case "1–2L":
        return <Droplet size={20} />;
      case "2–3L":
        return <Droplet size={20} />;
      case "3L+":
        return <Droplet size={20} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:"#FDFBF9", color:"#1a1a1a" }}>
      {/* Header */}
      <div style={{ padding:"16px 24px", borderBottom:"1px solid #e5e5e5", background:"#FDFBF9" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12, position:"relative" }}>
          <button onClick={() => step === 0 ? onBack() : setStep(Math.max(0, step - 1))} style={{ background:"#e8e8e8", border:"none", width:40, height:40, borderRadius:"50%", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", color:"#1a1a1a" }}>←</button>
          <div style={{ textAlign:"center" }}>
            <h2 style={{ color:"#1a1a1a", fontSize:18, fontWeight:700, margin:"0 0 4px" }}>{currentQuestion.title}</h2>
            <p style={{ color:"#9ca3af", fontSize:12, margin:0 }}>{currentQuestion.step}</p>
          </div>
          <div style={{ position:"relative" }}>
            <button onClick={() => setShowMenu(!showMenu)} style={{ background:"#e8e8e8", border:"none", width:40, height:40, borderRadius:"50%", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", color:"#1a1a1a" }}>⋯</button>
            {showMenu && (
              <div style={{ position:"absolute", top:"100%", right:0, marginTop:8, background:"#ffffff", border:"1px solid #e5e5e5", borderRadius:12, boxShadow:"0 4px 12px rgba(0,0,0,0.1)", minWidth:150, zIndex:1000 }}>
                <button onClick={() => { onLogout(); setShowMenu(false); }} style={{ width:"100%", padding:"12px 16px", border:"none", background:"none", color:"#ef4444", cursor:"pointer", textAlign:"left", fontSize:14, fontWeight:500, borderRadius:12 }}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        <div style={{ height:4, background:"#e5e5e5", borderRadius:2 }}>
          <div style={{ width:`${progress}%`, height:"100%", background:"#10b981", borderRadius:2, transition:"width 0.3s" }}/>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex:1, overflowY:"auto", padding:"24px", display:"flex", flexDirection:"column", gap:20, background:"#FDFBF9" }}>
        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
          <img src={borderAvatarSvg} alt="Avatar" width="48" height="48" style={{ flexShrink:0 }} />
          <div style={{ background:"#ffffff", borderRadius:16, padding:"16px 18px", color:"#1a1a1a", fontSize:15, lineHeight:1.5, maxWidth:"85%" }}>
            {currentQuestion.aiText}
          </div>
        </div>

        {/* Selected answers display */}
        {selectedArray.length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginLeft:60 }}>
            {selectedArray.map(val => (
              <div key={val} style={{ background:"#e0e7ff", border:`2px solid ${COLORS.primary}`, borderRadius:20, padding:"8px 16px", color:COLORS.primary, fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:8 }}>
                <span>✓</span>
                {val}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Options */}
      <div style={{ padding:"24px", borderTop:"1px solid #e5e5e5", background:"#FDFBF9" }}>
        {/* Water options with grid */}
        {currentQuestion.id === "water" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:currentQuestion.multi ? 16 : 0 }}>
            {currentQuestion.options.map(opt => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                style={{
                  padding:"16px 12px",
                  borderRadius:16,
                  border:`2px solid ${selectedArray.includes(opt) ? COLORS.primary : "#d1d5db"}`,
                  background: selectedArray.includes(opt) ? "#e0e7ff" : "#ffffff",
                  color: selectedArray.includes(opt) ? COLORS.primary : "#1a1a1a",
                  fontSize:13,
                  fontWeight: selectedArray.includes(opt) ? 600 : 500,
                  cursor:"pointer",
                  display:"flex",
                  flexDirection:"column",
                  alignItems:"center",
                  gap:8,
                  transition:"all 0.2s"
                }}
              >
                <span style={{ fontSize:20, display:"flex", alignItems:"center", justifyContent:"center", width:24, height:24, filter: selectedArray.includes(opt) ? `drop-shadow(0 0 4px ${COLORS.primary})` : "none" }}>
                  {getWaterIcon(opt)}
                </span>
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Regular options */}
        {currentQuestion.id !== "water" && (
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:currentQuestion.multi ? 16 : 0 }}>
            {currentQuestion.options.map(opt => (
              <button
                key={opt}
                onClick={() => currentQuestion.multi ? toggleMultiSelect(opt) : handleAnswer(opt)}
                style={{
                  padding:"12px 16px",
                  borderRadius:24,
                  border:`2px solid ${selectedArray.includes(opt) ? COLORS.primary : "#d1d5db"}`,
                  background: selectedArray.includes(opt) ? "#e0e7ff" : "#ffffff",
                  color: selectedArray.includes(opt) ? COLORS.primary : "#1a1a1a",
                  fontSize:14,
                  fontWeight: selectedArray.includes(opt) ? 600 : 500,
                  cursor:"pointer",
                  display:"flex",
                  alignItems:"center",
                  gap:10,
                  transition:"all 0.2s"
                }}
              >
                <span style={{ fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", width:20, height:20, filter: selectedArray.includes(opt) ? `drop-shadow(0 0 4px ${COLORS.primary})` : "none" }}>
                  {selectedArray.includes(opt) ? "✓" : (currentQuestion.id === "work" && getWorkIcon(opt)) || (currentQuestion.id === "exercise" && getExerciseIcon(opt)) || ""}
                </span>
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Confirm button for multi-select */}
        {currentQuestion.multi && (
          <button onClick={confirmMultiSelect} style={{ width:"100%", padding:"14px", borderRadius:24, border:"none", background:COLORS.primary, color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer", transition:"all 0.2s" }}>
            Confirm Selection
          </button>
        )}
      </div>
    </div>
  );
}
