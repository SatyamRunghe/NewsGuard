import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

import joblib

fake_news = pd.read_csv("dataset/Fake.csv")
real_news = pd.read_csv("dataset/True.csv")

print("Fake news:", len(fake_news))
print("Real news:", len(real_news))

fake_news["label"] = 0
real_news["label"] = 1

news_data = pd.concat([fake_news, real_news], ignore_index=True)

print(news_data["label"].value_counts())

news_data = pd.concat([fake_news, real_news], ignore_index=True)

news_data["content"] = news_data["title"] + " " + news_data["text"]

X = news_data["content"]
y = news_data["label"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("Training data:", len(X_train))
print("Testing data:", len(X_test))

vectorizer = TfidfVectorizer(
    stop_words="english",
    max_df=0.7
)

X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

print("TF-IDF training shape:", X_train_tfidf.shape)
print("TF-IDF testing shape:", X_test_tfidf.shape)

model = LogisticRegression(max_iter=1000)

model.fit(X_train_tfidf, y_train)

print("Model training completed!")

accuracy = model.score(X_test_tfidf, y_test)

print("Model Accuracy:", accuracy)

joblib.dump(model, "model/news_model.pkl")
joblib.dump(vectorizer, "model/tfidf_vectorizer.pkl")

print("Model and vectorizer saved successfully!")