#!/bin/bash

# Navigate to the script's directory to ensure relative paths work correctly
cd "$(dirname "$0")"

echo "====================================="
echo "  Netra Jyoti Clinic Setup Script  "
echo "====================================="

echo "\n[1/3] Checking for Node.js and npm..."
if ! command -v node > /dev/null || ! command -v npm > /dev/null; then
  echo "Error: Node.js and/or npm are not installed. Please install them to continue."
  echo "Visit https://nodejs.org/ for installation instructions."
  exit 1
else
  echo "Node.js version: $(node -v)"
  echo "npm version: $(npm -v)"
  echo "Node.js and npm found."
fi

echo "\n[2/3] Installing project dependencies..."
if [ -f package.json ]; then
  npm install
  if [ $? -ne 0 ]; then
    echo "Error: npm install failed. Please check for errors above."
    exit 1
  fi
  echo "Dependencies installed successfully."
else
  echo "Error: package.json not found. Cannot install dependencies."
  exit 1
fi

echo "\n[3/3] Starting the Eye Clinic server..."
if [ -f server.js ]; then
  echo "Server will run on http://localhost:9000"
  node server.js
else
  echo "Error: server.js not found. Cannot start the server."
  exit 1
fi

echo "\nApplication startup complete."
