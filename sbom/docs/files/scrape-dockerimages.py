import os
import requests
from selenium import webdriver
import time
from bs4 import BeautifulSoup
from pathlib import Path
home = str(Path.home())
folder=home + "/SBOM"
driver = webdriver.Chrome()
try:
    os.makedirs(folder)
except:
    pass
# Open the file for writing
with open(folder+"/dockerimages.txt", "w+") as file:
    for p in range(70, 71):
        driver.get("https://hub.docker.com/search?type=image&q=&image_filter=store&page={}".format(p))
        time.sleep(5)

        soup = BeautifulSoup(driver.page_source, "html.parser")
        links = soup.find_all("a", {"class": "styles-module__searchResult___DpBk9 styles-module__clickable___E_oF_"})
        #links = soup.find_all("a")

        for image_path in links:
            image_link = "https://hub.docker.com" + image_path.get("href") + "/tags"
            driver.get(image_link)
            time.sleep(5)
            tag_soup = BeautifulSoup(driver.page_source, "html.parser")
            pull = tag_soup.find("code", {"class": "styles-module__lightInput___i1FfU styles-module__copyable___hmul7"})
            
            if pull:
                docker_pull = pull.get("title")
                docker_pull = docker_pull.replace("docker pull ", "")
                
                # Write the Docker pull command to the file
                file.write(docker_pull + "\n")
# Close the driver and file
driver.quit()
