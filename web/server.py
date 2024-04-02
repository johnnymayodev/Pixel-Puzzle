import os
import sys
import time
import random
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


@app.route("/<path:path>")
def static_file(path):
    if f"{path}.html" not in os.listdir("web/template"):
        return render_template("404.html"), 404
    return render_template(path + ".html")


@app.route("/api/cheat")
def answer():
    synonyms = [CORRECT_ANSWER]
    synonyms.extend(api.get_synonyms(CORRECT_ANSWER))
    # send as a string with , as separator
    return ",".join(synonyms)


@app.route("/api/cheat/timed/")
def answer_timed():
    answers = []
    for answer in TIMED_ANSWERS:
        synonyms = [answer]
        synonyms.extend(api.get_synonyms(answer))
        answers.append("+".join(synonyms))
    # send as a string with , as separator
    return ",".join(answers)


# loop that runs every minute and checks if it's time to pick out a new object
def check_time_job():
    time.sleep(3)  # wait for the server to start
    while True:
        if time.strftime("%H:%M") == NEW_OBJECT_TIME:
            # pick out a new object
            api.download_images(CORRECT_ANSWER)
        time.sleep(59)  # sleep for 59 seconds


if __name__ == "__main__":
    LIST_OF_ANSWERS = [
        "cupboard",
        "pillow",
        "coffee maker",
        "bed",
        "spoon",
        "blanket",
        "knife",
        "stove",
        "sink",
        "washing machine",
        "pot",
        "dish",
        "fridge",
        "sofa",
        "stool",
        "cup",
        "fork",
        "glass",
        "computer",
        "notebook",
        "desk",
        "pencil",
        "bookcase",
        "book",
        "chair",
        "backpack",
        "paper",
        "glue",
        "door",
        "ruler",
        "clock",
        "whiteboard",
        "window",
        "car",
        "bicycle",
        "banknote",
        "wallet",
        "bag",
        "shirt",
        "helmet",
        "toothbrush",
        "key",
        "table",
        "coin",
        "shoe",
    ]

    # pick a random object from the list
    CORRECT_ANSWER = random.choice(LIST_OF_ANSWERS)
    api.download_images(CORRECT_ANSWER)

    # pick 5 random answers
    TIMED_ANSWERS = random.sample(LIST_OF_ANSWERS, 5)
    api.download_images_timed_mode(TIMED_ANSWERS)

    if not DEBUG:
        clock = multiprocessing.Process(target=check_time_job)
        clock.start()

    app.run(port=port, debug=DEBUG)
