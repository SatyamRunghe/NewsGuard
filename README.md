# NewsGuard — News Credibility Analyzer

A full-stack NLP and machine-learning application that analyzes news articles and classifies them as **Likely Fake** or **Likely Real** based on patterns learned from a training dataset.

## Live Website

https://news-guard-iudtyx32g-satyam-a16a.vercel.app/

## Features

- News article credibility classification
- TF-IDF text feature extraction
- Logistic Regression classification
- Model confidence score
- Article-to-article textual similarity comparison
- Cosine similarity analysis
- MongoDB analysis history
- React + Flask full-stack architecture
- Responsive editorial-style interface

## Tech Stack

### Frontend
- React
- Vite
- CSS

### Backend
- Python
- Flask
- Flask-CORS

### Machine Learning
- Pandas
- Scikit-learn
- TF-IDF
- Logistic Regression
- Cosine Similarity
- Joblib

### Database
- MongoDB Atlas
- PyMongo

## Architecture

React Frontend
?
Flask REST API
?
TF-IDF Vectorizer
?
Logistic Regression Model
?
MongoDB Atlas

## ML Pipeline

Fake.csv + True.csv
?
Data preprocessing
?
Train/Test Split
?
TF-IDF Vectorization
?
Logistic Regression
?
Model Evaluation
?
Saved model and vectorizer

## Model Performance

The Logistic Regression model achieved approximately **98.57% accuracy on the held-out test set**.

This should not be interpreted as real-world fact-checking accuracy.

## Important Limitation

NewsGuard does not independently verify whether a claim is factually true.

The prediction reflects patterns learned from the training dataset.

The comparison feature measures textual similarity between two articles; it does not prove that either article is factually correct.

## Project Structure

NewsGuard/
+-- backend/
¦   +-- dataset/
¦   +-- model/
¦   +-- app.py
¦   +-- train_model.py
¦   +-- requirements.txt
¦
+-- frontend/
¦   +-- src/
¦   +-- index.html
¦   +-- package.json
¦
+-- README.md

## Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

## Author

Satyam Runghe

BTech IT / Computer Science Student
Samrat Ashok Technological Institute, Vidisha
