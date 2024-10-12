import spacy
from spacytextblob.spacytextblob import SpacyTextBlob

# SpaCy Sentiment Analysis
def spacy_sentiment(text):
    # Load SpaCy's small English model
    nlp = spacy.load("en_core_web_sm")
    # Add the SpacyTextBlob component to the pipeline
    nlp.add_pipe("spacytextblob")
    # Process the text
    doc = nlp(text)
    
    # Filter out stop words, special characters, and meaningless words (words not recognized by SpaCy)
    word_sentiments = {
        token.text: token._.blob.polarity 
        for token in doc 
        if not token.is_stop and token.is_alpha and token.pos_ not in ["X", "SYM", "PUNCT"]
    }
    
    # Calculate overall sentiment polarity of the entire text
    overall_polarity = doc._.blob.polarity
    return overall_polarity, word_sentiments

# Example usage
text = "I hate this world asdfdsf"
print("SpaCy Sentiment:", spacy_sentiment(text))
