import tkinter as tk
from tkinter import filedialog, Text
import os
import cv2 as cv
import numpy as np
import csv
from matplotlib import pyplot as plt
from PIL import Image

def denoising(image):
    im_dn = cv.fastNlMeansDenoisingColored(image, None, 10, 10, 7, 21)
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

def hist(image):

    hist = cv.calcHist(image, [3], None, [256], [0, 256])
    # plot the histogram
    plt.figure()
    plt.title("Histogram")
    plt.xlabel("Jasność pikseli")
    plt.ylabel("Ilość pikseli")
    plt.plot(hist)
    plt.xlim([0, 256])
    plt.show()

def histogram_norm(im):  # normalizacja histogramu
    pl = im.histogram()
    w, h = im.size #
    N = w * h # mozna zastapić przez stat.Stat(im).count
    pl_norm = []
    for item in pl:
        pl_norm.append(item / N)
    return pl, pl_norm


def histogram_cumul(pl, pl_norm):  # pl -historam, pl_norm - histogram znormalizowany,  na wyjsciu histogram skumulowany
    pl_cumulative = []
    for i in range(len(pl)):
        if i == 0:
            pl_cumulative.append(pl_norm[i])
        else:
            pl_cumulative.append(pl_cumulative[i - 1] + pl_norm[i])
    return pl_cumulative


def histogram_equalization(im): # im -obraz w trybie "L", na wyjściu obraz, którego histogram jest wyrównany
    pl, pl_norm = histogram_norm(im)
    pl_cumulative = histogram_cumul(pl, pl_norm)
    t_im = np.array(im)
    (r, c) = t_im.shape
    T = np.zeros((r, c), dtype=np.uint8)
    for i in range(r):
        for j in range(c):
            n = t_im[i, j]
            T[i, j] = 255 * pl_cumulative[n]
    t_cumulative = T.astype('uint8')
    im_equalized = Image.fromarray(t_cumulative, "L")
    return im_equalized


def load_images_from_folder(folder):
    for filename in os.listdir(folder):
        path = os.path.join(folder,filename)
        img = cv.imread(path)
        im = Image.open(path)
        im = im.convert('L')
        if img is not None:
            copy1 = img.copy()
            copy2 = img.copy()
            copy3 = img.copy()
            denoising(copy1)
            blur_level(copy2)
            hist(copy3)
            im_equalized = histogram_equalization(im)
            im_equalized.show()
            hist2 = im_equalized.histogram()
            plt.title("Histogram wyrównany")
            plt.bar(range(256), hist2[:256], color='b', alpha=1)
            plt.show()


root = tk.Tk()

def addApp():
    filename= filedialog.askdirectory(initialdir="/", title="Wybierz folder ze zdjęciami")

    with open('results.csv','w') as file:
        writer = csv.writer(file)
        writer.writerow(["Results of image manipulations"])

    load_images_from_folder(filename)

canvas = tk.Canvas(root, height=500, width=500, bg="white")
canvas.pack()

frame = tk.Frame(root, bg="white")
frame.place(relwidth=0.8, relheight=0.8, relx=0.1, rely=0.1)

openFile = tk.Button(frame, text="Wybierz folder", padx=10, pady=5,width=390,height=395, fg="white", bg="#263D42", command=addApp)
openFile.pack()



root.mainloop()
