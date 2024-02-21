
from PIL import Image
#import numpy as np
#define our sick pixelation function
def pixelate(image_path, resize, grayscale):
    
    #open image
    im = Image.open(image_path)
    #resize image
    small_im = im.resize((resize,resize))
    new_im = small_im.resize(im.size, Image.NEAREST)
    #check if grayscale is wanted
    if (grayscale == 1):
            new_im = new_im.convert("1")
    #showing image to confirm
    new_im.show()

#currently getting an OSError calling these functions
#fixed by swapping what slashes I used  
pixelate('static/imgs/acm-logo.jpg', 10, 1)
pixelate('static/imgs/acm-logo.jpg', 50, 0)
pixelate('static/imgs/acm-logo.jpg', 100, 0)

