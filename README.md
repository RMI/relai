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
VITE_AZURE_FOUNDRY_ENDPOINT="https://{SERVICE_NAME}.ai.azure.com"
VITE_AZURE_FOUNDRY_KEY="{your_api_key}"
VITE_AZURE_FOUNDRY_MODEL="gpt-4o"
VITE_AZURE_FOUNDRY_API_VERSION="2024-05-01-preview"
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
