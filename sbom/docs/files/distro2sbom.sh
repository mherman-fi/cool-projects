#!/bin/bash
dep_track_api="http://10.40.20.91:8081"
dep_track_project=$dep_track_api"/api/v1/project"
dep_track_bom=$dep_track_api"/api/v1/bom"
dep_track_api_key="X-API-Key: IPxr0yAABscUJxBFlcEqzh8REohKu25A"
#check python version
if ! python3 -c 'import sys; assert sys.version_info <= (3,7)' 2> /dev/null; then 
    echo "Valid python version"
else
    python_version=$(python3 --version)
    echo $python_version
    echo "Invalid python version. 3.7 or higher is required"
    exit 1;
fi
#check if pip is installed
if  pip --version 2>/dev/null || pip3 --version 2>/dev/null; then 
    echo "Pip found"
else
    echo "Pip not found!"
    exit 1;
fi

dep_folder=~/.dep_data
dep_project_name=$(hostname)
distro_name=$(cat /etc/os-release | grep -E '^(NAME)=' | grep -Eo '["\047].*["\047]' | tr -d '"')
version=$(uname -r)
#If dependency track folder is found means that this machine already has project in dependency track.
if [ -d $dep_folder ] 
then
    echo "Directory $dep_folder exists."
    #Read projects id from the file. This will be used to send data to dependency track
    project_id=$(cat $dep_folder/project_id)
else
    #If "~/.dep_track" folder is not located new project is created to dependency track and its id is saved to .bolt_data.
    echo "Directory $dep_folder does not exists."

    #Machines hostname is used as project name. This means same dependency track instance can't be used across multiple networks. Project naming convention can be changed easily. 
    curl_response=$(curl -w '{"status_code":"%{http_code}"}' --silent -X "PUT" $dep_track_project -H 'Content-Type: application/json' -H "$dep_track_api_key" -d '{"name":"'$dep_project_name'","parent":null,"classifier":"OPERATING_SYSTEM","tags":[],"active":true}')
    echo $curl_response
    project_status=$(echo $curl_response | grep -o '"status_code":"[^"]*' | grep -o '[^"]*$')
    if ! [ "$project_status" = "201" ]; then
        #You might have tried to create new project with name that is already exists
    	echo "Could not create new project to dependency track. There might be project with the same name already created. "
        echo $curl_response
    else
        #If new project is created to dependency track "~/.dep_folder" folder will be created. "~/.bolt_data" will have file called project_id that will contain this projects id
    	project_id=$(echo $curl_response | grep -o '"uuid":"[^"]*' | grep -o '[^"]*$')
    	mkdir $dep_folder

    	echo $project_id > $dep_folder/project_id
    	echo "New project created"
        


    fi
fi

#Path where distro2sbom is installed.

echo "Installing distro2sbom"

pip install distro2sbom
distro2sbom_path=$(find / -name distro2sbom 2>/dev/null | grep /bin/ | sed -n '1p')
#Get distro type
if which dpkg &>/dev/null; then
    distro_type='deb'
elif which rpm &>/dev/null; then
    distro_type='rpm'
else
    distro_type='auto'
fi

echo "Running distro2sbom this might take few minutes"

command="${distro2sbom_path} --distro '$distro_type' --name '$distro_name' --release '$version' --system --format json --sbom cyclonedx --output-file distro2sbom_cyc.json"
bash -c "$command"
#add project id and bom to file
echo -n '{"project":"'$project_id'","bom":"' > json_beg.txt
#base64 encode results and add to same file
echo $(base64 distro2sbom_cyc.json)\"\} >> json_beg.txt
#delete spaces
cat json_beg.txt | tr -d " " > payload.json
curl -X "PUT" $dep_track_bom -H 'Content-Type: application/json' -H "$dep_track_api_key" -d @payload.json 
rm json_beg.txt
rm distro2sbom_cyc.json
rm payload.json
