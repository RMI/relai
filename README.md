# relai-infra-bootstrap

This is a skeleton project of stubs that represent the overall expected Relai infrastructure (on Azure). 

## frontend

Contains a simple React JS SPA that can be deployed to Azure Static Web Apps. The goal of this is to Authorize the user on MS GraphAPI. 

The frontend depends on specific environment variables existing at `frontend/.env`. The [example file](frontend/.env.example) `frontend/.env.example` contains examples of the necessary environment variables that `frontend/.env` should contain. 

## backend

Contains a simple Docker image that can be deployed and triggered as an Azure Container App Job. The Docker container requires a `config.json` mount with a `name` key, and returns: "Hello, {name}".
