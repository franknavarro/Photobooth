const { ipcMain } = require('electron');
const { appendTmp } = require('./tempDirectory');
const child_process = require('child_process');
const fs = require('fs');
const gphoto2 = require('gphoto2');
const util = require('util');

const exec = util.promisify(child_process.exec);

const GPhoto = new gphoto2.GPhoto2();
let camera;

const listCameras = () => {
  return new Promise((result, reject) => {
    GPhoto.list((list) => {
      if (list.length === 0) return reject('No cameras found');
      result(list);
    });
  });
};

const setCameraConfig = (key, value) => {
  return new Promise((result, reject) => {
    if (!camera) reject('No camera available to set config');
    camera.setConfigValue(key, value, (error) => {
      if (error) {
        return reject(
          `Error setting config ${key} to ${value} for ${camera.model}`,
        );
      }
      result();
    });
  });
};

const takePicture = (options) => {
  return new Promise((result, reject) => {
    if (!camera) reject('No camera available to take pitcure');
    camera.takePicture(options, (error, file) => {
      if (file) return result(file);
      reject(error === -1 ? 'Hardware Error' : error);
    });
  });
};

ipcMain.handle('initialize-camera', async () => {
  if (camera) return;

  // kill any running gphoto2 instances before retrieving camera
  try {
    await exec(
      "kill $(ps aux | grep gphoto | grep -v grep | awk '{print $2}')",
    );
  } catch {}

  const cameras = await listCameras();
  camera = cameras[0];
  await setCameraConfig('capturetarget', 1);
  await setCameraConfig('autofocus', 1);
  await setCameraConfig('flashmode', 0);
});

ipcMain.handle('get-preview', async () => {
  return await takePicture({
    preview: true,
    targetPath: appendTmp('preview.XXXXXX'),
  });
});

ipcMain.handle('take-photo', async () => {
  return await takePicture({ targetPath: appendTmp('image.XXXXXX') });
});

ipcMain.on('delete-img', (_, file) => {
  fs.unlink(file, () => null);
});
