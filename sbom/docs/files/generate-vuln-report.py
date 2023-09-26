import requests
from tabulate import tabulate
import threading
from tqdm import tqdm
import time
import concurrent.futures
from operator import itemgetter

api_base_url = 'http://198.19.14.91:8081'
api_key = '9mji0NeOJ88k5cBftiD3rgxGDswRmQ7w'
output_file = "/tmp/cvss-epss.txt"
cvssMin = 5
epssMin = 0.5
headers = {
    'X-Api-Key': api_key
}

def process_project(project):
    global table_data
    response = requests.get(api_base_url + '/api/v1/vulnerability/project/' + project['uuid'], headers=headers)
    vulns = response.json()
    for vuln in vulns:
        cvss = vuln.get('cvssV3BaseScore', False)
        epss = vuln.get('epssScore', False)

        if cvss and cvssMin and cvss > cvssMin and epss > epssMin:
            for comp in vuln['components']:
                row = [
                    project.get('name'),
                    comp.get('version'),
                    project.get('uuid'),
                    vuln.get('vulnId'),
                    vuln.get('cvssV3BaseScore'),
                    vuln['epssScore'],
                    comp['name'],
                    comp['version']
                ]
                table_data.append(row)

def display_progress(remaining_operations, total_operations, start_time):
    while remaining_operations[0] > 0:
        completed_operations = total_operations - remaining_operations[0]

        if completed_operations == 0:
            estimated_time = 0
        else:
            estimated_time = (time.time() - start_time) / completed_operations * remaining_operations[0]

        print(f"Progress: {completed_operations}/{total_operations} ({completed_operations / total_operations:.1%}) | Remaining operations: {remaining_operations[0]} | Estimated time remaining: {estimated_time:.1f} seconds", end='\r')
        time.sleep(1)

    print("Progress: 100% | Remaining operations: 0 | Completed!")

def main():
    try:
        response = requests.get(api_base_url + '/api/v1/project?offset=1&limit=99999999', headers=headers)
        projects = response.json()
        global table_data
        table_data = []
        total_operations = len(projects)
        remaining_operations = [total_operations]

        start_time = time.time()

        progress_thread = threading.Thread(target=display_progress, args=(remaining_operations, total_operations, start_time))
        progress_thread.daemon = True
        progress_thread.start()

        with concurrent.futures.ThreadPoolExecutor() as executor:
            future_to_project = {executor.submit(process_project, project): project for project in projects}
            for future in concurrent.futures.as_completed(future_to_project):
                remaining_operations[0] -= 1

        # Sort table_data based on EPSS values in descending order
        table_data.sort(key=itemgetter(5), reverse=True)  # Sort by 6th column (EPSS)

        # Create tabulated output
        table = tabulate(table_data, headers=['NAME', 'VERSION', 'UUID', 'VULN-ID', 'CVSS', 'EPSS', 'COMPONENT-NAME', 'COMPONENT-VERSION'], tablefmt='pretty')

        with open(output_file, 'w') as txt_file:
            txt_file.write(table)

    except Exception as e:
        print('Error:', e)

if __name__ == "__main__":
    main()
