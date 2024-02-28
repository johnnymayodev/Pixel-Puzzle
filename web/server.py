from flask import Flask, render_template, jsonify

import os
import sys

script_path = os.path.dirname(__file__)
module_path = os.path.join(script_path, "..", "backend")
sys.path.append(module_path)

import api

app = Flask(__name__, template_folder="./template", static_folder="./static")
port = 8090

CORRECT_ANSWER = "apple"

@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/guess/<guess>")
def guess(guess):
    if guess == CORRECT_ANSWER:
        return "CORRECT"
    else:
        return "WRONG"

@app.route('/get_image_url/<object_name>', methods=['GET'])
def get_image_url(object_name):
    img_url = api.make_api_call(object_name)
    if img_url:
        return jsonify({'image_url': img_url})
    else:
        return jsonify({'error': 'Failed to retrieve image URL'}), 500

if __name__ == "__main__":
    app.run(debug=True, port=port)
