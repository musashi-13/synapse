import os
from flask import Flask, request, jsonify
import google.generativeai as genai
import logging

# --- Basic Logging Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)

# --- Gemini API Configuration ---
model = None
try:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY:
        # This error is critical, so we log it as an error.
        logging.error("GEMINI_API_KEY not found in environment variables. The application will not work.")
        # You might want to exit or handle this more gracefully depending on your setup
    else:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')
        logging.info("✅ Gemini model configured successfully.")

except Exception as e:
    logging.error(f"❌ An unexpected error occurred during Gemini configuration: {e}")


# --- Core AI Logic for Conversation Generation ---
def generate_gemini_response(history, current_prompt):
    if not model:
        logging.error("Cannot generate response because Gemini model is not initialized.")
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
    
    # Combine the system instruction and the user prompt into a single string.
    final_prompt_with_instruction = (
        f"{system_instruction}\n\n"
        f"--- USER PROMPT ---\n"
        f"{current_prompt}"
    )

    try:
        # Pass the combined content as a single argument.
        response = chat.send_message(final_prompt_with_instruction)
        return response.text.strip()
    except Exception as e:
        # Log the specific error from the Gemini API
        logging.error(f"❌ Error generating content with Gemini: {e}")
        raise


# --- Core AI Logic for Context Summarization ---
def summarize_turn_with_gemini(user_prompt, ai_response):
    if not model:
        logging.error("Cannot summarize turn because Gemini model is not initialized.")
        raise ConnectionError("Gemini model is not initialized.")
    
    system_instruction = (
        "You are a context summarization engine. Your task is to read a user's prompt and an AI's response "
        "and create a very concise, keyword-rich summary of the interaction. This summary will be used "
        "as long-term memory for the AI. Focus on the core concepts, entities, and intent. "
        "The output should be a single, dense paragraph."
    )
    
    prompt_for_summarizer = (
        f"{system_instruction}\n\n"
        f"--- START OF INTERACTION ---\n"
        f"USER PROMPT: \"{user_prompt}\"\n"
        f"AI RESPONSE: \"{ai_response}\"\n"
        f"--- END OF INTERACTION ---\n\n"
        f"Generate the concise summary:"
    )

    try:
        response = model.generate_content(prompt_for_summarizer)
        return response.text.strip()
    except Exception as e:
        logging.error(f"❌ Error summarizing turn with Gemini: {e}")
        raise


# --- API Endpoints ---

@app.route('/generate', methods=['POST'])
def generate_response_endpoint():
    # Use get_json(silent=True) to avoid raising an exception on bad JSON
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON or Content-Type header not set to application/json'}), 400

    history = data.get('history', [])
    current_prompt = data.get('current_prompt')

    if not current_prompt:
        return jsonify({'error': 'current_prompt is required'}), 400
    
    try:
        ai_response = generate_gemini_response(history, current_prompt)
        return jsonify({'response': ai_response}), 200
    except Exception as e:
        # ✅ Log the actual exception here!
        logging.error(f"A critical error occurred in /generate endpoint: {e}", exc_info=True)
        return jsonify({'error': 'Failed to generate response.'}), 500


@app.route('/summarize-turn', methods=['POST'])
def summarize_turn_endpoint():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON or Content-Type header not set to application/json'}), 400

    user_prompt = data.get('user_prompt')
    ai_response = data.get('ai_response')

    if not user_prompt or not ai_response:
        return jsonify({'error': 'user_prompt and ai_response are required'}), 400
    
    try:
        concise_context = summarize_turn_with_gemini(user_prompt, ai_response)
        return jsonify({'concise_context': concise_context}), 200
    except Exception as e:
        # ✅ Log the actual exception here!
        logging.error(f"A critical error occurred in /summarize-turn endpoint: {e}", exc_info=True)
        return jsonify({'error': 'Failed to summarize turn.'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
