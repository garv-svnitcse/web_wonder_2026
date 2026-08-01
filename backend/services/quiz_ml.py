import os
import csv
import pickle
import numpy as np
from sklearn.ensemble import RandomForestClassifier

# File paths
CSV_PATH = "services/quiz_data.csv"
MODEL_PATH = "services/quiz_model.pkl"

_model = None

def load_data():
    """Loads feature vectors and target labels from the CSV file."""
    X = []
    y = []
    with open(CSV_PATH, 'r') as f:
        reader = csv.reader(f)
        next(reader)  # Skip header row
        for row in reader:
            if not row:
                continue
            # Features: avg_score_pct, accuracy, current_score_pct
            X.append([float(row[0]), float(row[1]), float(row[2])])
            y.append(row[3])
    return np.array(X), np.array(y)

def train_model():
    """Trains the Random Forest model using CSV data and saves it to a pickle file."""
    X, y = load_data()
    model = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
    model.fit(X, y)
    
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)
        
    global _model
    _model = model
    print("Quiz Random Forest ML model trained and saved successfully.")

def get_model():
    """Loads the model, training it from CSV if it doesn't already exist."""
    global _model
    if _model is not None:
        return _model
        
    try:
        with open(MODEL_PATH, "rb") as f:
            _model = pickle.load(f)
        print("Quiz Random Forest ML model loaded successfully.")
    except FileNotFoundError:
        print("Model file not found. Initializing training from CSV...")
        train_model()
        
    return _model

def predict_level(avg_score: float, accuracy: float, current_score: float, total_questions: int = 10) -> str:
    """Predicts the next difficulty level using the trained Random Forest model."""
    try:
        model = get_model()
        
        # Safely compute percentages to feed the model
        total_questions = max(1, total_questions)
        avg_score_pct = np.clip((avg_score / total_questions) * 100, 0, 100)
        current_score_pct = np.clip((current_score / total_questions) * 100, 0, 100)
        accuracy_val = np.clip(accuracy, 0, 100)
        
        X_test = np.array([[avg_score_pct, accuracy_val, current_score_pct]])
        prediction = model.predict(X_test)[0]
        return prediction
    except Exception as e:
        print(f"Error in ML prediction: {e}. Falling back to rule-based classification.")
        # Rule-based fallback
        if accuracy >= 90.0 and current_score >= (total_questions - 1):
            return "hard"
        elif accuracy >= 50.0 and current_score >= (total_questions // 2):
            return "medium"
        else:
            return "easy"
