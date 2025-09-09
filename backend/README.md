# Hello Docker Backend

1. Create a `config.json` file in the `config` directory based on the `config.json.example` file:
   ```
   cp config/config.json.example config/config.json
   ```

3. Modify `config/config.json` to set your desired name.

## Running the Application

To build and run the application, use Docker Compose:

```
docker-compose up
```

This command will build the Docker image and run the application, which will print a greeting message based on the configuration.

# Release

To create a new release, you will need to authenticate with GHCR:

```
docker login ghcr.io
``

Then build the image with GHCR naming convention:
```
docker build -t ghcr.io/rmi/relai-infra-bootstrap/backend:latest .
```

## Push

Then push the image to GHCR:
```
docker push ghcr.io/rmi/relai-infra-bootstrap/backend:latest
```
