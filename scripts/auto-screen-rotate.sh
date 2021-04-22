#!/bin/bash

cp ./touchscreen-rotation.sh $HOME/.touchscreen-rotation.sh
cp ./touchscreen-rotation.service /lib/systemd/system/touchscreen-rotation.service
systemctl daemon-reload
systemctl enable touchscreen-rotation.service
echo "Reboot in order for script to take effect";
