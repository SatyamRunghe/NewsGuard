import { useState } from "react";
import "./App.css";

function App() {
  const [article, setArticle] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [referenceArticle, setReferenceArticle] = useState("");
  const [comparison, setComparison] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);

  const analyzeArticle = async () => {
    if (!article.trim()) {
      alert("Please paste a news article first.");
      return;
    }

    setLoading(true);
    setResult(null);
    setComparison(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            article: article,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Prediction failed");
      }

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Could not connect to the Flask server.");
    }

    setLoading(false);
  };

  const compareArticles = async () => {
    if (!article.trim()) {
      alert("Please analyze an article first.");
      return;
    }

    if (!referenceArticle.trim()) {
      alert("Please paste a trusted/reference article.");
      return;
    }

    setCompareLoading(true);
    setComparison(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/compare",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            article1: article,
            article2: referenceArticle,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Comparison failed");
      }

      setComparison(data);
    } catch (error) {
      console.error(error);
      alert("Could not compare the articles.");
    }

    setCompareLoading(false);
  };

  const scrollToAnalyzer = () => {
    document
      .getElementById("analyzer")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const scrollToHowItWorks = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <div className="app">

      {/* ================= HEADER ================= */}

      <header className="site-header">

        <div className="header-inner">

          <div className="brand">

            <div className="brand-mark">
              NG
            </div>

            <div>
              <div className="brand-name">
                NEWSGUARD
              </div>

              <div className="brand-subtitle">
                News Credibility Analyzer
              </div>
            </div>

          </div>

          {/* Updated project information */}

          <div className="header-date">
            <span>2026 /</span>
            <strong>NLP + ML</strong>
          </div>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main>

        {/* ================= HERO ================= */}

        <section className="hero">

          <div className="hero-kicker">
            NEWS • NLP • MACHINE LEARNING
          </div>

          <h1>
            Can you trust
            <br />
            what you're reading?
          </h1>

          <p className="hero-text">
            Analyze the language and patterns of a news article
            using machine learning, then compare it with a
            reference source.
          </p>

          <div className="hero-actions">

            <button
              className="black-button"
              onClick={scrollToAnalyzer}
            >
              Analyze an Article
              <span>↓</span>
            </button>

            <button
              className="text-button"
              onClick={scrollToHowItWorks}
            >
              How it works →
            </button>

          </div>

        </section>


        {/* ================= INTRO STRIP ================= */}

        <section className="intro-strip">

          <div>

            <span className="strip-number">
              01
            </span>

            <strong>
              ARTICLE ANALYSIS
            </strong>

          </div>

          <p>
            A machine-learning based approach to
            news credibility analysis.
          </p>

          <div className="strip-tech">
            TF-IDF / LOGISTIC REGRESSION
          </div>

        </section>


        {/* ================= ANALYZER ================= */}

        <section
          className="analysis-section"
          id="analyzer"
        >

          <div className="section-title">

            <div>

              <span>
                ANALYSIS
              </span>

              <h2>
                Examine the article
              </h2>

            </div>

            <div className="section-number">
              01
            </div>

          </div>


          <div className="article-panel">

            <div className="panel-header">

              <div>

                <label
                  htmlFor="article-input"
                  className="panel-label"
                >
                  Paste news article
                </label>

                <p>
                  Add the article text below.
                </p>

              </div>

              <span>
                TEXT INPUT
              </span>

            </div>


            <textarea
              id="article-input"
              name="article"
              className="main-textarea"
              value={article}
              onChange={(e) =>
                setArticle(e.target.value)
              }
              placeholder="Paste the complete news article here..."
            />


            <div className="panel-footer">

              <span>
                {article.length} characters
              </span>

              <button
                type="button"
                className="red-button"
                onClick={analyzeArticle}
                disabled={loading}
              >
                {loading
                  ? "ANALYZING..."
                  : "ANALYZE ARTICLE →"}
              </button>

            </div>

          </div>


          {/* ================= RESULT ================= */}

          {result && (

            <section className="result-section">

              <div className="result-heading">

                <span>
                  ANALYSIS REPORT
                </span>

                <small>
                  MACHINE LEARNING OUTPUT
                </small>

              </div>


              <div className="result-grid">

                <div
                  className={`result-verdict ${
                    result.prediction ===
                    "Likely Fake"
                      ? "fake"
                      : "real"
                  }`}
                >

                  <span>
                    PREDICTION
                  </span>

                  <h2>
                    {result.prediction}
                  </h2>

                  <p>
                    Classification based on
                    patterns learned from the
                    training dataset.
                  </p>

                </div>


                <div className="result-confidence">

                  <span>
                    MODEL CONFIDENCE
                  </span>

                  <strong>
                    {result.confidence}%
                  </strong>

                  <div className="confidence-track">

                    <div
                      style={{
                        width: `${result.confidence}%`,
                      }}
                    ></div>

                  </div>

                </div>


                <div className="result-method">

                  <span>
                    METHOD
                  </span>

                  <strong>
                    TF-IDF
                  </strong>

                  <p>
                    Text feature extraction
                    followed by Logistic
                    Regression classification.
                  </p>

                </div>

              </div>


              <div className="disclaimer">

                <strong>
                  IMPORTANT:
                </strong>

                {" "}
                This system does not independently
                verify factual truth. The prediction
                reflects patterns learned from the
                training data.

              </div>

            </section>

          )}

        </section>


        {/* ================= COMPARISON ================= */}

        {result && (

          <section className="comparison-section">

            <div className="section-title">

              <div>

                <span>
                  REFERENCE CHECK
                </span>

                <h2>
                  Compare with another source
                </h2>

              </div>

              <div className="section-number">
                02
              </div>

            </div>


            <div className="comparison-panel">

              <div className="comparison-header">

                <div>

                  <label
                    htmlFor="reference-article"
                    className="panel-label"
                  >
                    Trusted / reference article
                  </label>

                  <p>
                    Paste another article to
                    compare textual similarity.
                  </p>

                </div>

                <span>
                  SOURCE COMPARISON
                </span>

              </div>


              <textarea
                id="reference-article"
                name="referenceArticle"
                className="main-textarea comparison-textarea"
                value={referenceArticle}
                onChange={(e) =>
                  setReferenceArticle(
                    e.target.value
                  )
                }
                placeholder="Paste the trusted/reference article here..."
              />


              <button
                type="button"
                className="outline-button"
                onClick={compareArticles}
                disabled={compareLoading}
              >
                {compareLoading
                  ? "COMPARING..."
                  : "COMPARE ARTICLES →"}
              </button>


              {comparison && (

                <div className="comparison-result">

                  <div className="similarity-number">

                    <span>
                      TEXTUAL SIMILARITY
                    </span>

                    <strong>
                      {comparison.similarity}%
                    </strong>

                  </div>


                  <div className="comparison-description">

                    <h3>
                      {comparison.level}
                    </h3>

                    <p>
                      The two articles show{" "}
                      <strong>
                        {comparison.similarity}%
                      </strong>{" "}
                      textual similarity based on
                      TF-IDF and cosine similarity.
                    </p>

                    <small>
                      Similarity indicates textual
                      overlap. It does not prove that
                      either article is factually true.
                    </small>

                  </div>

                </div>

              )}

            </div>

          </section>

        )}


        {/* ================= HOW IT WORKS ================= */}

        <section
          className="method-section"
          id="how-it-works"
        >

          <div className="section-title method-title">

            <div>

              <span>
                THE PROCESS
              </span>

              <h2>
                How the system works
              </h2>

            </div>

            <div className="section-number">
              03
            </div>

          </div>


          <div className="method-grid">

            <div className="method-card">

              <div className="method-number">
                01
              </div>

              <h3>
                Input
              </h3>

              <p>
                The user provides a news article
                as plain text.
              </p>

            </div>


            <div className="method-card">

              <div className="method-number">
                02
              </div>

              <h3>
                Feature Extraction
              </h3>

              <p>
                TF-IDF converts the article into
                numerical text features.
              </p>

            </div>


            <div className="method-card">

              <div className="method-number">
                03
              </div>

              <h3>
                Classification
              </h3>

              <p>
                Logistic Regression predicts the
                learned article category.
              </p>

            </div>


            <div className="method-card">

              <div className="method-number">
                04
              </div>

              <h3>
                Comparison
              </h3>

              <p>
                A second article can be compared
                using cosine similarity.
              </p>

            </div>

          </div>


          <div className="tech-line">

            <span>
              PYTHON
            </span>

            <span>
              FLASK
            </span>

            <span>
              SCIKIT-LEARN
            </span>

            <span>
              REACT
            </span>

            <span>
              MONGODB
            </span>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="site-footer">

        <div className="footer-left">

          <div className="brand-mark small">
            NG
          </div>

          <div>

            <strong>
              NEWSGUARD
            </strong>

            <span>
              News Credibility Analyzer
            </span>

          </div>

        </div>


        <div className="footer-center">
          Built as a machine-learning project
        </div>


        <div className="footer-right">
          NLP / ML / FULL STACK
        </div>

      </footer>

    </div>
  );
}

export default App;