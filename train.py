"""
Neva AI — CKD Model Training Script
Run: python ml/train.py
Outputs: model.pkl, features.pkl, contract.json → project root
"""

import pandas as pd
import numpy as np
import json
import os
import sys

# ============================================================
# STEP 1: Install check
# ============================================================
try:
    from ucimlrepo import fetch_ucirepo
    from sklearn.impute import SimpleImputer
    from sklearn.model_selection import train_test_split
    from sklearn.linear_model import LogisticRegression
    from sklearn.preprocessing import StandardScaler
    from sklearn.metrics import classification_report, f1_score, roc_auc_score
    from xgboost import XGBClassifier
    from sklearn.neural_network import MLPClassifier
    import shap
    import joblib
except ImportError as e:
    print(f"Missing dependency: {e}")
    print("Run: pip install ucimlrepo xgboost scikit-learn shap joblib pandas numpy")
    sys.exit(1)

print("✅ All dependencies loaded")

# Output directory — project root (one level up from ml/)
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

# ============================================================
# STEP 2: Load UCI CKD dataset
# ============================================================
print("\n📥 Loading UCI CKD dataset (id=336)...")
ckd = fetch_ucirepo(id=336)
X = ckd.data.features.copy()
y = ckd.data.targets.copy()

print(f"   Shape: {X.shape}")
print(f"   Target distribution:")
print(f"   {y['class'].value_counts().to_dict()}")
missing_total = X.isnull().sum().sum()
print(f"   Missing cells: {missing_total} / {X.shape[0] * X.shape[1]}")

# ============================================================
# STEP 3: Clean target
# ============================================================
print("\n🧹 Cleaning target variable...")
y_clean = y["class"].str.strip().map({"ckd": 1, "notckd": 0})

# Drop rows where target is NaN
valid_idx = y_clean.dropna().index
X = X.loc[valid_idx].reset_index(drop=True)
y_clean = y_clean.loc[valid_idx].reset_index(drop=True).astype(int)

print(f"   Rows after cleaning: {X.shape[0]}")
print(f"   Target: {y_clean.value_counts().to_dict()}")

# ============================================================
# STEP 4: Clean features
# ============================================================
print("\n🧹 Cleaning features...")

# Column types
binary_cols = ["rbc", "pc", "pcc", "ba", "htn", "dm", "cad", "appet", "pe", "ane"]
numeric_cols = ["age", "bp", "sg", "al", "su", "bgr", "bu", "sc", "sod", "pot", "hemo", "pcv", "wc", "rc"]

# Encode binary columns
binary_map = {
    "yes": 1, "no": 0,
    "\tyes": 1, "\tno": 0, " yes": 1, " no": 0,
    "present": 1, "notpresent": 0,
    "normal": 1, "abnormal": 0,
    "good": 1, "poor": 0,
}

for col in binary_cols:
    if col in X.columns:
        X[col] = X[col].astype(str).str.strip().map(binary_map)

# Force numeric columns
for col in numeric_cols:
    if col in X.columns:
        X[col] = pd.to_numeric(X[col], errors="coerce")

print(f"   Binary columns encoded: {[c for c in binary_cols if c in X.columns]}")
print(f"   Numeric columns coerced: {[c for c in numeric_cols if c in X.columns]}")

# ============================================================
# STEP 5: Impute missing values
# ============================================================
print("\n🔧 Imputing missing values...")

num_cols_present = [c for c in numeric_cols if c in X.columns]
bin_cols_present = [c for c in binary_cols if c in X.columns]

if num_cols_present:
    num_imputer = SimpleImputer(strategy="median")
    X[num_cols_present] = num_imputer.fit_transform(X[num_cols_present])

if bin_cols_present:
    cat_imputer = SimpleImputer(strategy="most_frequent")
    X[bin_cols_present] = cat_imputer.fit_transform(X[bin_cols_present])

# Fill any remaining NaNs with median/mode
remaining = X.isnull().sum().sum()
if remaining > 0:
    print(f"   Found {remaining} remaining missing values, filling...")
    for col in X.columns:
        if X[col].isnull().sum() > 0:
            if X[col].dtype in ['float64', 'int64']:
                X[col].fillna(X[col].median(), inplace=True)
            else:
                X[col].fillna(X[col].mode()[0] if len(X[col].mode()) > 0 else 0, inplace=True)

remaining = X.isnull().sum().sum()
assert remaining == 0, f"Still have {remaining} missing values!"
print(f"   Missing values remaining: {remaining}")
print(f"   ✅ Data clean. Shape: {X.shape}")

# ============================================================
# STEP 6: Train/test split
# ============================================================
print("\n✂️  Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y_clean, test_size=0.2, random_state=42, stratify=y_clean
)
print(f"   Train: {X_train.shape[0]} rows")
print(f"   Test:  {X_test.shape[0]} rows")

# ============================================================
# STEP 7: Train Logistic Regression (baseline)
# ============================================================
print("\n📊 Training Logistic Regression...")
lr = LogisticRegression(max_iter=1000, random_state=42)
lr.fit(X_train, y_train)

lr_pred = lr.predict(X_test)
lr_f1 = f1_score(y_test, lr_pred)
lr_auc = roc_auc_score(y_test, lr.predict_proba(X_test)[:, 1])

print(classification_report(y_test, lr_pred, target_names=["notckd", "ckd"]))
print(f"   LR F1: {lr_f1:.4f}, AUC: {lr_auc:.4f}")

# ============================================================
# STEP 8: Train Neural Network
# ============================================================
print("\n📊 Training Neural Network...")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

nn = MLPClassifier(
    hidden_layer_sizes=(64, 32),
    activation="relu",
    solver="adam",
    max_iter=500,
    random_state=42,
    early_stopping=True,
    validation_fraction=0.1,
)
nn.fit(X_train_scaled, y_train)

nn_pred = nn.predict(X_test_scaled)
nn_f1 = f1_score(y_test, nn_pred)
nn_auc = roc_auc_score(y_test, nn.predict_proba(X_test_scaled)[:, 1])

print(classification_report(y_test, nn_pred, target_names=["notckd", "ckd"]))
print(f"   NN F1: {nn_f1:.4f}, AUC: {nn_auc:.4f}")

# ============================================================
# STEP 9: Train XGBoost (primary)
# ============================================================
print("\n📊 Training XGBoost...")
xgb = XGBClassifier(
    n_estimators=100,
    max_depth=4,
    learning_rate=0.1,
    use_label_encoder=False,
    eval_metric="logloss",
    random_state=42,
)
xgb.fit(X_train, y_train)

xgb_pred = xgb.predict(X_test)
xgb_f1 = f1_score(y_test, xgb_pred)
xgb_auc = roc_auc_score(y_test, xgb.predict_proba(X_test)[:, 1])

print(classification_report(y_test, xgb_pred, target_names=["notckd", "ckd"]))
print(f"   XGB F1: {xgb_f1:.4f}, AUC: {xgb_auc:.4f}")

# ============================================================
# STEP 10: Compare All Models
# ============================================================
print("\n🏆 MODEL COMPARISON")
print(f"   Logistic Regression F1: {lr_f1:.4f}, AUC: {lr_auc:.4f}")
print(f"   Neural Network F1:      {nn_f1:.4f}, AUC: {nn_auc:.4f}")
print(f"   XGBoost F1:             {xgb_f1:.4f}, AUC: {xgb_auc:.4f}")

models = {
    "Logistic Regression": (lr, lr_f1, lr_auc),
    "Neural Network": (nn, nn_f1, nn_auc),
    "XGBoost": (xgb, xgb_f1, xgb_auc),
}

best_name = max(models.keys(), key=lambda k: models[k][1])
best_model, best_f1, best_auc = models[best_name]
print(f"   ✅ Winner: {best_name} (F1: {best_f1:.4f}, AUC: {best_auc:.4f})")

# ============================================================
# STEP 11: SHAP explainability
# ============================================================
print("\n🔍 Computing SHAP values...")
if best_name == "XGBoost":
    explainer = shap.TreeExplainer(best_model)
    shap_values = explainer.shap_values(X_test)
elif best_name == "Neural Network":
    explainer = shap.KernelExplainer(lambda x: best_model.predict_proba(scaler.transform(x))[:, 1], shap.sample(X_test, 50))
    shap_values = explainer.shap_values(X_test)
else:
    explainer = shap.KernelExplainer(lambda x: best_model.predict_proba(x)[:, 1], shap.sample(X_test, 50))
    shap_values = explainer.shap_values(X_test)

mean_shap = pd.Series(np.abs(shap_values).mean(axis=0), index=X.columns)
top_features = mean_shap.sort_values(ascending=False)

print("   Top 10 features (SHAP):")
for feat, val in top_features.head(10).items():
    print(f"     {feat:20s} {val:.4f}")

# ============================================================
# STEP 11: Compute defaults + test predictions
# ============================================================
print("\n🧪 Computing healthy defaults...")
feature_cols = list(X.columns)

# Use only healthy (non-CKD) patients for defaults
X_healthy = X[y_clean == 0]
print(f"   Using {len(X_healthy)} healthy patients for defaults")

DEFAULT_VALUES = {}
for col in feature_cols:
    if col in num_cols_present:
        DEFAULT_VALUES[col] = round(float(X_healthy[col].median()), 2)
    else:
        DEFAULT_VALUES[col] = int(X_healthy[col].mode()[0])

print("   Defaults:")
for k, v in DEFAULT_VALUES.items():
    print(f"     {k:20s} {v}")


def predict_risk(inputs):
    """Take partial inputs, fill defaults, return risk + score + top 3 factors."""
    row = {col: inputs.get(col, DEFAULT_VALUES[col]) for col in feature_cols}
    row_df = pd.DataFrame([row])

    if best_name == "Neural Network":
        row_scaled = scaler.transform(row_df)
        prob = float(best_model.predict_proba(row_scaled)[0][1])
    else:
        prob = float(best_model.predict_proba(row_df)[0][1])

    if prob < 0.35:
        risk = "low"
    elif prob < 0.65:
        risk = "moderate"
    else:
        risk = "high"

    try:
        sv = explainer.shap_values(row_df)
        if isinstance(sv, list):
            sv = sv[1] if len(sv) > 1 else sv[0]
        importance = pd.Series(np.abs(sv), index=feature_cols)
    except:
        importance = pd.Series(np.zeros(len(feature_cols)), index=feature_cols)

    top3 = importance.nlargest(3).index.tolist()

    return {"risk": risk, "score": round(prob, 3), "factors": top3}


# Test cases
print("\n🧪 Test predictions...")

high_risk_input = {"age": 65, "dm": 1, "htn": 1, "al": 4, "sc": 8.0, "hemo": 7, "pe": 1, "ane": 1, "appet": 0}
high_risk = predict_risk(high_risk_input)
print(f"   HIGH RISK test: {json.dumps(high_risk, indent=2)}")

low_risk_input = {"age": 30, "dm": 0, "htn": 0, "al": 0, "sc": 1.0, "hemo": 15, "pe": 0, "ane": 0, "appet": 1}
low_risk = predict_risk(low_risk_input)
print(f"   LOW RISK test:  {json.dumps(low_risk, indent=2)}")

# Verify predictions make sense
assert high_risk["risk"] == "high", f"Expected high risk, got {high_risk['risk']}"
assert low_risk["risk"] == "low", f"Expected low risk, got {low_risk['risk']}"
print("   ✅ Both test cases passed")

# ============================================================
# STEP 12: Export
# ============================================================
print("\n💾 Saving files...")

model_path = os.path.join(OUT_DIR, "model.pkl")
features_path = os.path.join(OUT_DIR, "features.pkl")
contract_path = os.path.join(OUT_DIR, "contract.json")

# Also save as JSON for version-safe loading
model_json_path = os.path.join(OUT_DIR, "model.json")

joblib.dump(xgb, model_path)
print(f"   ✅ {model_path}")

joblib.dump(feature_cols, features_path)
print(f"   ✅ {features_path}")

xgb.save_model(model_json_path)
print(f"   ✅ {model_json_path} (version-safe backup)")

contract = {
    "model_status": "done",
    "model_name": best_name,
    "model_f1": round(best_f1, 4),
    "model_auc": round(best_auc, 4),
    "all_models": {
        "Logistic Regression": {"f1": round(lr_f1, 4), "auc": round(lr_auc, 4)},
        "Neural Network": {"f1": round(nn_f1, 4), "auc": round(nn_auc, 4)},
        "XGBoost": {"f1": round(xgb_f1, 4), "auc": round(xgb_auc, 4)},
    },
    "features": feature_cols,
    "feature_count": len(feature_cols),
    "default_values": DEFAULT_VALUES,
    "risk_thresholds": {"low": 0.35, "moderate": 0.65},
    "sample_request": high_risk_input,
    "sample_response": high_risk,
    "training_rows": int(X.shape[0]),
    "test_rows": int(X_test.shape[0]),
}

with open(contract_path, "w") as f:
    json.dump(contract, f, indent=2)
print(f"   ✅ {contract_path}")

# ============================================================
# DONE
# ============================================================
print("\n" + "=" * 50)
print("🎉 ML TRAINING COMPLETE")
print("=" * 50)
print(f"\n🏆 Selected Model: {best_name}")
print(f"   F1 Score: {best_f1:.4f}")
print(f"   AUC: {best_auc:.4f}")
print(f"\n📊 All Models Trained:")
print(f"   • Logistic Regression: F1={lr_f1:.4f}, AUC={lr_auc:.4f}")
print(f"   • Neural Network:      F1={nn_f1:.4f}, AUC={nn_auc:.4f}")
print(f"   • XGBoost:             F1={xgb_f1:.4f}, AUC={xgb_auc:.4f}")
print(f"\nFeatures: {len(feature_cols)}")
print(f"\nFiles saved to project root:")
print(f"  model.pkl        — trained {best_name} model")
print(f"  model.json       — version-safe backup")
print(f"  features.pkl     — feature column order")
print(f"  contract.json    — API contract with all model metrics")
print(f"\nNext step: run python backend.py")
