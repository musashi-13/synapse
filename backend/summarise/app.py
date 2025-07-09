import os
from flask import Flask, request, jsonify
import google.generativeai as genai

app = Flask(__name__)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("Error: GEMINI_API_KEY not found in environment variables.")
    # In a production environment, you might want to raise an exception here
    # or exit to prevent the app from running without a critical dependency.
    # raise ValueError("GEMINI_API_KEY is not set.")
else:
    genai.configure(api_key=GEMINI_API_KEY)
    # Initialize the Generative Model
    # 'gemini-pro' is generally suitable for text summarization.
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("Gemini model configured successfully.")

def summarize_text_with_gemini(text):
    """
    Summarizes the given text using the Google Gemini API.
    """
    if not text:
        return ""

    # Construct the prompt for summarization
    prompt = f"Please summarize the following text concisely: \n\n{text}"

    try:
        # Use generate_content to get the summary from the Gemini model.
        # Gemini Pro has a generous context window, but for extremely long texts,
        # custom chunking and iterative summarization might be needed.
        response = model.generate_content(prompt)
        # Extract the text from the first part of the first candidate response.
        summary = response.candidates[0].content.parts[0].text
        return summary
    except Exception as e:
        # Log the error details for debugging on the server side.
        print(f"Error summarizing text with Gemini: {e}")
        # Re-raise the exception to be caught by the Flask error handler,
        # ensuring the client receives an appropriate 500 response.
        raise

@app.route('/summarize', methods=['POST'])
def summarize():
    """
    Handles POST requests to the /summarize endpoint.
    Expects a JSON body with a 'text' field.
    Summarizes the text using Gemini and returns the summary.
    """
    data = request.get_json()
    text = data.get('text')

    # Validate input: text must be present and a string.
    if not text or not isinstance(text, str):
        return jsonify({'error': 'Text is required and must be a string'}), 400

    try:
        # Call the summarization function.
        summary = summarize_text_with_gemini(text)
        # Return the summary as a JSON response.
        return jsonify({'summary': summary}), 200
    except Exception as e:
        # Catch any exceptions during summarization and return a 500 error.
        # The specific error details are logged server-side, not exposed to the client.
        return jsonify({'error': 'Failed to summarize text due to an internal error.'}), 500

# This block ensures the Flask app runs only when the script is executed directly.
# It starts the development server, listening for incoming HTTP requests.
if __name__ == '__main__':
    print("Starting Flask app...")
    # Run the Flask app, making it accessible from all network interfaces (0.0.0.0)
    # on port 5000, as configured in your Docker Compose setup.
    app.run(host='0.0.0.0', port=5000)
    # This line should ideally not be reached during normal operation, as the server
    # is expected to run continuously. It would only be hit if the server shuts down.
    print("Flask app has shut down.")
