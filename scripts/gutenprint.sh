#!/bin/bash

GUTENPRINT_SNAPSHOT="gutenprint-5.3.4-2021-03-31T01-00-7d8b6d8c"
GUTENPRINT_FILE="$GUTENPRINT_SNAPSHOT.tar.xz"

apt install -y libusb-1.0-0-dev libcups2-dev && \
  cd $HOME && \
  curl -o $GUTENPRINT_FILE "https://phoenixnap.dl.sourceforge.net/project/gimp-print/snapshots/$GUTENPRINT_FILE" && \
  tar -xJf $GUTENPRINT_FILE && \
  cd $GUTENPRINT_SNAPSHOT && \
  ./configure --without-doc && \
  make -j4 && \
  make install && \
  cd .. && \
  rm -rf $GUTENPRINT_SNAPSHOT*;
