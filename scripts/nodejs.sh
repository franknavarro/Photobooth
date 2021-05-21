#!/bin/sh

echo "===================================================="
echo "INSTALING NODEJS 14.x"
echo "===================================================="

curl -sL https://deb.nodesource.com/setup_14.x | bash - &&
  apt install nodejs
