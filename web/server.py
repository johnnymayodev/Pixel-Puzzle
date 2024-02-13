from flask import Flask, render_template, request, redirect, url_for, send_from_directory

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


if __name__ == "__main__":
    app.run(debug=True, port=port)
