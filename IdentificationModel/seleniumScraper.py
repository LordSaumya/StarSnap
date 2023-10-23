import bs4
import requests
from selenium import webdriver
import os
import time

#creating a directory to save images
folder_name = 'images'
if not os.path.isdir(scraper.pyfolder_name):
    os.makedirs(folder_name)

def download_image(url, folder_name, num):

    # write image to file
    reponse = requests.get(url)
    if reponse.status_code==200:
        with open(os.path.join(folder_name, str(num)+".jpg"), 'wb') as file:
            file.write(reponse.content)



chromePath=r'C:\Users\net51\Documents\MyPythonScripts\Drivers\chromedriver.exe'
driver=webdriver.Chrome(chromePath)

search_URL = "https://www.google.com/search?q=constellation&source=lnms&tbm=isch"
driver.get(search_URL)

a = input("Waiting...")

#Scrolling all the way up
driver.execute_script("window.scrollTo(0, 0);")

page_html = driver.page_source
pageSoup = bs4.BeautifulSoup(page_html, 'html.parser')
containers = pageSoup.findAll('div', {'class':"isv-r PNCib MSM1fd BUooTd"} )

print(len(containers))

len_containers = len(containers)

for i in range(1, len_containers+1):
    if i % 25 == 0:
        continue

    xPath = """//*[@id="islrg"]/div[1]/div[%s]"""%(i)

    previewImageXPath = """//*[@id="islrg"]/div[1]/div[%s]/a[1]/div[1]/img"""%(i)
    previewImageElement = driver.find_element_by_xpath(previewImageXPath)
    previewImageURL = previewImageElement.get_attribute("src")
 

    driver.find_element_by_xpath(xPath).click()

    timeStarted = time.time()
    while True:

        imageElement = driver.find_element_by_xpath("""//*[@id="Sva75c"]/div/div/div[3]/div[2]/c-wiz/div/div[1]/div[1]/div[2]/div[1]/a/img""")
        imageURL= imageElement.get_attribute('src')

        if imageURL != previewImageURL:
            #print("actual URL", imageURL)
            break

        else:
            #making a timeout if the full res image can't be loaded
            currentTime = time.time()

            if currentTime - timeStarted > 10:
                print("Timeout! Will download a lower resolution image and move onto the next one")
                break


    #Downloading image
    try:
        download_image(imageURL, folder_name, i)
        print("Downloaded element %s out of %s total. URL: %s" % (i, len_containers + 1, imageURL))
    except:
        print("Couldn't download an image %s, continuing downloading the next one"%(i))

    #//*[@id="Sva75c"]/div/div/div[3]/div[2]/c-wiz/div/div[1]/div[1]/div[2]/div[1]/a/img
    #//*[@id="Sva75c"]/div/div/div[3]/div[2]/c-wiz/div/div[1]/div[1]/div[2]/div[1]/a/img