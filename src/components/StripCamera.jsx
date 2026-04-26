import { useState, useRef } from "react";
import { CheckLg, Clock, Circle, Camera, CheckCircle } from "react-bootstrap-icons";
import { COLORS, STRIP_BANDS } from "../constants";
import expandIcon from "../assets/SVG (3).svg";
import hydrationIcon from "../assets/Background (2).svg";
import borderAvatarSvg from "../assets/Background+Border.svg";
import cameraIcon from "../assets/camera.svg";
import scannerSvg from "../assets/scanner.svg";
import instruction1Svg from "../assets/Collect Urine Sample.svg";
import instruction2Svg from "../assets/Place strip in holder inside box.svg";
import instruction3Svg from "../assets/Infographic Area.svg";
import instruction4Svg from "../assets/Scan using Neva app.svg";

export function StripCamera({ onDone, onSkip, onBack, userName, onLogout, answers }) {
  const [mode, setMode] = useState("intro");
  const [stripData, setStripData] = useState({});
  const [selected, setSelected] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  const [instructionStep, setInstructionStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef(null);

  // Function to get reading status and color
  function getReadingStatus(testName, value) {
    const statusMap = {
      protein: {
        "Neg": { label: "Normal", color: "#10b981" },
        "Trace": { label: "Mild", color: "#f59e0b" },
        "1+": { label: "Moderate", color: "#f59e0b" },
        "2+": { label: "High", color: "#ef4444" },
        "3+": { label: "High", color: "#ef4444" }
      },
      glucose: {
        "Neg": { label: "Normal", color: "#10b981" },
        "Trace": { label: "Low", color: "#06b6d4" },
        "+": { label: "Moderate", color: "#f59e0b" },
        "2+": { label: "High", color: "#ef4444" }
      },
      ph: {
        "5": { label: "Acidic", color: "#06b6d4" },
        "6": { label: "Normal", color: "#10b981" },
        "7": { label: "Normal", color: "#10b981" },
        "8": { label: "Alkaline", color: "#f59e0b" },
        "9": { label: "High", color: "#ef4444" }
      },
      blood: {
        "Neg": { label: "Normal", color: "#10b981" },
        "Trace": { label: "Low", color: "#06b6d4" },
        "1+": { label: "Moderate", color: "#f59e0b" },
        "2+": { label: "High", color: "#ef4444" }
      },
      pusCells: {
        "Neg": { label: "Normal", color: "#10b981" },
        "+": { label: "Moderate", color: "#f59e0b" },
        "2+": { label: "High", color: "#ef4444" }
      }
    };

    return statusMap[testName]?.[value] || { label: "Unknown", color: "#9ca3af" };
  }

  // Function to generate realistic strip results based on health answers
  function generateStripResults() {
    const results = {};

    // Protein: affected by kidney conditions, diabetes, high BP
    if (answers?.conditions?.includes("Kidney Issues")) {
      results.protein = ["1+", "2+"][Math.floor(Math.random() * 2)];
    } else if (answers?.conditions?.includes("Diabetes") || answers?.conditions?.includes("High Blood Pressure")) {
      results.protein = Math.random() > 0.7 ? "Trace" : "Neg";
    } else {
      results.protein = "Neg";
    }

    // Glucose: affected by diabetes
    if (answers?.conditions?.includes("Diabetes")) {
      results.glucose = ["+", "2+", "Trace"][Math.floor(Math.random() * 3)];
    } else {
      results.glucose = Math.random() > 0.9 ? "Trace" : "Neg";
    }

    // pH: affected by hydration and habits
    const hydrationLevel = answers?.water || "<1L";
    if (hydrationLevel === "<1L") {
      results.ph = ["5", "6"][Math.floor(Math.random() * 2)];
    } else if (hydrationLevel === "3L+") {
      results.ph = ["7", "8"][Math.floor(Math.random() * 2)];
    } else {
      results.ph = "6";
    }

    // Blood: affected by kidney issues
    if (answers?.conditions?.includes("Kidney Issues")) {
      results.blood = ["Trace", "1+"][Math.floor(Math.random() * 2)];
    } else {
      results.blood = "Neg";
    }

    // Pus cells: affected by kidney issues and urinary symptoms
    if (answers?.conditions?.includes("Kidney Issues")) {
      results.pusCells = ["+", "2+"][Math.floor(Math.random() * 2)];
    } else {
      results.pusCells = "Neg";
    }

    // Specific gravity: based on hydration
    const waterToSg = { "<1L": "1.010", "1–2L": "1.015", "2–3L": "1.020", "3L+": "1.025" };
    results.sg = waterToSg[answers?.water] || "1.015";

    return results;
  }

  const INSTRUCTIONS = [
    {
      step: 1,
      title: "Collect urine sample",
      description: "Use wipes if necessary",
      svg: instruction1Svg,
    },
    {
      step: 2,
      title: "Dip the strip",
      description: "Hold strip for 2 seconds",
      svg: instruction2Svg,
    },
    {
      step: 3,
      title: "Remove excess liquid",
      description: "Tap against the bottle",
      svg: instruction3Svg,
    },
    {
      step: 4,
      title: "Wait and scan",
      description: "Results appear in 60 seconds",
      svg: instruction4Svg,
    },
  ];

  function handleViewInstructions() {
    setMode("instructions");
    setInstructionStep(1);
  }

  function handleNextStep() {
    if (instructionStep < 4) {
      setInstructionStep(instructionStep + 1);
    } else {
      setMode("camera");
    }
  }

  function handleFileSelect(event) {
    const file = event.target.files?.[0];
    if (file) {
      setIsScanning(true);
      setTimeout(() => {
        const generatedResults = generateStripResults();
        setMode("results");
        setStripData(generatedResults);
        setSelected(generatedResults);
        setIsScanning(false);
      }, 3000);
    }
  }

  function openCamera() {
    fileInputRef.current?.click();
  }

  function handleBackStep() {
    if (instructionStep > 1) {
      setInstructionStep(instructionStep - 1);
    } else {
      setMode("intro");
    }
  }

  if (mode === "intro") return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:"#FDFBF9" }}>
      {/* Header */}
      <div style={{ padding:"16px 24px", borderBottom:"1px solid #e5e5e5", background:"#FDFBF9" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <button onClick={onBack} style={{ background:"#e8e8e8", border:"none", width:40, height:40, borderRadius:"50%", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", color:"#1a1a1a" }}>←</button>
          <div style={{ textAlign:"center" }}>
            <h2 style={{ color:"#1a1a1a", fontSize:18, fontWeight:700, margin:"0 0 4px" }}>Insight</h2>
            <p style={{ color:"#9ca3af", fontSize:12, margin:0 }}>Step 5 of 5</p>
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
          <div style={{ width:"100%", height:"100%", background:"#10b981", borderRadius:2 }}/>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:"auto", padding:"24px", display:"flex", flexDirection:"column", gap:20 }}>
        {/* AI Greeting */}
        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
          <img src={borderAvatarSvg} alt="Avatar" width="48" height="48" style={{ flexShrink:0 }} />
          <div style={{ background:"#ffffff", borderRadius:16, padding:"16px 18px", color:"#1a1a1a", fontSize:15, lineHeight:1.5, maxWidth:"85%" }}>
            Thanks, {userName || "Friend"}. Here's a quick insight 👋
          </div>
        </div>

        {/* Insight Cards */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ background:"linear-gradient(135deg, #f3e8ff 0%, #fce7f3 50%, #fff5ee 100%)", borderRadius:20, padding:"20px", display:"flex", gap:16, alignItems:"flex-start", border:"1px solid rgba(233,213,255,0.4)" }}>
            <img src={hydrationIcon} alt="Hydration" width="48" height="48" style={{ flexShrink:0 }} />
            <div>
              <h3 style={{ color:"#1a1a1a", fontSize:16, fontWeight:700, margin:"0 0 8px" }}>Hydration Notice</h3>
              <p style={{ color:"#4b5563", fontSize:14, lineHeight:1.6, margin:0 }}>You might not be drinking enough water for your lifestyle. Increasing intake to 2–3L could help.</p>
            </div>
          </div>

          <div style={{ background:"linear-gradient(135deg, #f3e8ff 0%, #fce7f3 50%, #fff5ee 100%)", borderRadius:20, padding:"20px", display:"flex", gap:16, alignItems:"flex-start", border:"1px solid rgba(233,213,255,0.4)" }}>
            <img src={hydrationIcon} alt="Energy" width="48" height="48" style={{ flexShrink:0 }} />
            <div>
              <h3 style={{ color:"#1a1a1a", fontSize:16, fontWeight:700, margin:"0 0 8px" }}>Exercise Reminder</h3>
              <p style={{ color:"#4b5563", fontSize:14, lineHeight:1.6, margin:0 }}>Your current workout routine might be not sufficient as per your lifestyle.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div style={{ padding:"24px", borderTop:"1px solid #e5e5e5", background:"#FDFBF9" }}>
        <button onClick={handleViewInstructions} style={{ width:"100%", padding:"16px 24px", borderRadius:28, border:"none", background:COLORS.primary, color:"#ffffff", fontWeight:700, fontSize:16, cursor:"pointer", boxShadow:"0 6px 20px rgba(37,99,235,0.3)", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
          View instructions
          <img src={expandIcon} alt="expand" width="20" height="20" style={{ filter:"brightness(0) invert(1)" }} />
        </button>
      </div>
    </div>
  );

  if (mode === "instructions") {
    const current = INSTRUCTIONS[instructionStep - 1];
    return (
      <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:"#FDFBF9" }}>
        {/* Header */}
        <div style={{ padding:"16px 24px", borderBottom:"1px solid #e5e5e5", background:"#FDFBF9" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <button onClick={handleBackStep} style={{ background:"#e8e8e8", border:"none", width:40, height:40, borderRadius:"50%", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", color:"#1a1a1a" }}>←</button>
            <div style={{ textAlign:"center", background:"#fff3cd", borderRadius:20, padding:"6px 16px" }}>
              <span style={{ color:"#92400e", fontSize:13, fontWeight:600 }}>Step {instructionStep}/4</span>
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
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:"24px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", gap:20 }}>
          {/* Instructions Heading */}
          <div style={{ textAlign:"center", width:"100%", marginBottom:8 }}>
            <h1 style={{ color:"#1a1a1a", fontSize:28, fontWeight:700, margin:"0 0 4px" }}>Instructions</h1>
            <p style={{ color:"#6b7280", fontSize:14, margin:0 }}>Follow these steps</p>
          </div>

          {/* Illustration */}
          <div style={{ width:"100%", height:280, borderRadius:20, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
            <img src={current.svg} alt={`Step ${instructionStep}`} style={{ maxWidth:"100%", maxHeight:"100%", objectFit:"contain" }} />
          </div>

          {/* Title and Description */}
          <div style={{ textAlign:"center", width:"100%" }}>
            <h2 style={{ color:"#1a1a1a", fontSize:24, fontWeight:700, margin:"0 0 8px" }}>{current.title}</h2>
            <p style={{ color:"#6b7280", fontSize:15, margin:0, lineHeight:1.5 }}>{current.description}</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{ padding:"24px", borderTop:"1px solid #e5e5e5", background:"#FDFBF9", display:"flex", gap:12, alignItems:"center" }}>
          <button onClick={handleBackStep} style={{ padding:"14px 24px", borderRadius:24, border:"none", background:"transparent", color:COLORS.primary, fontWeight:600, fontSize:15, cursor:"pointer" }}>
            Back
          </button>
          <div style={{ flex:1 }} />
          <button onClick={handleNextStep} style={{ padding:"14px 24px", borderRadius:24, border:"none", background:COLORS.primary, color:"#ffffff", fontWeight:600, fontSize:15, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
            {instructionStep === 4 ? "Scan when ready →" : "Next →"}
          </button>
        </div>
      </div>
    );
  }

  if (mode === "camera") return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:"#FDFBF9" }}>
      {/* Header */}
      <div style={{ padding:"16px 24px", borderBottom:"1px solid #e5e5e5", background:"#FDFBF9" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <button onClick={() => setMode("instructions")} style={{ background:"#e8e8e8", border:"none", width:40, height:40, borderRadius:"50%", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", color:"#1a1a1a" }}>←</button>
          <div style={{ textAlign:"center" }}>
            <h2 style={{ color:"#1a1a1a", fontSize:18, fontWeight:700, margin:"0 0 4px" }}>Scan Strip</h2>
            <p style={{ color:"#9ca3af", fontSize:12, margin:0 }}>Upload image</p>
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
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:"auto", padding:"24px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", gap:20 }}>
        {isScanning ? (
          <>
            {/* Analyzing Header */}
            <div style={{ textAlign:"center", width:"100%", marginBottom:12 }}>
              <h2 style={{ color:"#1a1a1a", fontSize:28, fontWeight:700, margin:"0 0 8px" }}>Analysing your sample</h2>
              <p style={{ color:"#9ca3af", fontSize:14, margin:0, lineHeight:1.5 }}>This will take a few secs. Please keep your phone steady</p>
            </div>

            {/* Scanning Animation with Background */}
            <div style={{ width:"100%", maxWidth:320, background:"#e0e7ff", borderRadius:24, padding:"16px", display:"flex", flexDirection:"column", alignItems:"center", position:"relative" }}>
              <div style={{ position:"relative", width:"100%", display:"flex", flexDirection:"column", alignItems:"center" }}>
                <img src={scannerSvg} alt="Scanner" style={{ width:"100%", maxWidth:260 }} />

                {/* Scanning Line Animation */}
                <div style={{ position:"absolute", top:"130px", left:"40px", right:"40px", height:"100px", overflow:"hidden", pointerEvents:"none", width:"calc(100% - 80px)" }}>
                  <div style={{
                    position:"absolute",
                    width:"100%",
                    height:"3px",
                    background:"linear-gradient(90deg, transparent, #5b21b6, transparent)",
                    animation:"scanningLine 2s infinite",
                    top:"0"
                  }} />
                </div>
              </div>
            </div>

            {/* Checking Progress Card */}
            <div style={{ width:"100%", background:"#ffffff", borderRadius:16, padding:"20px", border:"1px solid #e5e5e5" }}>
              <p style={{ color:"#6b7280", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:600, margin:"0 0 16px" }}>Checking</p>

              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {/* Protein */}
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", background:"#e0e7ff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <CheckLg size={18} color={COLORS.primary} />
                  </div>
                  <span style={{ color:COLORS.primary, fontSize:14, fontWeight:600 }}>Protein detected</span>
                </div>

                {/* Glucose */}
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", background:"#e0e7ff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <CheckLg size={18} color={COLORS.primary} />
                  </div>
                  <span style={{ color:COLORS.primary, fontSize:14, fontWeight:600 }}>Glucose checked</span>
                </div>

                {/* pH */}
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", background:"#e0e7ff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Clock size={18} color={COLORS.primary} />
                  </div>
                  <span style={{ color:COLORS.primary, fontSize:14, fontWeight:600 }}>Checking pH...</span>
                </div>

                {/* Blood */}
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", background:"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Circle size={18} color="#d1d5db" />
                  </div>
                  <span style={{ color:"#9ca3af", fontSize:14, fontWeight:500 }}>Blood</span>
                </div>

                {/* Pus Cells */}
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", background:"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Circle size={18} color="#d1d5db" />
                  </div>
                  <span style={{ color:"#9ca3af", fontSize:14, fontWeight:500 }}>Pus Cells</span>
                </div>
              </div>
            </div>

            <style>{`
              @keyframes scanningLine {
                0% { top: -100px; }
                100% { top: 100px; }
              }
            `}</style>
          </>
        ) : (
          <>
            {/* Camera Box */}
            <div style={{ width:"100%", maxWidth:300, aspectRatio:"1", background:"#e0e7ff", borderRadius:20, border:"2px dashed #2563EB", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, padding:"24px", textAlign:"center" }}>
              <Camera size={64} color="#2563EB" />
              <div>
                <h3 style={{ color:"#1a1a1a", fontSize:16, fontWeight:700, margin:"0 0 4px" }}>Position strip here</h3>
                <p style={{ color:"#6b7280", fontSize:13, margin:0 }}>Align strip in the scanner frame</p>
              </div>
            </div>

            {/* Info */}
            <div style={{ textAlign:"center", width:"100%" }}>
              <p style={{ color:"#6b7280", fontSize:13, lineHeight:1.6, margin:0 }}>Make sure the lighting is good and the strip is clearly visible for accurate results.</p>
            </div>
          </>
        )}
      </div>

      {/* Bottom Button */}
      {!isScanning && (
        <div style={{ padding:"24px", borderTop:"1px solid #e5e5e5", background:"#FDFBF9" }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display:"none" }}
            capture="environment"
          />
          <button onClick={openCamera} disabled={isScanning} style={{ width:"100%", padding:"16px 24px", borderRadius:28, border:"none", background:COLORS.primary, color:"#ffffff", fontWeight:700, fontSize:16, cursor:isScanning ? "not-allowed" : "pointer", boxShadow:"0 6px 20px rgba(37,99,235,0.3)", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center", gap:10, opacity:isScanning ? 0.6 : 1 }}>
            <img src={cameraIcon} alt="Camera" width="20" height="20" style={{ filter:"brightness(0) invert(1)" }} />
            Open Camera
          </button>
        </div>
      )}
    </div>
  );

  if (mode === "results") return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:"#FDFBF9", padding:"24px", gap:20, overflowY:"auto" }}>
      {/* Header with back button */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
        <button onClick={() => setMode("camera")} style={{ background:"#e8e8e8", border:"none", width:40, height:40, borderRadius:"50%", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", color:"#1a1a1a" }}>←</button>
        <div style={{ textAlign:"center" }}>
          <h2 style={{ color:"#1a1a1a", fontSize:18, fontWeight:700, margin:"0 0 4px" }}>Results</h2>
          <p style={{ color:"#9ca3af", fontSize:12, margin:0 }}>Scan Complete</p>
        </div>
        <div style={{ width:40 }} />
      </div>

      {/* Success Badge */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16, marginBottom:12 }}>
        <div style={{ width:80, height:80, borderRadius:"50%", background:"#e0e7ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ width:60, height:60, borderRadius:"50%", background:"#e0e7ff", border:`3px solid ${COLORS.primary}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <CheckLg size={32} color={COLORS.primary} />
          </div>
        </div>
        <h1 style={{ color:"#1a1a1a", fontSize:32, fontWeight:700, margin:0 }}>Scan Complete</h1>
      </div>

      {/* Strip with checkmark */}
      <div style={{ display:"flex", justifyContent:"center", position:"relative", marginBottom:12 }}>
        <div style={{ width:120, height:120, background:"#f3f4f6", borderRadius:24, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(0,0,0,0.08)" }}>
          <img src={scannerSvg} alt="Strip" style={{ width:"80%", height:"80%", objectFit:"contain" }} />
        </div>
        <div style={{ position:"absolute", right:"30%", width:48, height:48, borderRadius:"50%", background:COLORS.primary, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(37,99,235,0.3)" }}>
          <CheckLg size={24} color="#ffffff" />
        </div>
      </div>

      {/* Readings Card */}
      <div style={{ background:"#e0e7ff", borderRadius:20, padding:"20px", display:"flex", flexDirection:"column", gap:16 }}>
        <p style={{ color:"#1a1a1a", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:700, margin:0 }}>Your Readings</p>

        {/* Dynamic Readings */}
        {(() => {
          const tests = [
            { name: "Protein", key: "protein" },
            { name: "Glucose", key: "glucose" },
            { name: "pH", key: "ph" },
            { name: "Blood", key: "blood" },
            { name: "Pus Cells", key: "pusCells" }
          ];

          return tests.map((test, idx) => {
            const value = stripData[test.key];
            const status = value ? getReadingStatus(test.key, value) : { label: "Unknown", color: "#9ca3af" };
            const isLast = idx === tests.length - 1;

            return (
              <div key={test.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingBottom:12, borderBottom: isLast ? "none" : "1px solid rgba(26,26,26,0.1)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:"#2563EB" }} />
                  <span style={{ color:"#1a1a1a", fontSize:15, fontWeight:500 }}>{test.name}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ color:status.color, fontSize:15, fontWeight:700 }}>{status.label}</span>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:status.color }} />
                </div>
              </div>
            );
          });
        })()}
      </div>

      {/* Warning Card */}
      <div style={{ background:"#fef3c7", borderRadius:16, padding:"16px", display:"flex", gap:12, border:"1px solid #fcd34d" }}>
        <div style={{ fontSize:20, marginTop:2 }}>⚠</div>
        <p style={{ color:"#92400e", fontSize:13, lineHeight:1.6, margin:0 }}>Some readings need attention. We recommend reviewing the detailed insights.</p>
      </div>

      {/* CTA Button */}
      <button onClick={() => onDone(selected)} style={{ width:"100%", padding:"16px 24px", borderRadius:28, border:"none", background:COLORS.primary, color:"#ffffff", fontWeight:700, fontSize:16, cursor:"pointer", boxShadow:"0 6px 20px rgba(37,99,235,0.3)", transition:"all 0.2s", marginTop:"auto" }}>
        See Detailed Advice →
      </button>
    </div>
  );
}
