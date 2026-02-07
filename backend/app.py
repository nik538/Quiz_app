
from flask import Flask, jsonify
from flask_cors import CORS
import requests
import random
import html

app = Flask(__name__)
CORS(app)  # allow frontend to access backend

@app.route("/questions")
def questions():
    url = "https://opentdb.com/api.php?amount=5&type=multiple"
    response = requests.get(url)
    data = response.json()

    # Safety check
    if "results" not in data:
        return jsonify({
            "error": "No questions received from API",
            "raw_response": data
        }), 503

    result = []

    for q in data["results"]:
        options = q["incorrect_answers"] + [q["correct_answer"]]
        random.shuffle(options)

        result.append({
            "question": html.unescape(q["question"]),
            "options": [html.unescape(o) for o in options],
            "answer": html.unescape(q["correct_answer"])
        })

    return jsonify(result)

# 🔥 THIS WAS MISSING (MOST IMPORTANT)
if __name__ == "__main__":
    app.run(debug=True)
