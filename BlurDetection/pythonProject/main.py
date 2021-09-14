import cv2

def variance_of_laplacian(image):
    return cv2.Laplacian(image, cv2.CV_64F).var()

def show_result(image):
    grey = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    fm = variance_of_laplacian(grey)
    text = "Not blurry"

    if fm < 45:
        text = "Blurry"

    cv2.putText(image, "{}: {:.2f}".format(text, fm), (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 3)
    cv2.imshow("Image", image)
    key = cv2.waitKey(0)


img1 = cv2.imread('bezi.jpg')
img2 = cv2.imread("jesien1.jpg")
img3 = cv2.imread("original.png")
img4 = cv2.imread("BlurryDavid.jpg")
show_result(img1)
show_result(img2)
show_result(img3)
show_result(img4)