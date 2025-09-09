FROM python:3.9-slim

# Add metadata labels
LABEL org.opencontainers.image.source="https://github.com/YOUR_USERNAME/relai-infra-bootstrap"
LABEL org.opencontainers.image.description="Relai infrastructure bootstrap backend container"
LABEL org.opencontainers.image.licenses="MIT"

WORKDIR /app

# Copy our simple Python script
COPY hello.py .

# Set the entrypoint to run our script
ENTRYPOINT ["python", "hello.py"]
