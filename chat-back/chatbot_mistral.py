# ▶️ chatbot_mistral.py

import os
from flask import Flask, jsonify, request
from mistralai import Mistral
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Get API key from environment variable
api_key = os.getenv("MISTRAL_API_KEY")
if not api_key:
    raise ValueError(
        "MISTRAL_API_KEY environment variable is not set. "
        "Please check your .env file and make sure it contains MISTRAL_API_KEY=your-api-key-here"
    )

model = "mistral-large-latest"
client = Mistral(api_key=api_key)

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        user_input = data.get("message", "")
        
        if not user_input:
            return jsonify({"error": "No message provided"}), 400

        # Create chat completion
        chat_response = client.chat.complete(
            model=model,
            messages=[
                {"role": "user", "content": user_input}
            ]
        )

        # Extract the response content
        response_content = chat_response.choices[0].message.content

        return jsonify({
            "response": response_content
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
