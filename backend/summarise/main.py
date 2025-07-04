import sys
from summarizer import summarize_text
import json # Import json to output errors in a structured way if needed

if __name__ == '__main__':
    if len(sys.argv) < 2:
        # This script expects the text to be summarized as a command-line argument
        # Or, ideally, read from stdin for longer texts.
        # For simplicity of integration with Node.js, we'll assume text via argument for now.
        # For production with large texts, consider reading from stdin.
        print("Usage: python main.py <text_to_summarize>", file=sys.stderr)
        sys.exit(1)
    
    text_to_summarize = sys.argv[1] # Get the text directly from the argument

    try:
        summary = summarize_text(text_to_summarize)
        # Print only the summary. Node.js will capture this stdout.
        print(summary)
    except Exception as e:
        # Print errors to stderr and exit with a non-zero code.
        # This is good practice for inter-process communication.
        print(f"Error: An unexpected error occurred: {e}", file=sys.stderr)
        sys.exit(1)