
from PIL import Image
import requests
from io import BytesIO

#Biggest weakness of function is, it uses a fixed
#value, instead of a percentage, which means
#different images will be different using similar
#values, acm-logo.jpg and apple.jpg are a good
#example of this because of their different
#sizes'
def pixelate(image_path_or_url, resize, grayscale):
    try:
        #open the image
        if image_path_or_url.startswith('http'):
            response = requests.get(image_path_or_url)
            im = Image.open(BytesIO(response.content))
        else:
            im = Image.open(image_path_or_url)

        #resize the image
        small_im = im.resize((resize,resize))
        new_im = small_im.resize(im.size, Image.NEAREST)
        #check if grayscale marked as 1 (true)
        if (grayscale == 1):
                new_im = new_im.convert("1")
        #showing the result, may store images locally,
        #not yet decided
        new_im.show()
    except Exception as e:
        print("An error occurred:", e)

#currently getting an OSError calling these functions
#fixed by swapping what slashes I used  
pixelate('static/imgs/acm-logo.jpg', 10, 1)
pixelate('static/imgs/acm-logo.jpg', 25, 0)
pixelate('static/imgs/acm-logo.jpg', 50, 0)
pixelate('static/imgs/apple.jpg', 10, 1)
pixelate('static/imgs/apple.jpg', 25, 0)
pixelate('static/imgs/apple.jpg', 50, 0)