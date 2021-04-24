const { ipcMain } = require('electron');
const { appendTmp } = require('./tempDirectory');
const sharp = require('sharp');

const DPI = 300;
const WHITE_BOX = {
  channels: 3,
  background: { r: 255, g: 255, b: 255 },
};

let photostrip;
let imageResize;
let border = {
  horizontal: 0,
  vertical: 0,
};
let photostripSize = {
  width: 2 * DPI,
  height: 6 * DPI,
};

const extractSize = ({ width, height }) => ({ width, height });

ipcMain.handle(
  'initialize-strip',
  async (_, stripImage, testImg, borderSize, stripSize) => {
    try {
      border = {
        horizontal: borderSize.horizontal,
        vertical: borderSize.vertical,
      };
      photostripSize = {
        width: stripSize.width * DPI,
        height: stripSize.height * DPI,
      };

      if (stripImage) {
        photostrip = await sharp(stripImage)
          .jpeg()
          .resize({ ...photostripSize })
          .toBuffer();
      } else {
        photostrip = await sharp({
          create: {
            ...photostripSize,
            ...WHITE_BOX,
          },
        })
          .jpeg()
          .toBuffer();
      }
      const imgMetadata = await sharp(testImg).metadata();
      const imageSize = extractSize(imgMetadata);

      const photoBoxSize = {
        width: photostripSize.width - border.horizontal * 2,
        height: Math.round(photostripSize.height / 4) - border.vertical * 1.5,
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
  },
);

ipcMain.handle('add-image', async (_, image, position) => {
  try {
    const newName = image + '.small.jpg';
    await sharp(image).resize(imageResize).toFile(newName);
    photostrip = await sharp(photostrip)
      .composite([
        {
          input: newName,
          top:
            border.horizontal * (position + 1) + imageResize.height * position,
          left: border.vertical,
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
    const stripsList = [
      {
        left: photostrip,
        right: photostrip,
        path: appendTmp('color.jpg'),
        description: 'Color',
      },
      {
        left: photostrip,
        right: greyscale,
        path: appendTmp('both.jpg'),
        description: 'Both',
      },
      {
        left: greyscale,
        right: greyscale,
        path: appendTmp('greyscale.jpg'),
        description: 'Black & White',
      },
    ];
    const stripsPromise = stripsList.map(async ({ left, right, path }) => {
      return await baseImg
        .composite([
          { input: left, top: 0, left: 0 },
          { input: right, top: 0, left: photostripSize.width },
        ])
        .withMetadata()
        .toFile(path);
    });
    await Promise.all(stripsPromise);
    return stripsList.map(({ path, description }) => ({ path, description }));
  } catch (error) {
    console.log(error);
    throw new Error('Strips failed to generate...');
  }
});
