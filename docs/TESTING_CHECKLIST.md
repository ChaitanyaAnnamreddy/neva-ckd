# Testing Checklist — ML Integration

After running `./start.sh`, use this checklist to verify everything works.

---

## 1️⃣ Backend API Tests

### 1.1 Health Check
```bash
curl http://localhost:5000/health
```
**Expected:** `{"status":"ok","model":"XGBoost"}`

✅ Pass: Shows model name
❌ Fail: Connection refused or error

### 1.2 Model Contract
```bash
curl http://localhost:5000/contract | jq .
```
**Expected:** JSON with:
- `"model_name": "XGBoost"`
- `"model_f1": 0.9899`
- `"features": [...]` (24 items)
- `"default_values": {...}`

✅ Pass: Returns full contract
❌ Fail: 404 or parsing error

### 1.3 Test Prediction (Low Risk)
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "questionnaire": {"age": "18–29", "conditions": []},
    "strip": null
  }' | jq .
```
**Expected:**
```json
{
  "risk_level": "low",
  "score": 0.xxx,
  "percentage": 0-35,
  "factors": ["hemo", "sg", "sc"],
  "success": true
}
```

✅ Pass: percentage < 35 and risk_level = "low"
❌ Fail: percentage > 35 or success = false

### 1.4 Test Prediction (High Risk)
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "questionnaire": {
      "age": "60+",
      "conditions": ["Diabetes", "High Blood Pressure"]
    },
    "strip": {"protein": "3+", "glucose": "2+"}
  }' | jq .
```
**Expected:**
```json
{
  "risk_level": "high",
  "score": 0.xxx,
  "percentage": 65-100,
  "factors": [...],
  "success": true
}
```

✅ Pass: percentage > 65 and risk_level = "high"
❌ Fail: percentage < 65 or success = false

---

## 2️⃣ Frontend Tests

### 2.1 Frontend Loads
Open browser: **http://localhost:5173**

✅ Pass: App loads, no console errors
❌ Fail: Blank page or errors in console

### 2.2 Welcome Screen
Check the initial welcome/splash screen

✅ Pass: Can navigate to questionnaire
❌ Fail: Screen doesn't load or navigation broken

### 2.3 Fill Questionnaire (Low Risk)
```
Age: 18–29
Diabetes: No
High Blood Pressure: No
Appetite: Good
Swelling: No
Fatigue: No
(Skip strip test)
```

✅ Pass: Submits successfully
❌ Fail: Form submission error

### 2.4 Results Screen (Low Risk)
After submitting questionnaire for low-risk patient:

**Check:**
- [ ] Risk label shows "Low Risk"
- [ ] Risk percentage shows **less than 35%** (NOT hardcoded 22%)
- [ ] Progress bar less than 35% full
- [ ] Contributing factors displayed (3 items)
- [ ] Factors are: hemoglobin, specific_gravity, etc.

✅ Pass: All items checked
❌ Fail: Any item unchecked

### 2.5 Fill Questionnaire (High Risk)
```
Age: 60+
Diabetes: Yes
High Blood Pressure: Yes
Appetite: Poor
Swelling: Yes
Fatigue: Yes
Strip test:
  - Protein: 3+
  - Glucose: 2+
  - Blood: 1+
```

✅ Pass: Submits successfully
❌ Fail: Form submission error

### 2.6 Results Screen (High Risk)
After submitting high-risk questionnaire:

**Check:**
- [ ] Risk label shows "High Risk"
- [ ] Risk percentage shows **greater than 65%** (NOT hardcoded 85%)
- [ ] Progress bar more than 65% full
- [ ] Contributing factors displayed (3 items)
- [ ] Different factors than low-risk case

✅ Pass: All items checked
❌ Fail: Any item unchecked

### 2.7 Fill Questionnaire (Moderate Risk)
```
Age: 45–59
Diabetes: Yes
High Blood Pressure: No
Appetite: Good
Swelling: No
Fatigue: No
Strip test:
  - Protein: Trace
```

✅ Pass: Submits successfully
❌ Fail: Form submission error

### 2.8 Results Screen (Moderate Risk)
After submitting moderate-risk questionnaire:

**Check:**
- [ ] Risk label shows "Moderate Risk"
- [ ] Risk percentage shows **between 35-65%** (NOT hardcoded 58%)
- [ ] Progress bar between 35-65% full
- [ ] Contributing factors displayed

✅ Pass: All items checked
❌ Fail: Any item unchecked

---

## 3️⃣ Integration Tests

### 3.1 Risk Percentage Varies
Change answers and verify percentage changes:
- Young + no conditions → percentage goes down
- Old + multiple conditions → percentage goes up

✅ Pass: Percentages change with inputs
❌ Fail: Percentage always same

### 3.2 Factors Change
Different questionnaires show different factors:
- Young healthy → factors like hemoglobin, age
- Old diabetic → factors like creatinine, protein

✅ Pass: Factors change per patient
❌ Fail: Always same factors

### 3.3 API is Called
Open browser DevTools (F12) → Network tab:

Fill questionnaire and submit.

**Check:**
- [ ] See POST request to `localhost:5000/predict`
- [ ] Request has JSON body with questionnaire data
- [ ] Response has JSON with risk_level, score, percentage

✅ Pass: All items checked
❌ Fail: No POST request or bad response

### 3.4 Error Handling
Stop backend (Ctrl+C on backend terminal):

Try to submit questionnaire in frontend.

**Check:**
- [ ] Page doesn't crash
- [ ] Fallback message or graceful degradation
- [ ] No red errors on screen (console errors OK)

✅ Pass: Graceful handling
❌ Fail: UI breaks or crashes

---

## 4️⃣ Data Validation Tests

### 4.1 Missing Questionnaire Data
Fill only age field, leave rest blank, submit:

✅ Pass: Still predicts (uses defaults for missing fields)
❌ Fail: Error or refuses to process

### 4.2 Invalid Strip Test Data
Send questionnaire with invalid strip test values:

✅ Pass: API handles gracefully
❌ Fail: 400 error or crashes

### 4.3 All Strip Tests Filled
Fill all strip test fields (protein, glucose, blood, etc.):

✅ Pass: Prediction includes strip data
❌ Fail: Error or strips ignored

---

## 5️⃣ Edge Case Tests

### 5.1 Extreme Low Risk
Age: 18–29, all no conditions, all negative strip tests:

**Check:**
- [ ] Percentage is very low (< 10%)
- [ ] Risk level is "low"

✅ Pass: Both checked
❌ Fail: Either unchecked

### 5.2 Extreme High Risk
Age: 60+, all yes conditions, all max strip tests:

**Check:**
- [ ] Percentage is very high (> 90%)
- [ ] Risk level is "high"

✅ Pass: Both checked
❌ Fail: Either unchecked

### 5.3 Boundary Case (35%)
Try inputs that should give risk ≈ 35%:

**Check:**
- [ ] If exactly at boundary, could be "low" or "moderate"
- [ ] Risk level is consistent with percentage

✅ Pass: Consistent
❌ Fail: Inconsistent (e.g., 34% shows "moderate")

### 5.4 Boundary Case (65%)
Try inputs that should give risk ≈ 65%:

**Check:**
- [ ] If exactly at boundary, could be "moderate" or "high"
- [ ] Risk level is consistent with percentage

✅ Pass: Consistent
❌ Fail: Inconsistent (e.g., 66% shows "moderate")

---

## 6️⃣ Performance Tests

### 6.1 Prediction Speed
Submit questionnaire, measure response time:

✅ Pass: Response in < 1 second
⚠️ Warn: Response in 1-3 seconds
❌ Fail: Response takes > 3 seconds

### 6.2 Multiple Predictions
Submit 5 different questionnaires in succession:

✅ Pass: All work, no slowdown
❌ Fail: One fails or gets slower

### 6.3 Browser Console
Submit questionnaire, check browser console (F12):

✅ Pass: No errors (warnings OK)
❌ Fail: Red error messages

---

## 7️⃣ Visual/UX Tests

### 7.1 Progress Bar Animation
Submit high-risk questionnaire:

**Check:**
- [ ] Progress bar animates smoothly
- [ ] Fills to correct percentage
- [ ] Correct color (red for high risk)

✅ Pass: All items checked
❌ Fail: Any item unchecked

### 7.2 Risk Icon
Check risk level icon (checkmark, warning, alert):

**Check:**
- [ ] Low risk: checkmark icon
- [ ] Moderate risk: warning icon
- [ ] High risk: alert icon

✅ Pass: Correct icons
❌ Fail: Wrong icons

### 7.3 Contributing Factors Display
Check factors section:

**Check:**
- [ ] Shows "Key contributing factors"
- [ ] Lists 3 factors
- [ ] Factors have readable names (not codes)
- [ ] Each has an icon

✅ Pass: All items checked
❌ Fail: Any item unchecked

---

## Summary

| Category | Tests | Pass | Fail |
|----------|-------|------|------|
| Backend API | 4 | ☐ | ☐ |
| Frontend Tests | 8 | ☐ | ☐ |
| Integration | 4 | ☐ | ☐ |
| Data Validation | 3 | ☐ | ☐ |
| Edge Cases | 4 | ☐ | ☐ |
| Performance | 3 | ☐ | ☐ |
| UX/Visual | 3 | ☐ | ☐ |
| **TOTAL** | **29** | ☐ | ☐ |

---

## Troubleshooting Guide

### "Connection refused" when testing API
```bash
# Check if backend is running
curl http://localhost:5000/health

# If not, start it
python3 backend.py
```

### Frontend shows hardcoded 22%
- Backend not running or not responding
- Check browser DevTools → Network → see if POST request fails
- Verify VITE_API_URL in .env is correct

### "Model file not found"
```bash
# Check files exist
ls -la model.pkl features.pkl contract.json

# If missing, files should already be present
# Contact if you need to retrain
```

### Risk percentage always same
- API might be returning same probability
- Try different questionnaire inputs
- Check API response in Network tab

### Factors always same
- SHAP might not be calculating properly
- Check backend logs for errors
- Try different risk profiles

---

## Success Criteria

✅ **All 29 tests pass** = Full integration working!

If any test fails, check:
1. Backend is running (`python3 backend.py`)
2. Frontend is running (`npm run dev`)
3. `.env` has correct `VITE_API_URL`
4. No errors in browser console (F12)
5. Model files exist (`model.pkl`, `features.pkl`, `contract.json`)

---

**Ready to test?** Start with: `./start.sh`
