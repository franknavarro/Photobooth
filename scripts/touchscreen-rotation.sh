#!/bin/bash


DISPLAY_NAME="TSTP MTouch";

LEFT="0 -1 1 1 0 0 0 0 1"
RIGHT="0 1 0 -1 0 1 0 0 1";
NORMAL="1 0 0 0 1 0 0 0 1";
INVERTED="-1 0 1 0 -1 1 0 0 1";

touchscreen_id=$(xinput | grep -oP "${DISPLAY_NAME}\s+id=\K[0-9]");


if [[ ! -z "$touchscreen_id" ]]; then
  echo "SUCCESS: Inverting ${DISPLAY_NAME}";
  xinput --set-prop $touchscreen_id 'Coordinate Transformation Matrix' 0 -1 1 1 0 0 0 0 1;
else
  echo "ERROR: ${DISPLAY_NAME}";
  exit 1;
fi
