# summarizer.py
from transformers import BartTokenizer, BartForConditionalGeneration

# Load the model and tokenizer once
model_name = 'facebook/bart-large-cnn'
tokenizer = BartTokenizer.from_pretrained(model_name)
model = BartForConditionalGeneration.from_pretrained(model_name)

def summarize_chunk(chunk, max_length=150, min_length=30):
    """Summarize a single chunk of text using BART."""
    inputs = tokenizer(chunk, return_tensors='pt', max_length=1024, truncation=True)
    
    summary_ids = model.generate(
        inputs['input_ids'],
        max_length=max_length,
        min_length=min_length,
        length_penalty=2.0,
        num_beams=4,
        early_stopping=True
    )
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary

def calculate_dynamic_lengths(word_count):
    """
    Dynamically calculates max_length and min_length for summarization
    based on the input word count.
    These values are illustrative and can be fine-tuned.
    """
    if word_count < 50:
        max_len = min(word_count, 50)
        min_len = min(int(word_count * 0.8), max_len)
    elif word_count < 200:
        max_len = int(50 + (word_count - 50) * 0.2) # Increases by 20% of excess over 50
        min_len = int(max_len * 0.6)
    elif word_count < 1000:
        max_len = int(80 + (word_count - 200) * 0.1) # Increases by 10% of excess over 200
        min_len = int(max_len * 0.5)
    else: # very long texts (>= 1000 words)
        max_len = int(160 + (word_count - 1000) * 0.05) # Increases by 5% of excess over 1000
        max_len = min(max_len, 300) # Cap summary length for extremely long texts to 300 words
        min_len = int(max_len * 0.4)

    # Ensure min_len doesn't exceed max_len and maintains a reasonable lower bound
    min_len = min(min_len, max_len - 10) # Ensure a difference of at least 10 words
    if min_len < 10: min_len = 10 # Absolute minimum summary length of 10 words

    # Ensure max_len has a reasonable lower bound too, especially for very short texts
    if max_len < 10: max_len = 10
        
    return max_len, min_len

def summarize_text(text):
    """Summarize the entire text by processing chunks and refining the result,
    dynamically adjusting summary length based on input text length."""
    from preprocess import clean_text, split_text 
    
    cleaned_text = clean_text(text)
    
    text_word_count = len(cleaned_text.split())
    
    # Explicitly handle very short texts to return original text or close to it
    # This avoids unnecessary model calls for tiny inputs and preserves meaning.
    if text_word_count <= 20: # If 20 words or less, just return the cleaned text
        return cleaned_text
        
    final_max_length, final_min_length = calculate_dynamic_lengths(text_word_count)

    chunks = split_text(cleaned_text)
    
    # Process each chunk with default summarization parameters
    # These are intermediate summaries, so fixed lengths are fine.
    chunk_summaries = [summarize_chunk(chunk, max_length=150, min_length=30) for chunk in chunks] 
    
    combined_summary = ' '.join(chunk_summaries)
    
    # The final summarization step uses the dynamically calculated lengths
    # This applies whether there was one original chunk or multiple
    final_summary = summarize_chunk(combined_summary, max_length=final_max_length, min_length=final_min_length)
        
    return final_summary