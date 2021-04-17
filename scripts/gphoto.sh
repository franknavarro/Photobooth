#/bin/bash

: '
sudo apt-get install -y \
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

git clone https://github.com/gphoto/libgphoto2.git $HOME/libgphoto2 && \
  cd $HOME/libgphoto2 && \
  autoreconf --install --symlink && \
  ./configure && \
  make && \
  sudo make install

git clone https://github.com/gphoto/gphoto2.git $HOME/gphoto2 && \
  cd $HOME/gphoto2 && \
  autoreconf --install --symlink && \
  ./configure && \
  make && \
  sudo make install
'

sudo echo "/usr/local/lib" >> /etc/ld.so.conf.d/libc.conf && \
	sudo ldconfig && \
	/usr/local/lib/libgphoto2/print-camera-list udev-rules version 201 group plugdev mode 0660 | sudo tee /etc/udev/rules.d/90-libgphoto2.rules && \
	/usr/local/lib/libgphoto2/print-camera-list hwdb | sudo tee /etc/udev/hwdb.d/20-gphoto.hwdb
