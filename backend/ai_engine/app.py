# D:/Synapse/backend/ai_engine/app.py

import os
from flask import Flask, request, jsonify
import google.generativeai as genai
import logging
# --- FIX: Import the specific exception class from the Google API core library ---
from google.api_core import exceptions

# --- Setup professional logging ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - [%(funcName)s] - %(message)s'
)

app = Flask(__name__)

# --- Centralized Gemini API Configuration ---
model = None
try:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY:
        # This is a fatal error for the service.
        logging.critical("CRITICAL: GEMINI_API_KEY not found in environment variables. AI engine cannot start.")
    else:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-2.5-flash-lite')
        logging.info("✅ Gemini model configured successfully.")
except Exception as e:
    logging.critical(f"CRITICAL: An unexpected error occurred during Gemini configuration: {e}", exc_info=True)


# --- Core AI Logic (Simplified: No try/except needed here) ---
# Let exceptions bubble up to be handled by the endpoint.
def generate_gemini_response(history, current_prompt):
    if not model:
        raise ConnectionError("Gemini model is not initialized.")

    system_instruction = (
        "The following is the relevant history from the user's current branch. "
        "Provide a helpful, accurate, and concise response to the user's latest prompt."
    )
    
    chat_history_for_api = []
    for turn in history:
        chat_history_for_api.append({'role': 'user', 'parts': [turn['user_content']]})
        chat_history_for_api.append({'role': 'model', 'parts': [turn['ai_content']]})
    
    chat = model.start_chat(history=chat_history_for_api)
    
    final_prompt_with_instruction = f"{system_instruction}\n\n--- USER PROMPT ---\n{current_prompt}"
    
    # The `try...except` is removed. The endpoint will handle it.
    response = chat.send_message(final_prompt_with_instruction)
    return response.text.strip()


def summarize_turn_with_gemini(user_prompt, ai_response):
    if not model:
        raise ConnectionError("Gemini model is not initialized.")
    
    system_instruction = (
        "You are a context summarization engine... " # (rest of your prompt)
    )
    
    prompt_for_summarizer = (
         f"{system_instruction}\n\n"
         f"--- START OF INTERACTION ---\n"
         f"USER PROMPT: \"{user_prompt}\"\n"
         f"AI RESPONSE: \"{ai_response}\"\n"
         f"--- END OF INTERACTION ---\n\n"
         f"Generate the concise summary:"
    )
    
    # The `try...except` is removed. The endpoint will handle it.
    response = model.generate_content(prompt_for_summarizer)
    return response.text.strip()


# --- API Endpoints (Revised with Robust Error Handling) ---

@app.route('/generate', methods=['POST'])
def generate_response_endpoint():
    # --- FIX: Check if the model was loaded successfully on startup ---
    if not model:
        logging.error("Request rejected because the Gemini model is not configured.")
        return jsonify({'error': 'AI service is not configured.'}), 503 # 503 Service Unavailable

    data = request.get_json()
    if not data or 'current_prompt' not in data:
        return jsonify({'error': 'Invalid request: JSON body with current_prompt is required.'}), 400

    history = data.get('history', [])
    current_prompt = data.get('current_prompt')
    
    try:
        logging.info("Received request to generate content.")
        ai_response = generate_gemini_response(history, current_prompt)
        logging.info("Successfully generated content.")
        return jsonify({'response': ai_response}), 200
        
    # --- FIX: Catch the specific quota error first ---
    except exceptions.ResourceExhausted as e:
        logging.warning(f"Gemini Quota Exceeded: {e}")
        return jsonify({'error': 'AI provider quota exceeded. Please try again later.'}), 429 # 429 Too Many Requests
        
    # --- FIX: Catch any other exception as a generic server error ---
    except Exception as e:
        logging.error(f"An unhandled exception occurred in /generate: {e}", exc_info=True)
        return jsonify({'error': 'An internal error occurred in the AI service.'}), 500


@app.route('/summarize-turn', methods=['POST'])
def summarize_turn_endpoint():
    if not model:
        logging.error("Request rejected because the Gemini model is not configured.")
        return jsonify({'error': 'AI service is not configured.'}), 503

    data = request.get_json()
    if not data or 'user_prompt' not in data or 'ai_response' not in data:
        return jsonify({'error': 'Invalid request: JSON body with user_prompt and ai_response is required.'}), 400

    user_prompt = data.get('user_prompt')
    ai_response = data.get('ai_response')
    
    try:
        logging.info("Received request to summarize turn.")
        concise_context = summarize_turn_with_gemini(user_prompt, ai_response)
        logging.info("Successfully summarized turn.")
        return jsonify({'concise_context': concise_context}), 200

    except exceptions.ResourceExhausted as e:
        logging.warning(f"Gemini Quota Exceeded during summarization: {e}")
        return jsonify({'error': 'AI provider quota exceeded. Please try again later.'}), 429

    except Exception as e:
        logging.error(f"An unhandled exception occurred in /summarize-turn: {e}", exc_info=True)
        return jsonify({'error': 'An internal error occurred in the AI service.'}), 500


if __name__ == '__main__':
    # Use a production-ready WSGI server like Gunicorn in a real deployment
    # For development, Flask's server is fine.
    app.run(host='0.0.0.0', port=5000)