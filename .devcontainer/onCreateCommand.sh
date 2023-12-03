#!/bin/bash

set -euo pipefail
IFS=$'\n\t'

# Install time package
sudo apt update
sudo apt install -y time

# Install Bun
curl -fsSL https://bun.sh/install | bash
