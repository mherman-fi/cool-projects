# Dependency-Track Installation Guide

## Setup

Dependency-Track [(GitHub)](https://github.com/DependencyTrack/dependency-track) is a component analysis platform that allows organizations to identify and reduce risk in their software supply chains. The tool leverages Software Bills of Material (SBOMs) to monitor component usage across organizations. The approach provides capabilities that traditional Software Composition Analysis (SCA) solutions cannot achieve.

## Requirements

Dependency-Track requires considerable resources to run. Deployment requirements for the Docker container are as follows:

### API Server
| **Minimum**             | **Recommended**         |
|-------------------------|-------------------------|
| 4GB RAM                 | 16GB RAM                |
| 2 CPU cores             | 4 CPU cores             |


### Frontend
| **Minimum**             | **Recommended**         |
|-------------------------|-------------------------|
| 512MB RAM               | 1GB RAM                 |
| 1 CPU core              | 2 CPU cores             |


## Installation

### Docker Compose

Download the latest docker-compose file:  

```
curl -LO https://dependencytrack.org/docker-compose.yml
```

If your project uses `docker-compose` v1, start the stack with the command:  

```
docker-compose up -d
```

**OR** if you're using the latest ```docker compose``` v2 project, start the stack using the command:  

```
docker compose up -d
```

### Docker Swarm

```
# Downloads the latest Docker Compose file
curl -LO https://dependencytrack.org/docker-compose.yml

# Initializes Docker Swarm (if not previously initialized)
docker swarm init

# Starts the stack using Docker Swarm
docker stack deploy -c docker-compose.yml dtrack
```

### Kubernetes with Helm

The community-maintained Helm chart can be found [here](https://github.com/evryfs/helm-charts/tree/master/charts/dependency-track).

Helm v3:  

```
helm repo add evryfs-oss https://evryfs.github.io/helm-charts/
helm install dependency-track evryfs-oss/dependency-track --namespace dependency-track --create-namespace
```  

Helm v2:  

```
helm repo add evryfs-oss https://evryfs.github.io/helm-charts/
helm install evryfs-oss/dependency-track --name dependency-track --namespace dependency-track --create-namespace
```  

## Configuration

### Database Support

Dependency-Track has an internal H2 database for testing and evaluation purposes. This should be changed to a dedicated database. Currently supported databases can be viewed on the [Dependency-Track documentation site](https://docs.dependencytrack.org/getting-started/database-support/).

Edit the relevant lines in the ```docker-compose.yml``` file To configure Dependency-Track to use a database.  

Configuring Dependency-Track to use PostgreSQL would require settings along these lines:  

```
alpine.database.mode=external
alpine.database.url=jdbc:postgresql://localhost:5432/dtrack
alpine.database.driver=org.postgresql.Driver
alpine.database.username=dtrack
alpine.database.password=password
```

