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
