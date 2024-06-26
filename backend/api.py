import os
import shutil
import requests
from PIL import Image, ImageFilter
from dotenv import load_dotenv
import random

load_dotenv()
PEXEL_API_KEY = os.getenv("PEXEL_API_KEY")
THESAURUS_API_KEY = os.getenv("THESAURUS_API_KEY")

URL = "https://api.pexels.com/v1/search"
HEADERS = {"Authorization": PEXEL_API_KEY}
PARAMETERS = {"per_page": 1}

# Variables for the image maker
NUMBER_OF_IMAGES = 4
BLUR_SCALE = 128
CONFIG = [
    {"BLUR": BLUR_SCALE, "B&W": True, "FILE_NAME": "obj_1"},
    {"BLUR": BLUR_SCALE // 2, "B&W": True, "FILE_NAME": "obj_2"},
    {"BLUR": BLUR_SCALE // 2, "B&W": False, "FILE_NAME": "obj_3"},
    {"BLUR": BLUR_SCALE // 4, "B&W": False, "FILE_NAME": "obj_4"},
]


def download_images(obj):
    print("Downloading images for", obj)

    PARAMETERS["query"] = obj

    # remove old images
    if os.path.exists("web/static/imgs"):
        shutil.rmtree("web/static/imgs")

    try:
        # make API request
        response = requests.get(URL, headers=HEADERS, params=PARAMETERS)
        response.raise_for_status()

        # get the image URL
        data = response.json()
        img_url = data["photos"][0]["src"]["original"]
        response = requests.get(img_url)

        # check if imgs folder exists and create it if it doesn't
        if not os.path.exists("web/static/imgs"):
            os.makedirs("web/static/imgs")

        # save the image
        with open("web/static/imgs/obj.jpg", "wb") as file:
            file.write(response.content)

        # make the images (blur and grayscale)
        image_maker(obj)
    except requests.exceptions.RequestException as e:
        print("Error making API request:", e)
        default_image_files = os.listdir("web/static/default_imgs")

        # Choose a random default image from the list
        random_default_image = random.choice(default_image_files)
        random_image_path = os.path.join("web/static/default_imgs", random_default_image)

        new_obj = os.path.splitext(random_default_image)[0]
        print(f"Wordle mode: Using default image - {new_obj}..")

        # check if imgs folder exists and create it if it doesn't
        if not os.path.exists("web/static/imgs"):
            os.makedirs("web/static/imgs")

        # Copy the randomly chosen default image to the "imgs" folder
        shutil.copy(random_image_path, "web/static/imgs/obj.jpg")

        # Update the value of "obj"
        obj = new_obj

        # make the images (blur and grayscale)
        image_maker(new_obj)
    return obj


def image_maker(obj):
    # make sure all lists have the same length
    assert NUMBER_OF_IMAGES == len(CONFIG)

    for i in range(NUMBER_OF_IMAGES):
        try:
            im = Image.open("web/static/imgs/obj.jpg")  # get the original image
            im = im.filter(ImageFilter.GaussianBlur(CONFIG[i]["BLUR"]))  # blur the image
            if CONFIG[i]["B&W"]: 
                im = im.convert("L")  # convert to grayscale
            im.save(f"web/static/imgs/{CONFIG[i]['FILE_NAME']}.jpg")  # save the image
        except Exception as e:
            print("An error occurred:", e)


def get_synonyms(obj):
    url = "https://api.api-ninjas.com/v1/thesaurus?word={}".format(obj)
    response = requests.get(url, headers={"X-Api-Key": THESAURUS_API_KEY})
    if response.status_code == requests.codes.ok:
        data = response.json()
        return data["synonyms"]
    else:
        print("Error:", response.status_code, response.text)
        return None


def download_images_timed_mode(objs):
    used_images = set()  # Keep track of used images

    if os.path.exists("web/static/imgs/timed/"):
        shutil.rmtree("web/static/imgs/timed/")

    for i, obj in enumerate(objs):
        try:
            PARAMETERS["query"] = obj

            # make API request
            response = requests.get(URL, headers=HEADERS, params=PARAMETERS)
            response.raise_for_status()

            # get the image URL
            data = response.json()
            img_url = data["photos"][0]["src"]["original"]
            response = requests.get(img_url)

            # check if imgs folder exists and create it if it doesn't
            if not os.path.exists("web/static/imgs/timed"):
                os.makedirs("web/static/imgs/timed")

            # save the image
            with open(f"web/static/imgs/timed/{i}.jpg", "wb") as file:
                file.write(response.content)

        except Exception as e:
            print("Error making API request:", e)
            default_image_files = os.listdir("web/static/default_imgs")

            # Choose a random default image from the list
            random_default_image = random.choice(list(set(default_image_files) - used_images))
            random_image_path = os.path.join("web/static/default_imgs", random_default_image)

            new_obj = os.path.splitext(random_default_image)[0]
            print(f"Timed mode: Using default image - {new_obj}..")

            if not os.path.exists("web/static/imgs/timed"):
                os.makedirs("web/static/imgs/timed")

            # Copy the randomly chosen default image to the "imgs" folder
            shutil.copy(random_image_path, f"web/static/imgs/timed/{i}.jpg")

            # Update the value of "obj"
            objs[i] = new_obj

            # Add the used image to the set
            used_images.add(random_default_image)

    image_maker_timed_mode(objs)
    return objs


def image_maker_timed_mode(objs):
    for i, obj in enumerate(objs):
        for j in range(NUMBER_OF_IMAGES):
            try:
                im = Image.open(
                    f"web/static/imgs/timed/{i}.jpg"
                )  # get the original image
                im = im.filter(
                    ImageFilter.GaussianBlur(CONFIG[j]["BLUR"])
                )  # blur the image
                if CONFIG[j]["B&W"]:
                    im = im.convert("L")  # convert to grayscale
                im.save(f"web/static/imgs/timed/{i}_{j}.jpg")  # save the image
            except Exception as e:
                print("An error occurred:", e)
