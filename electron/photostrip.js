const { ipcMain, ipcRenderer } = require('electron');
const sharp = require('sharp');

let imageResize;
let photostrip;
const DPI = 300;
const BORDER = Math.round((1 / 8) * DPI);
const photostripSize = {
  width: 2 * DPI,
  height: 6 * DPI,
};
const extractSize = ({ width, height }) => ({ width, height });

ipcMain.handle('initialize-strip', async (_, testImg) => {
  try {
    photostrip = await sharp('/home/pi/Desktop/BrunchPS-01.jpg')
      .jpeg()
      .resize({ ...photostripSize })
      .toBuffer();
    const imgMetadata = await sharp(testImg).metadata();
    const imageSize = extractSize(imgMetadata);

    const photoBoxSize = {
      width: photostripSize.width - BORDER * 2,
      height: Math.round(photostripSize.height / 4) - BORDER * 2,
    };
    imageResize = {
      width: photoBoxSize.width,
      height: Math.round(
        (photoBoxSize.width * imageSize.height) / imageSize.width,
      ),
    };
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
});

ipcMain.handle('add-image', async (_, image, position) => {
  try {
    const newName = image + '.small.jpg';
    await sharp(image).resize(imageResize).toFile(newName);
    photostrip = await sharp(photostrip)
      .composite([
        {
          input: newName,
          top: BORDER * (position + 1) + imageResize.height * position,
          left: BORDER,
        },
      ])
      .toBuffer();
    return newName;
  } catch (error) {
    console.log(error);
    return '';
  }
});

ipcMain.handle('create-strips', async () => {
  try {
    const greyscale = await sharp(photostrip).greyscale().toBuffer();
    const baseImg = sharp({
      create: {
        width: photostripSize.width * 2,
        height: photostripSize.height,
        channels: 3,
        background: { r: 0, g: 0, b: 0 },
      },
    });
    const stripsPromise = [
      { left: photostrip, right: photostrip, path: '/tmp/color.jpg' },
      { left: photostrip, right: greyscale, path: '/tmp/both.jpg' },
      { left: greyscale, right: greyscale, path: '/tmp/greyscale.jpg' },
    ].map(async ({ left, right, path }) => {
      return await baseImg
        .composite([
          { input: left, top: 0, left: 0 },
          { input: right, top: 0, left: photostripSize.width },
        ])
        .withMetadata()
        .toFile(path);
    });
    await Promise.all(stripsPromise);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
});
