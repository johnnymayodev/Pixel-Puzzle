
from PIL import Image
#import numpy as np
#define our sick pixelation function
def pixelate(image_path, resize, grayscale):
    
    #open image
    im = Image.open(image_path)
    small_im = im.resize((resize,resize))
    new_im = small_im.resize(im.size, Image.NEAREST)
    #check if grayscale is wanted
    if (grayscale == 1):
            new_im = new_im.convert("1")
    #new dimensions via list comprehension
    #function could call in dimensions to resize image
    #showing image to confirm
    new_im.show()
    
pixelate('static\imgs\acm-logo.jpg', 10, 0)
pixelate('static\imgs\acm-logo.jpg', 50, 1)
pixelate('static\imgs\acm-logo.jpg', 100, 0)

