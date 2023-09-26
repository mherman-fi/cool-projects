# Building the Environment

The project required building a large network of machines and components. This readme explains the steps involved in this process. The simulated network relied heavily on Docker images. It is understood that this will not strictly be the case in a virtual-machine heavy production environment. Enumeration of virtual machines can be achieved using [Distro2sbom](https://pypi.org/project/distro2sbom/) and [Bolt](https://www.puppet.com/community/open-source/bolt) automation. The process is documented [here](https://gitlab.labranet.jamk.fi/AB8910/jyvsectec/-/blob/main/sbom/bolt/Boltdir/Bolt.md). 

## Purpose

The environment was built primarily with Docker images scraped from Docker Hub. System information was extracted from the images and converted into the CycloneDX json format by [Grype](https://anchore.com/opensource/). The Python script, `scrape-dockerimages`, scrapes Docker image information. The Bash script, `dockerimages-to-sbom` generates SBOMs from the Docker images using Grype. These are then sent to Dependency-Track for further processing.

## Scraping Docker

### Setup Requirements: `scrape-dockerimages.py`

1. Selenium: Install with `pip install selenium`.
2. BeautifulSoup: Install using `pip install beautifulsoup4`.
3. Chrome webdriver: Downloadable from [this](https://googlechromelabs.github.io/chrome-for-testing/) location. 

A useful guide to setting up the Chome and Selenium webdrtiver can be found [here](https://techstarspace.engineer/2020/02/19/setup-chrome-driver-for-selenium-on-kali-linux/).

### Usage

* Install required Python packages using `pip install -r requirements.txt`.
* Modify the folder variable in the Python script to set the destination directory for the Docker image pull commands file.
* Customize the scraping targets (Docker Hub pages or endpoints if necessary).
* Run the script to generate the Docker image pull commands file with the command `python3 scrape-dockerimages.py`.

### `scrape-dockerimages.py`

``` python
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
```



## SBOM Generation

### Setup Requirements: `dockerimages-to-sbom.sh`

1. Install Grype with the command `curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /usr/local/bin`
2. Install Syft with the command `curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin`
3. Ensure Docker is installed

* Ensure the image variables point to the Docker imagelist.txt file.
* Adjust paths and filenames as necessary.
* Run the script with the command `./dockerimages-to-sbom.sh`
* Docker images are removed once the BOM data has been extracted. This helps reduce system resouce usage during the build process. 

### `dockerimages-to-sbom.py`

``` python
#!/bin/bash

# Create SBOM/sboms directory if it doesn't exist
mkdir -p ~/SBOM/sboms

# Iterate through each line (docker image) in dockerimages.txt
index=0
while IFS= read -r image; do
    echo "Pulling Docker image: $image"

    # Extract package name from image name (assuming image format: repository/packa>
    package=$(echo "$image")
    package=$(echo $package | tr / -)
    # Run grype and save the output to a JSON file
    grype $image -o cyclonedx-json > "/home/kali/SBOM/sboms/$package.json"
    # Stop and remove the Docker image
    docker rmi "$image"
    index=$((index + 1))

if [ $index -eq 100 ]; then
echo "Sleeping..."
sleep 6h
index=0

fi
done < ~/SBOM/dockerimages.txt
```

## Notes

* Class names in Docker Hub may change over time. The scraper will break if this occurs. It is advisable to confirm class names are still correct if errors are encountered when running the script.

* Docker rate-limits pulls to 100 per 6 hours when using the `docker pull` command. This has been considered in the script but the relevant code-block has been circumvented by pulling images with Grype. There are no known limits to pulling using this method. 

* The `dockerimages-to-sbom`script utilizes Syft for SBOM generation. Syft's functionality is built into Grype. This is why there are no instances where Syft is explicitly used in this process. Grype also performs vulnerability scans. Dependency Track does not currently have support for third party integrations; vulnerability management is instead performed internally. This means Grype's vulnerability scans are not used. 
