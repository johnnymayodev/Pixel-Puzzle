import os
import requests
from PIL import Image, ImageFilter
from dotenv import load_dotenv


# get the API key for Pexels
load_dotenv()

KEY = os.getenv("KEY")

# Variables for the API request
HEADERS = {"Authorization": KEY}
PARAMETERS = {"per_page": 1}

# Variables for the image maker
NUMBER_OF_IMAGES = 4
IMAGE_SIZE = 1600
BLUR_SCALE = 48
BLUR_LEVELS = [BLUR_SCALE, BLUR_SCALE // 2, BLUR_SCALE // 2, BLUR_SCALE // 4]
GRAYS = [1, 1, 0, 0]
FILE_NAMES = ["obj_1", "obj_2", "obj_3", "obj_4"]


def download_images(obj):
    print("Downloading images for", obj)

    url = "https://api.pexels.com/v1/search"
    PARAMETERS["query"] = obj

    # remove old images
    try:
        os.system("rm web/static/imgs/*.jpg")
    except Exception as e:
        print("Error removing old images:", e)

    try:
        # make API request
        response = requests.get(url, headers=HEADERS, params=PARAMETERS)
        response.raise_for_status()

        # get the image URL
        data = response.json()
        img_url = data["photos"][0]["src"]["original"]
        response = requests.get(img_url)

        # save the image
        with open(f"web/static/imgs/{obj}.jpg", "wb") as file:
            file.write(response.content)

        # make the images (blur and grayscale)
        image_maker(obj)
    except requests.exceptions.RequestException as e:
        print("Error making API request:", e)
        return None


def image_maker(obj):
    # make sure all lists have the same length
    assert NUMBER_OF_IMAGES == len(BLUR_LEVELS) == len(GRAYS) == len(FILE_NAMES)

    for i in range(NUMBER_OF_IMAGES):
        try:
            im = Image.open(f"web/static/imgs/{obj}.jpg")  # get the original image
            im = im.resize((IMAGE_SIZE, IMAGE_SIZE))  # resize the image
            im = im.filter(ImageFilter.GaussianBlur(BLUR_LEVELS[i]))  # blur the image
            if GRAYS[i]:  # if GRAYS[i] == 1 (if we want grayscale)
                im = im.convert("L")  # convert to grayscale
            im.save(f"web/static/imgs/{FILE_NAMES[i]}.jpg")  # save the image
        except Exception as e:
            print("An error occurred:", e)
