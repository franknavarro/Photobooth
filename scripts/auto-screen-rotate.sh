#!/bin/bash

echo "===================================================="
echo "INITIALIZING TOUCH SCREEN ROTATION"
echo "===================================================="

cp ./touchscreen-rotation.sh $HOME/.touchscreen-rotation.sh
cp ./touchscreen-rotation.service /lib/systemd/system/touchscreen-rotation.service
systemctl daemon-reload
systemctl enable touchscreen-rotation.service

echo "===================================================="
echo "Reboot in order for touch screen rotation to take effect";
echo "===================================================="
