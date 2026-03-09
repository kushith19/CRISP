from fastapi import FastAPI, UploadFile, File
import joblib
import pandas as pd
import numpy as np
import shap
import io

app = FastAPI()

model = joblib.load("churn_prediction_pipeline.pkl")

# Extract pipeline steps once at startup
preprocessor = model.named_steps["preprocessor"]
classifier = model.named_steps["classifier"]

# Build SHAP explainer once (expensive — do not do this per request)
explainer = shap.TreeExplainer(classifier)

FEATURES = [
    "gender", "SeniorCitizen", "Partner", "Dependents", "tenure",
    "PhoneService", "MultipleLines", "InternetService", "OnlineSecurity",
    "OnlineBackup", "DeviceProtection", "TechSupport", "StreamingTV",
    "StreamingMovies", "Contract", "PaperlessBilling", "PaymentMethod",
    "MonthlyCharges", "TotalCharges"
]


def get_feature_names(preprocessor, original_features):
    """Extract feature names after preprocessing (handles OHE expansion)."""
    try:
        feature_names = preprocessor.get_feature_names_out()
        return list(feature_names)
    except Exception:
        return original_features


def compute_shap_top5(shap_vals_row, feature_names):
    """
    Given a 1D array of SHAP values and matching feature names,
    return top 5 contributors sorted by absolute impact.
    """
    pairs = list(zip(feature_names, shap_vals_row))
    # Sort by absolute value descending
    pairs.sort(key=lambda x: abs(x[1]), reverse=True)
    top5 = pairs[:5]

    return [
        {
            "feature": name,
            "shap_value": round(float(val), 4),
            "direction": "increases_churn" if val > 0 else "decreases_churn"
        }
        for name, val in top5
    ]


@app.get("/")
def home():
    return {"message": "Churn Prediction API — SHAP enabled"}


@app.post("/predict")
def predict_churn(data: dict):
    df = pd.DataFrame([data], columns=FEATURES)
    df["tenure"] = pd.to_numeric(df["tenure"])
    df["MonthlyCharges"] = pd.to_numeric(df["MonthlyCharges"])
    df["TotalCharges"] = pd.to_numeric(df["TotalCharges"])

    prediction = model.predict(df)[0]
    probability = float(model.predict_proba(df)[0][1])

    # SHAP for this single customer
    X_transformed = preprocessor.transform(df)
    if hasattr(X_transformed, "toarray"):
        X_transformed = X_transformed.toarray()

    shap_vals = explainer.shap_values(X_transformed)

    # shap_values can be list (binary classification) or 2D array
    if isinstance(shap_vals, list):
        row_shap = shap_vals[1][0]   # class=1 (churn) SHAP values
    else:
        row_shap = shap_vals[0]

    feature_names = get_feature_names(preprocessor, FEATURES)
    top5 = compute_shap_top5(row_shap, feature_names)

    risk_level = "High" if probability > 0.7 else "Medium" if probability > 0.4 else "Low"

    return {
        "prediction": int(prediction),
        "churn_probability": probability,
        "risk_level": risk_level,
        "shap_explanation": top5
    }


@app.post("/predict-batch")
async def predict_batch(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")))

    if "customerID" in df.columns:
        customer_ids = df["customerID"].tolist()
        df = df.drop(columns=["customerID"])
    else:
        customer_ids = list(range(len(df)))

    df["TotalCharges"] = pd.to_numeric(
        df["TotalCharges"].replace(" ", "0.0"), errors="coerce"
    ).fillna(0.0)

    predictions = model.predict(df)
    probabilities = model.predict_proba(df)[:, 1]

    # SHAP for entire batch (vectorized — fast)
    X_transformed = preprocessor.transform(df)
    if hasattr(X_transformed, "toarray"):
        X_transformed = X_transformed.toarray()

    shap_vals = explainer.shap_values(X_transformed)

    if isinstance(shap_vals, list):
        shap_matrix = shap_vals[1]   # class=1 rows × features
    else:
        shap_matrix = shap_vals

    feature_names = get_feature_names(preprocessor, FEATURES)

    def risk_level(p):
        return "High" if p > 0.7 else "Medium" if p > 0.4 else "Low"

    results = []
    for i in range(len(df)):
        top5 = compute_shap_top5(shap_matrix[i], feature_names)
        row = df.iloc[i].to_dict()
        row.update({
            "customerIndex": customer_ids[i],
            "prediction": int(predictions[i]),
            "churn_probability": round(float(probabilities[i]), 4),
            "risk_level": risk_level(probabilities[i]),
            "shap_explanation": top5
        })
        results.append(row)

    return results