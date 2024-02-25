
from PIL import Image
import requests
from io import BytesIO

# Constants
OUTPUT_DIR = "web/static/imgs"
RESIZE_PERCENTAGES = [None, 10, 25, 50, 75]
GRAYS = [0, 1, 1, 0, 0]
FILENAME_SUFFIXES = ["", "_black_white", "_max_blurry", "_mid_blurry", "_min_blurry"]

#Biggest weakness of function is, it uses a fixed
#value, instead of a percentage, which means
#different images will be different using similar
#values, acm-logo.jpg and apple.jpg are a good
#example of this because of their different
#sizes'
def pixelate(im, resize, grayscale):
    try:
        #resize the image
        small_im = im.resize((resize,resize))
        new_im = small_im.resize(im.size, Image.NEAREST)
        #check if grayscale marked as 1 (true)
        if (grayscale == 1):
                new_im = new_im.convert("1")
        #showing the result, may store images locally,
        #not yet decided
        new_im.show()
        return new_im
    except Exception as e:
        print("An error occurred:", e)

def save_image_with_variations(object_name, im):
    try:
        for i, (resize_percentage, grayscale, suffix) in enumerate(zip(RESIZE_PERCENTAGES, GRAYS, FILENAME_SUFFIXES)):
            filename = f"{object_name}{suffix}.jpg"
            new_im = pixelate(im, im.size[0] if resize_percentage is None else resize_percentage, grayscale)
            if new_im:
                new_im.save(f"{OUTPUT_DIR}/{filename}")
    except Exception as e:
        print(f"An error occurred while saving variations for {object_name}: {e}")

def saveImages(object_name, image_path_or_url):
    try:
        #open the image
        if image_path_or_url.startswith('http'):
            response = requests.get(image_path_or_url)
            im = Image.open(BytesIO(response.content))
        else:
            im = Image.open(image_path_or_url)
        save_image_with_variations(object_name, im)
    except Exception as e:
        print("An error occurred:", e)


# Uncomment to test
# saveImages('nature', 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg')
saveImages('apple', 'web/static/imgs/apple.jpg')
# saveImages('acm-logo', 'web/static/imgs/acm-logo.jpg')
