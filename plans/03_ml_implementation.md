# 03 — ML Implementation
**Last updated**: 22 April 2026
**Update this file when**: model architecture changes, new datasets are evaluated, accuracy results come in, feature mapping changes.
> **Living document** — update this file when anything in this section changes. Never delete; annotate or supersede. Log changes in the `## History` section at the bottom. See `MASTER_PLAN.md` for the full maintenance protocol.


---

## Dataset Decision

**Use**: UCI CKD dataset only.
**Reasoning**: Only available dataset with a CKD/notCKD label, 400 rows, 25 features, well-documented.

| Dataset | Decision | Reason |
|---|---|---|
| UCI CKD (400 rows, 25 features) | ✅ Use for training | Gold standard. Has `ckd/notckd` label. |
| Kaggle Urinalysis (1,436 rows) | ✅ Use for strip UI value ranges only | UTI diagnosis label, not CKD. Real strip value ranges (Protein, SG, pH). |
| Kaggle CKD variant | ⛔ Skip | Overlapping with UCI, unclear label provenance. |
| Santhosh DS1 (40 rows) | ⛔ Skip | All CKD patients, no healthy control, no label column. |
| Santhosh DS2 (45 rows) | ⛔ Skip | Blood glucose in mmol/L (UCI uses mg/dL) — 18× unit mismatch. Too small. |

---

## Data Prep Steps

```python
from ucimlrepo import fetch_ucirepo
import pandas as pd
from sklearn.impute import SimpleImputer

# 1. Load
ckd = fetch_ucirepo(id=336)
X = ckd.data.features
y = ckd.data.targets

# 2. Drop high-missingness columns (>40% missing)
thresh = len(X) * 0.6
X = X.dropna(axis=1, thresh=thresh)

# 3. Encode binary nominals
binary_map = {'yes': 1, 'no': 0, 'normal': 1, 'abnormal': 0,
              'present': 1, 'notpresent': 0, 'good': 1, 'poor': 0}
X = X.replace(binary_map)

# 4. Impute
num_imputer = SimpleImputer(strategy='median')
cat_imputer = SimpleImputer(strategy='most_frequent')
# Apply to numeric and remaining categorical columns separately

# 5. Encode target
y = y['class'].map({'ckd': 1, 'notckd': 0})

# 6. Split
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
```

---

## Models

### Logistic Regression (baseline)
```python
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score, classification_report

lr = LogisticRegression(max_iter=1000)
lr.fit(X_train, y_train)
print(classification_report(y_test, lr.predict(X_test)))
```

### XGBoost (primary)
```python
from xgboost import XGBClassifier

xgb = XGBClassifier(n_estimators=100, max_depth=4, learning_rate=0.1,
                    use_label_encoder=False, eval_metric='logloss')
xgb.fit(X_train, y_train)
print(classification_report(y_test, xgb.predict(X_test)))
```

**Target**: F1 > 0.96. Expected: 0.97–0.99 based on published results on this dataset.

---

## Explainability (SHAP)

```python
import shap

explainer = shap.TreeExplainer(xgb)
shap_values = explainer.shap_values(X_test)

# For a single prediction — get top 3 factors
def get_top_factors(input_row, n=3):
    sv = explainer.shap_values(input_row)
    importance = pd.Series(abs(sv[0]), index=X.columns)
    return importance.nlargest(n).index.tolist()
```

---

## Export

```python
import joblib
joblib.dump(xgb, 'model.pkl')
joblib.dump(feature_columns, 'features.pkl')  # save column order too
```

---

## Flask API Contract

### POST /predict
**Request:**
```json
{
  "age": 45,
  "bp": 80,
  "dm": 1,
  "htn": 1,
  "appet": 0,
  "pe": 1,
  "ane": 0,
  "al": 2,
  "sg": 1.015,
  "rbc": 0
}
```

**Response:**
```json
{
  "risk": "high",
  "score": 0.87,
  "factors": ["al", "htn", "dm"],
  "raw_probability": 0.87
}
```

Risk thresholds:
- `score < 0.35` → `"low"`
- `0.35 ≤ score < 0.65` → `"moderate"`
- `score ≥ 0.65` → `"high"`

---

## Feature Mapping (form → model)

| UI question | Input type | Model feature | Encoding |
|---|---|---|---|
| Age | number | `age` | raw integer |
| Blood pressure | number | `bp` | raw mm/Hg |
| Diabetes history | yes/no | `dm` | 1/0 |
| Hypertension | yes/no | `htn` | 1/0 |
| Appetite | good/poor | `appet` | 1/0 |
| Pedal swelling | yes/no | `pe` | 1/0 |
| Fatigue / anaemia | yes/no | `ane` | 1/0 |
| Strip: protein band | NEGATIVE/TRACE/1+/2+/3+ | `al` | 0/0.5/1/2/3 |
| Strip: specific gravity | 1.005–1.025 | `sg` | raw float |
| Strip: blood/RBC | normal/abnormal | `rbc` | 1/0 |

---

## Alternatives Considered

Full analysis done 22 April 2026. Ranked by: accuracy first, build speed second.

### Model alternatives

| # | Option | Expected F1 | Build time | Verdict | Reason |
|---|---|---|---|---|---|
| 1 | XGBoost (self-trained, UCI) | 99% | ~2 min | ✅ Use | Best accuracy, SHAP explainability, fast, strong pitch story |
| 2 | Logistic Regression | 94–97% | ~1 min | ✅ Keep as baseline | Lower accuracy but fully transparent coefficients. Train both. |
| 3 | Random Forest | 97–98% | ~2 min | 🟡 Optional | Comparable to XGBoost, no reason to use instead |
| 4 | Neural network (MLP) | 96–98% | ~30 min | 🟡 Risky | No accuracy gain, black box, hard to justify clinically |
| 5 | Stacked ensemble (LR+XGB+RF) | 99%+ | ~45 min | 🟡 Nice to have | Marginal gain, adds complexity, good if time allows |
| 6 | Gemini / LLM as risk scorer | Unknown | ~1 hr | ⛔ Skip | Non-deterministic, no F1, unjustifiable clinically. Keep Gemini for explanations only. |
| 7 | Rule-based scoring | ~80% | ~20 min | ⛔ Emergency only | Use only if training fails completely |

### Dataset alternatives

| # | Option | Rows | Verdict | Reason |
|---|---|---|---|---|
| 8 | UCI CKD (solo) | 400 | ✅ Use | Gold standard, has label, manageable missing values |
| 9 | UCI + Kaggle CKD merged | ~600–800 | 🟡 If time allows | More data but feature alignment takes ~1 hr. Marginal gain — UCI alone hits 99%. |
| 10 | Synthetic augmentation (SMOTE/CTGAN) | 400→2000+ | 🟡 Interesting, not necessary | UCI already balanced (250 CKD, 150 notCKD). Could hurt generalisation. Deferred. |

### Final Decision — Locked 22 Apr
**Primary**: XGBoost self-trained on UCI CKD
**Fallback**: Logistic Regression (same notebook, train both, use LR only if XGBoost export/serving causes issues)
Everything else deferred or rejected. Do not revisit during hackathon.

---

## Actual Results
<!-- Fill this in during Phase 1 -->

| Model | F1 (test) | Accuracy | Notes |
|---|---|---|---|
| Logistic Regression | — | — | — |
| XGBoost | — | — | — |

---

## History
<!-- Log changes during the hackathon -->
<!-- [Time] — what changed and why -->
