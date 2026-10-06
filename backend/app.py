from flask import Flask, request, jsonify
from flask_cors import CORS

import joblib
from sklearn.metrics.pairwise import cosine_similarity

from pymongo import MongoClient
from dotenv import load_dotenv

from datetime import datetime
import os


# --------------------------------
# Flask Setup
# --------------------------------

app = Flask(__name__)
CORS(app)


# --------------------------------
# Load Environment Variables
# --------------------------------

load_dotenv()

mongo_uri = os.getenv("MONGO_URI")


# --------------------------------
# MongoDB Connection
# --------------------------------

try:
    client = MongoClient(
        mongo_uri,
        serverSelectionTimeoutMS=5000
    )

    # Test the connection
    client.admin.command("ping")

    db = client["NewsAnalyzer"]

    history_collection = db["analysis_history"]

    print("MongoDB connected successfully!")

except Exception as error:
    print("MongoDB connection failed:", error)

    client = None
    db = None
    history_collection = None


# --------------------------------
# Load ML Model
# --------------------------------

model = joblib.load(
    "model/news_model.pkl"
)

vectorizer = joblib.load(
    "model/tfidf_vectorizer.pkl"
)

print("Model loaded successfully!")


# --------------------------------
# Home Route
# --------------------------------

@app.route("/")
def home():

    return "News Credibility API is running!"


# --------------------------------
# News Prediction Route
# --------------------------------

@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    article = data.get("article", "")

    if not article:
        return jsonify({
            "error": "Article text is required"
        }), 400


    # Convert article into TF-IDF features

    article_tfidf = vectorizer.transform(
        [article]
    )


    # Make prediction

    prediction = model.predict(
        article_tfidf
    )[0]


    # Get prediction probabilities

    probability = model.predict_proba(
        article_tfidf
    )[0]


    # Convert prediction into readable result

    if prediction == 0:

        result = "Likely Fake"

        confidence = probability[0]

    else:

        result = "Likely Real"

        confidence = probability[1]


    confidence_percentage = round(
        float(confidence) * 100,
        2
    )


    # --------------------------------
    # Save Analysis to MongoDB
    # --------------------------------

    if history_collection is not None:

        try:

            history_collection.insert_one({

                "article": article,

                "prediction": result,

                "confidence": confidence_percentage,

                "created_at": datetime.utcnow()

            })

            print("Analysis saved to MongoDB!")

        except Exception as error:

            print(
                "Could not save analysis:",
                error
            )


    # Return result to React

    return jsonify({

        "prediction": result,

        "confidence": confidence_percentage

    })


# --------------------------------
# Article Comparison Route
# --------------------------------

@app.route("/compare", methods=["POST"])
def compare():

    data = request.get_json()

    article1 = data.get(
        "article1",
        ""
    )

    article2 = data.get(
        "article2",
        ""
    )


    if not article1 or not article2:

        return jsonify({

            "error":
            "Both articles are required"

        }), 400


    # Convert both articles
    # into TF-IDF vectors

    articles_tfidf = vectorizer.transform([

        article1,

        article2

    ])


    # Calculate cosine similarity

    similarity = cosine_similarity(

        articles_tfidf[0:1],

        articles_tfidf[1:2]

    )[0][0]


    similarity_percentage = round(

        float(similarity) * 100,

        2

    )


    # Classify similarity

    if similarity_percentage >= 70:

        similarity_level = "High Similarity"

    elif similarity_percentage >= 40:

        similarity_level = "Moderate Similarity"

    else:

        similarity_level = "Low Similarity"


    return jsonify({

        "similarity":
        similarity_percentage,

        "level":
        similarity_level

    })


# --------------------------------
# Analysis History Route
# --------------------------------

@app.route("/history", methods=["GET"])
def history():

    if history_collection is None:

        return jsonify({

            "error":
            "MongoDB is not connected"

        }), 500


    try:

        records = history_collection.find(
            {},
            {
                "_id": 0,
                "article": 1,
                "prediction": 1,
                "confidence": 1,
                "created_at": 1
            }
        ).sort(
            "created_at",
            -1
        ).limit(20)


        history_data = []


        for record in records:

            history_data.append({

                "article":
                record.get("article", ""),

                "prediction":
                record.get("prediction", ""),

                "confidence":
                record.get("confidence", 0),

                "created_at":
                record.get(
                    "created_at"
                ).isoformat()
                if record.get("created_at")
                else ""

            })


        return jsonify(history_data)


    except Exception as error:

        return jsonify({

            "error":
            str(error)

        }), 500


# --------------------------------
# Start Flask Server
# --------------------------------

if __name__ == "__main__":

    app.run(
        debug=True
    )