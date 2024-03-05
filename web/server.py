import os
import sys
import time
import multiprocessing
from flask import Flask, render_template

# add the backend module to the path
script_path = os.path.dirname(__file__)
module_path = os.path.join(script_path, "..", "backend")
sys.path.append(module_path)

import api

app = Flask(__name__, template_folder="./template", static_folder="./static")
port = 8090

NEW_OBJECT_TIME = "4:00"  # a new object is picked out 4:00 every day
DEBUG = True


@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/guess/<guess>")
def guess(guess):
    if guess.lower() == CORRECT_ANSWER:
        return "CORRECT"
    else:
        return "WRONG"


def print_time():
    time.sleep(3)  # wait for the server to start
    while True:
        if time.strftime("%H:%M") == NEW_OBJECT_TIME:
            # pick out a new object
            api.download_images(CORRECT_ANSWER)
        time.sleep(59)  # sleep for 59 seconds


if __name__ == "__main__":
    CORRECT_ANSWER = "apple"  # this should be replaced when we implement picking out a new object every 24 hours
    api.download_images(CORRECT_ANSWER)

    if not DEBUG:
        clock = multiprocessing.Process(target=print_time)
        clock.start()
    app.run(port=port, debug=DEBUG)
