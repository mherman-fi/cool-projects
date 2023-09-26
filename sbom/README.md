# Project Description

This project tests the viability of managing IT infrastructure using the continuous Software Bill of Materials (SBOM) platform Dependency-Track. The task involved building a scalable environment to mimic a large IT network comprised of several thousand virtual machines. 

This was achieved through a host of automated processes which pulled system information from Docker images using [Grype](https://anchore.com/opensource/) and local machines using [Distro2sbom](https://pypi.org/project/distro2sbom/). The tools then convert this information to CycloneDX json formatted files for further processing. The image SBOM-to-Dependency-Track pipeline was executed through Grype. The local machine SBOM-to-Dependency-Track pipeline was controlled by the automation tool [Bolt](https://www.puppet.com/community/open-source/bolt). 

### Project Pipeline

![pipeline](docs/files/readme/images/pipeline.png)

BOMs are scanned by Dependency-Track for vulnerabilities as part of the upload process. This can also be done by Grype, but these scans but are not supported.

## Capabilities

A large part of the infrastructure management process can be done within Dependency Track. It is capable of monitoring component usage across all versions of every application in its portfolio. It can identify components with known vulnerabilities, components which are out of date, modified components and license risks.

The following capabilities were tested:

* SBOM generation via Grype and Distro2sbom
* Inventory management
* Linux Packet, library and software enumeration
* Docker container enumeration
* Vulnerability notifications
* Vulnerability feed collection
* Comparing enumeration results with vulnerability feeds to generate alerts
## Setup and Challenges

The UI setup process and basic usage is explained in detail in the official documentation and is quite straightforward. The API documentation is very thin, however, and frequently inaccurate. This became a significant issue over time because almost all phases of the project hinged on direct interaction with the API. This ranged from building the environment to creating the BOMs to sending them to Dependency-Track. All of these phases required custom automated scripting solutions. 

A private IP instead of public IP had to be used when the Dependency-Track API was in the same network as the target machine. This seems to be a quirk associated with the VLE and is unlikely to be an issue in a production environment. The documentation also indicated endpoints return lists of all components for a given project. This was not the case; it only returned 100 components. This issue was solved by adding `offset` and `limit` parameters to the request. These parameters were not found in the documentation.

Another challenge was that endpoints were not accurately reported. Ultimately only the `/api/v1/vulnerability`, `/api/v1/bom`and `/api/v1/project` endpoints were used. It is possible to navigate endpoints using a Swagger browser extension, but the setup process is rather burdensome. The best option for API documentation in our experience is the third-party site [yoursky.blue](https://yoursky.blue/documentation/rest-api/). This is our recommended troubleshooting resource.

Resolving dependency issues related to Pip and Python also proved to be a significant challenge.

### Custom Scripts

Scripts were designed to reduce the need to navigate the UI and to provide the possibility to cross-reference components and projects. The `get-outdated`script lists all component versions and compares them to the latest version available. This enables the use of `grep` to source information about multiple components simultaneously. This is not easily done in the UI. 

Another script, `generate-vuln-report`, organises projects into a table formatted according to their CVSS and EPSS scores. Finally, `pocsploit` fetches information from Dependency-Track API about known exploited vulnerabilities and the projects they affect. These are then checked against exploits available at Exploit-DB and a centralised GitHub PoC exploit repository housing PoCs dating back to 1999.
