#!/bin/bash

echo "===================================================="
echo "INSTALLING CUPS"
echo "===================================================="

apt update && \
  apt install -y cups
