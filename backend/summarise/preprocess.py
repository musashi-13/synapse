import re
import nltk
from nltk.tokenize import sent_tokenize

nltk.download('punkt', quiet=True)

def clean_text(text):
    """Clean the text by removing extra spaces and special characters."""
    text = re.sub(r'\s+', ' ', text)  # Replace multiple spaces with single space
    return text.strip()

def split_text(text, max_length=1000):
    """Split text into chunks based on word count, respecting sentence boundaries."""
    sentences = sent_tokenize(text)
    chunks = []
    current_chunk = []
    current_length = 0
    for sentence in sentences:
        sentence_length = len(sentence.split())
        if current_length + sentence_length > max_length:
            chunks.append(' '.join(current_chunk))
            current_chunk = [sentence]
            current_length = sentence_length
        else:
            current_chunk.append(sentence)
            current_length += sentence_length
    if current_chunk:
        chunks.append(' '.join(current_chunk))
    return chunks