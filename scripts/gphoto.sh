#!/bin/bash

LIBGPHOTO2_DIR="$HOME/libgphoto2 "
GPHOTO2_DIR="$HOME/gphoto2"

echo "INSTALLING GPHOTO2"

apt update && \
  apt install -y \
    git \
    make \
    autoconf \
    libltdl-dev \
    libusb-dev \
    libexif-dev \
    libpopt-dev \
    libxml2-dev \
    libjpeg-dev \
    libgd-dev \
    gettext \
    autopoint

git clone https://github.com/gphoto/libgphoto2.git $LIBGPHOTO2_DIR && \
  cd $LIBGPHOTO2_DIR && \
  autoreconf --install --symlink && \
  ./configure && \
  make && \
  make install && \
  cd .. && \
  rm -rf $LIBGPHOTO2_DIR

git clone https://github.com/gphoto/gphoto2.git $GPHOTO2_DIR && \
  cd $GPHOTO2_DIR && \
  autoreconf --install --symlink && \
  ./configure && \
  make && \
  make install && \
  cd .. && \
  rm -rf $GPHOTO2_DIR

echo "/usr/local/lib" >> /etc/ld.so.conf.d/libc.conf && \
	ldconfig && \
	/usr/local/lib/libgphoto2/print-camera-list udev-rules version 201 group plugdev mode 0660 | \
	  tee /etc/udev/rules.d/90-libgphoto2.rules && \
	/usr/local/lib/libgphoto2/print-camera-list hwdb | \
	  tee /etc/udev/hwdb.d/20-gphoto.hwdb
