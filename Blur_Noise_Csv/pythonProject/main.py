import os
import cv2 as cv
import numpy as np
import csv

def denoising(image, filtrLvl):
    im_dn = cv.fastNlMeansDenoisingColored(image, None, filtrLvl, 10, 7, 21)
    diff = cv.absdiff(image, im_dn)

    allPixels = np.sum(diff)
    samePixels = np.sum(diff == 0)
    noiseLvl = allPixels - samePixels
    noiseLvlPercent = noiseLvl / allPixels
    textToCsv = 'Noise level: {:.2f}'.format(noiseLvlPercent)
    cv.imshow(textToCsv, image)
    cv.imshow('Denoised', im_dn)

    cv.waitKey(0)
    cv.destroyAllWindows()
    with open('results.csv','a',newline='') as file:
        writing = csv.writer(file)
        writing.writerow([textToCsv])


def blur_level(image):
    grey = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
    fm = cv.Laplacian(grey, cv.CV_64F).var()
    text = "Not blurry"

    if fm < 45:
        text = "Blurry"

    textToCsv = "{}: {:.2f}".format(text, fm)
    cv.putText(image, textToCsv , (10, 30), cv.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 3)
    cv.imshow("Image", image)
    key = cv.waitKey(0)
    cv.destroyAllWindows()
    with open('results.csv','a',newline='') as file:
        writing = csv.writer(file)
        writing.writerow([textToCsv])

def load_images_from_folder(folder):
    filtrLvl = input("Wybierz poziom filtra odszumiającego: ")
    filtrLvlInt = int(filtrLvl)
    for filename in os.listdir(folder):
        path = os.path.join(folder,filename)
        img = cv.imread(path)
        if img is not None:
            copy1 = img.copy()
            copy2 = img.copy()
            denoising(copy1, filtrLvlInt)
            blur_level(copy2)


chosen = input("Wybierz folder: ")
path = "./{}/".format(chosen)

with open('results.csv','w') as file:
    writer = csv.writer(file)
    writer.writerow(["Results of image manipulations"])

load_images_from_folder(path)