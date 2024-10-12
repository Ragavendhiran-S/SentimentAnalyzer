from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS to handle cross-origin requests
import sentiment_analyzer

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/analyze', methods=['POST'])
def analyze():
    text = request.get_json()
    print(f"Received text: {text}")  # Debug line to check incoming data

    if not text or 'query' not in text:
        return jsonify({'error': 'No text provided'}), 400  # Handle missing key

    sentiment = sentiment_analyzer.spacy_sentiment(text['query'])
    print(f"Analyzed sentiment: {sentiment}")  # Debug line to check the result
    return jsonify({'sentiment': sentiment[0], 'word_sentiment' :sentiment[1]})

if __name__ == '__main__':
    app.run(port=5000)
