import os
from flask import Flask, request, jsonify
import google.generativeai as genai

app = Flask(__name__)

# --- Gemini API Configuration ---
try:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")
    
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("✅ Gemini model configured successfully.")

except Exception as e:
    print(f"❌ Error configuring Gemini: {e}")
    model = None

# --- Core AI Logic for Conversation Generation ---
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
    final_prompt = f"{system_instruction}\n\n---\n\nCONTEXT:\n{current_prompt}"
    try:
        response = chat.send_message(final_prompt)
        return response.text.strip()
    except Exception as e:
        print(f"❌ Error generating content with Gemini: {e}")
        raise

# --- Core AI Logic for Context Summarization ---
def summarize_turn_with_gemini(user_prompt, ai_response):
    if not model:
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
        print(f"❌ Error summarizing turn with Gemini: {e}")
        raise

# --- API Endpoints ---

@app.route('/generate', methods=['POST'])
def generate_response_endpoint():
    data = request.get_json(force=True)
    history = data.get('history', [])
    current_prompt = data.get('current_prompt')
    if not current_prompt:
        return jsonify({'error': 'current_prompt is required'}), 400
    try:
        ai_response = generate_gemini_response(history, current_prompt)
        return jsonify({'response': ai_response}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to generate response.'}), 500

# --- NEW: API Endpoint for Summarization ---
@app.route('/summarize-turn', methods=['POST'])
def summarize_turn_endpoint():
    data = request.get_json(force=True)
    user_prompt = data.get('user_prompt')
    ai_response = data.get('ai_response')
    if not user_prompt or not ai_response:
        return jsonify({'error': 'user_prompt and ai_response are required'}), 400
    try:
        concise_context = summarize_turn_with_gemini(user_prompt, ai_response)
        return jsonify({'concise_context': concise_context}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to summarize turn.'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
