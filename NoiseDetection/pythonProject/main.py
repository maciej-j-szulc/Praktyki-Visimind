import cv2 as cv
import numpy as np

def denoising(image, filtLvl):
    im_dn = cv.fastNlMeansDenoising(image, None, filtLvl, 7, 21)
    diff = cv.absdiff(image, im_dn)

    allPixels = np.sum(diff)
    samePixels = np.sum(diff == 0)
    noiseLvl = allPixels - samePixels
    noiseLvlPercent = noiseLvl / allPixels

    cv.imshow('Noise level: {:.2f}'.format(noiseLvlPercent), image)
    cv.imshow('Denoised', im_dn)

    cv.waitKey(0)
    cv.destroyAllWindows()

def denoisingColor(image, filtLvl):
    im_dn = cv.fastNlMeansDenoisingColored(image, None, 2, 10, 7, 21)
    diff = cv.absdiff(image, im_dn)

    allPixels = np.sum(diff)
    samePixels = np.sum(diff == 0)
    noiseLvl = allPixels - samePixels
    noiseLvlPercent = noiseLvl / allPixels

    cv.imshow('Noise level: {:.2f}'.format(noiseLvlPercent), image)
    cv.imshow('Denoised', im_dn)

    cv.waitKey(0)
    cv.destroyAllWindows()

im = cv.imread('bezi.jpg')
im2 = cv.imread('noisy.png')
denoisingColor(im,10)
denoising(im2,10)