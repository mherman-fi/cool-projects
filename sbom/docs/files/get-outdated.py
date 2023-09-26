import requests
import json
domain = "http://198.19.14.91:8081/"
project_path = "api/v1/project"
headers = {'X-API-Key': '9mji0NeOJ88k5cBftiD3rgxGDswRmQ7w'}

def getProjectIds():
	
	projects_endpoint = domain + project_path
	r = requests.get(projects_endpoint,headers=headers)
	data = json.loads(r.text)
	project_ids = []
	for i in data:
		p_id = i.get("uuid")
		if p_id:
			project_ids.append(p_id)
	return project_ids


def getLatestVersion(purl):
	latest_version = "api/v1/repository/latest?purl=" + str(purl)
	latest_endpoint = domain + latest_version
	data = requests.get(latest_endpoint,headers=headers)
	if data.status_code != 200:
		return False
	
	data = data.json()
	return data.get("latestVersion")


def getProjectComponents(uuid):
	components = "api/v1/component/project/"
	components_endpoint = domain+ components + uuid + "?offset=1&limit=99999999"
	r = requests.get(components_endpoint,headers=headers)
	data = r.json()
	return data

project_uuids = getProjectIds()
for uuid in project_uuids:

	data = getProjectComponents(uuid)
	results = {}
	for i in data:
		project_name = i.get('project').get('name')
		results['name'] = i.get("name")
		results['version'] = i.get("version")
		results['purl'] = i.get("purl")
		purl = i.get("purl",False)
		if purl:
			latestVersion = getLatestVersion(purl)
			results['latestVersion'] = latestVersion
			if results.get("version") != latestVersion and results.get("latestVersion"):
				print("Project: " + str(project_name))
				print("Package: " + str(results.get("name")))
				print("Installed version: " + str(results.get("version")))
				print("Latest version: " + str(results.get("latestVersion")))
				print("----------------------------------------")

