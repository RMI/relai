import json

# Read the config.json file from the mounted volume
with open('/config/config.json', 'r') as f:
    config = json.load(f)

# Get the name from config and print greeting
name = config.get('name', 'World')
print(f"Hello, {name}")
