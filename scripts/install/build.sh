#!/bin/bash
set -euo pipefail

BINARY_NAME="run"
INSTALL_DIR="/usr/local/bin"

# Build the binary
if ! command -v go >/dev/null 2>&1; then
  echo "Go is not installed. Please install Go and try again."
  exit 1
fi

echo "Building $BINARY_NAME binary..."
go build -o "$BINARY_NAME" .

# Copy to /usr/local/bin
sudo cp "$BINARY_NAME" "$INSTALL_DIR/"
sudo chmod +x "$INSTALL_DIR/$BINARY_NAME"

echo "✓ $BINARY_NAME installed to $INSTALL_DIR/$BINARY_NAME"

echo "Run: $BINARY_NAME -h"

