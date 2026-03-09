import joblib

model = joblib.load("churn_prediction_pipeline.pkl")

preprocessor = model.named_steps["preprocessor"]

# print("Numerical columns:")
# print(preprocessor.transformers_[0][2])

# print("\nCategorical columns:")
# print(preprocessor.transformers_[1][2])
encoder = preprocessor.named_transformers_["cat"]

for col, cats in zip(preprocessor.transformers_[1][2], encoder.categories_):
    print(col, ":", cats)