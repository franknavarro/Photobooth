const { ipcMain } = require('electron');
const child_process = require('child_process');
const fs = require('fs');
const gphoto2 = require('gphoto2');
const sharp = require('sharp');

const GPhoto = new gphoto2.GPhoto2();
let camera;

ipcMain.handle('initialize-camera', async () => {
  if (camera) {
    return await new Promise((res) => res(true));
  }
  return await new Promise((result) => {
    // kill any running gphoto2 instances before retrieving camera
    child_process.exec(
      "kill $(ps aux | grep gphoto | grep -v grep | awk '{print $2}')",
      () => {
        GPhoto.list((list) => {
          if (list.length === 0) return result(false);
          camera = list[0];
          camera.setConfigValue('capturetarget', 1, (er) => {
            if (er) return result(false);
            camera.setConfigValue('autofocus', 1, (er) => {
              if (er) return result(false);
              result(true);
            });
          });
        });
      },
    );
  });
});

ipcMain.handle('get-preview', async () => {
  if (!camera) {
    return await new Promise((_, reject) => reject('No camera connected.'));
  }
  return await new Promise((result, reject) => {
    camera.takePicture(
      {
        preview: true,
        targetPath: '/tmp/preview.XXXXXX',
      },
      (error, tmpname) => {
        if (tmpname) result(tmpname);
        else reject('ERROR:' + error);
      },
    );
  });
});

ipcMain.handle('take-photo', async () => {
  let result;
  if (!camera) {
    result = await new Promise((_, reject) => reject('No camera connected.'));
  } else {
    result = await new Promise((result) => {
      camera.takePicture(
        { targetPath: '/tmp/image.XXXXXX' },
        (camErr, tmpname) => {
          if (tmpname) return result(tmpname);
          else return reject('ERROR:' + camErr);
        },
      );
    });
  }
  return result;
});

ipcMain.on('delete-img', (_, path) => {
  fs.unlink(path, () => null);
});
