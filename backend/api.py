import os
import requests
from PIL import Image, ImageFilter
from dotenv import load_dotenv

load_dotenv()

BASE_BLUR_SCALE = 128
difficulty_config = [
    {
        "file_name": "obj_1",
        "blur_scale": BASE_BLUR_SCALE,
        "grayscale": True,
    },
    {
        "file_name": "obj_2",
        "blur_scale": BASE_BLUR_SCALE // 2,
        "grayscale": True,
    },
    {
        "file_name": "obj_3",
        "blur_scale": BASE_BLUR_SCALE // 2,
        "grayscale": False,
    },
    {
        "file_name": "obj_4",
        "blur_scale": BASE_BLUR_SCALE // 4,
        "grayscale": False,
    }
]


def download_images(obj):
    # get the API key for Pexels
    PEXEL_API_KEY = os.getenv("PEXEL_API_KEY")

    # Variables for the API request
    HEADERS = {"Authorization": PEXEL_API_KEY}
    PARAMETERS = {"per_page": 1}
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
        return None


def image_maker(obj):
    # make sure all lists have the same length

    for i in range(len(difficulty_config)):
        try:
            im = Image.open("web/static/imgs/obj.jpg")  # get the original image
            blur_scale = difficulty_config[i]['blur_scale']
            im = im.filter(ImageFilter.GaussianBlur(blur_scale))  # blur the image
            grayscale = difficulty_config[i]['grayscale']
            if grayscale:  # if GRAYS[i] == 1 (if we want grayscale)
                im = im.convert("L")  # convert to grayscale
            file_name = difficulty_config[i]['file_name']
            im.save(f"web/static/imgs/{file_name}.jpg")  # save the image
        except Exception as e:
            print("An error occurred:", e)


def get_synonyms(obj):
    THESAURUS_API_KEY = os.getenv("THESAURUS_API_KEY")
    url = "https://api.api-ninjas.com/v1/thesaurus?word={}".format(obj)
    response = requests.get(url, headers={"X-Api-Key": THESAURUS_API_KEY})
    if response.status_code == requests.codes.ok:
        data = response.json()
        return data["synonyms"]
    else:
        print("Error:", response.status_code, response.text)
        return None
