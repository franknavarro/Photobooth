#!/bin/sh

echo "===================================================="
echo "UPDATING AUTOSTART SCRIPTS"
echo "===================================================="

mkdir -p /home/pi/.config/lxsession/LXDE-pi/ && \
  cp ./autostart-app /home/pi/.config/lxsession/LXDE-pi/autostart
