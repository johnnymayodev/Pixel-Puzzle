import os
from flask import Flask, render_template

app = Flask(__name__, template_folder="./template", static_folder="./static")
port = 8090


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/<path>")
def page(path):
    if not os.path.exists("templates/" + path + ".html"):
        return render_template("404.html"), 404

    return render_template(path + ".html")


if __name__ == "__main__":
    app.run(debug=True, port=port)
