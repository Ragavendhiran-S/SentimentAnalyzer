'use client';

import styles from "./page.module.css";
import { Line } from 'react-chartjs-2';
import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Home() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [wordSentiments, setWordSentiments] = useState({});
  const [faqStates, setFaqStates] = useState({}); // State for individual FAQ items



  const analyzeSentiment = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'query': text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      setWordSentiments(data.word_sentiment);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentLevel = (score) => {
    if (score === 0) return "Neutral";
    if (score > 0.5) return "Highly Positive";
    if (score > 0) return "Positive";
    if (score < -0.5) return "Highly Negative";
    return "Negative";
  };

  const chartData = {
    labels: Object.keys(wordSentiments).map((_, index) => index + 1),
    datasets: [
      {
        label: 'Sentiment Score',
        data: Object.values(wordSentiments),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 1)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        tension: 0.1,
      },
    ],
  };

  // Function to clean words by removing special characters
  const cleanWord = (word) => {
    return word.replace(/[^a-zA-Z]/g, ''); // Remove non-alphabetic characters
  };

  const toggleFaq = (index) => {
    setFaqStates((prevStates) => ({
      ...prevStates,
      [index]: !prevStates[index], // Toggle the specific FAQ item
    }));
  };

  const faqs = [
    { question: "What is Sentiment Analysis?", answer: "Sentiment analysis is a natural language processing (NLP) technique used to determine whether a piece of text expresses a positive, negative, or neutral sentiment." },
    { question: "What can I use this application for?", answer: "You can use this application to analyze the sentiment of any text, such as customer reviews, social media posts, or personal notes." },
    { question: "How does the sentiment analysis work?", answer: "The application analyzes the text you provide and assigns sentiment scores to individual words and the overall text." },
    { question: "What do the sentiment scores mean?", answer: "Positive scores indicate positive sentiment, while negative scores indicate negative sentiment. A score close to zero suggests a neutral sentiment." },
    { question: "Can I analyze long texts?", answer: "Yes, you can analyze long texts. However, for the best results, try to keep your text focused on a single topic or theme." },
    { question: "What types of texts can I analyze?", answer: "You can analyze any type of text, including product reviews, comments on social media, blog posts, and more." },
    { question: "How accurate is the sentiment analysis?", answer: "The accuracy of sentiment analysis can vary based on the complexity of the text and the context. While it can provide valuable insights, it's not perfect and should be used as a supplementary tool rather than a definitive measure." },
    { question: "What is the 'Word Sentiments' section?", answer: "The 'Word Sentiments' section displays the individual sentiment scores for each word in your input text." },
  ];

  return (
    <div className={styles.container}>
      {!loading ? (
        <div className={styles.textQueryArea}>
          <h1 className={styles.h1}>Sentiment Analysis</h1>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="4"
            cols="50"
            placeholder="Type your text here..."
            className={styles.textarea}
          />
          <button onClick={analyzeSentiment} disabled={loading} className={styles.button}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
          <div className={styles.result}>
            {result ? (
              <div className={styles.sentimentResults}>
                <p>Sentiment Score: <strong>{result.sentiment}</strong></p>
                <p>Sentiment Level: <strong>{getSentimentLevel(result.sentiment)}</strong></p>
                <p>Total Word-Count: <strong>{text.split(" ").length}</strong></p>
                <div className={styles.resultContainer}>
                  <div className={styles.wordSentiments}>
                    <h2>Word Sentiments</h2>
                    <ul>
                      {Object.entries(wordSentiments).map(([word, score]) => {
                        const cleanedWord = cleanWord(word); // Clean the word
                        return (
                          cleanedWord && ( // Only render if cleaned word is not empty
                            <li key={word}>
                              <span>{cleanedWord}</span>
                              <span className={styles.sentimentScore}>{score}</span>
                            </li>
                          )
                        );
                      })}
                    </ul>
                  </div>
                  <div className={styles.lineChart}>
                    <Line data={chartData} />
                  </div>
                </div>
              </div>
            ) : <></>}
          </div>

          {/* FAQ Section */}
          <div className={styles.faqSection}>
            <h2 className={`${styles.faqTitle} ${styles.faqTitleFeature}`}>FAQ's</h2>
            {faqs.map((faq, index) => (
              <div>
                <div key={index} className={styles.faqItem}>
                  <h3 className={styles.faqTitle} onClick={() => toggleFaq(index)}>
                    {faq.question}
                  </h3>
                  <h3 className={styles.faqTitle} onClick={() => toggleFaq(index)}>
                    {faqStates[index] ? '-' : '+'}
                  </h3>

                </div>
                {
                  faqStates[index] && (
                    <p className={styles.faqAnswer}>{faq.answer}</p>
                  )
                }
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.loaderConatiner}>
          <div className={styles.loader}></div>
        </div>
      )}
    </div>
  );
}
