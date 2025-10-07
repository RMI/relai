# Relai single-page app (SPA)

Contains a simple React JS SPA that can be deployed to Azure Static Web Apps. The goal of this is to:

- Sign in to an RMI account (currently on DEV tenant only)
- select content on Azure to be summarized (email, OneDrive files in a specific folder, a chat group, and a Teams Channel)
- Trigger a Relai summary
- Sign out user

## Setup

This depends on specific environment variables existing at `.env`. The [example file](.env.example) `.env.example` contains examples of the necessary environment variables that `.env` should contain. 

Create a `.env` file by copying the `.env.example` and entering the following information:
```
VITE_REACT_APP_CLIENT_ID="{your_client_id_here}"
VITE_REACT_APP_AUTHORITY="https://login.microsoftonline.com/{your_tenant_id_here}"
VITE_REACT_APP_REDIRECT_URI=http://localhost:3000
```

The serverless API requires some env vars to access the Foundry API. Locally, these can be stored in a [api/local.settings.json](api/local.settings.json) file (which should never be pushed to the repo and is in [.gitignore](.gitignore)), and when running with `swa start build --api-location api` the Azure SWA CLI will simulate what the Azure system will do on the production environment making those env vars available to the serverless API backend only. For the production environment, these env vars need to be added in the Azure Portal config for the Static Web App under Settings > Environment Variables. For more info, see https://learn.microsoft.com/en-us/azure/static-web-apps/application-settings.

The `api/local.settings.json` file should look like this:
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AZURE_FOUNDRY_KEY": "{your_api_key}",
    "AZURE_FOUNDRY_ENDPOINT": "https://rmi-data-ai.services.ai.azure.com",
    "AZURE_FOUNDRY_MODEL": "gpt-4o",
    "AZURE_FOUNDRY_API_VERSION": "2024-05-01-preview"
  }
}
```

## Available scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Docker

To build and run the app using Docker run
`docker compose up --build`
