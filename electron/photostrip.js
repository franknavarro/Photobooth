const { ipcMain } = require('electron');
const { appendTmp } = require('./tempDirectory');
const sharp = require('sharp');

const DPI = 300;
const WHITE_BOX = {
  channels: 3,
  background: { r: 255, g: 255, b: 255 },
};

let photostripTemplate;
let photostrip;
let imageResize;
let imagePositions = [];
let border = {
  horizontal: 0,
  vertical: 0,
};
let photostripSize = {
  width: 2 * DPI,
  height: 6 * DPI,
};

ipcMain.handle('initialize-strip', async (_, settings) => {
  const {
    borders,
    logoPosition,
    maxPhotos,
    photoSize,
    stripImage,
    stripSize,
  } = settings;

  border = {
    horizontal: borders.horizontal,
    vertical: borders.vertical,
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
  photostripTemplate = photostrip;
  const usingPhotos = maxPhotos + (logoPosition === 'none' ? 0 : 1);
  const photoBoxSize = {
    width: photostripSize.width - border.horizontal * 2,
    height: photostripSize.height / usingPhotos - border.vertical * 1.5,
  };

  switch (photoSize) {
    case '3x2':
      imageResize = {
        width: photoBoxSize.width,
        height: (photoBoxSize.width * 2) / 3,
      };
      break;
    default:
      imageResize = { ...photoBoxSize };
      break;
  }

  let topStart = 0;
  if (logoPosition === 'top') {
    topStart =
      photostripSize.height -
      (imageResize.height + border.vertical * maxPhotos + 1);
  }

  imagePositions = [...Array(maxPhotos)].map((_, photoI) => ({
    left: border.vertical,
    top:
      topStart + imageResize.height * photoI + border.horizontal * (photoI + 1),
  }));
  return { ...imageResize };
});

ipcMain.handle('add-image', async (_, image, position) => {
  try {
    const newName = appendTmp(Date.now() + '.jpg');
    await sharp(image).resize(imageResize).toFile(newName);
    photostrip = await sharp(photostrip)
      .composite([{ input: newName, ...imagePositions[position] }])
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
        ...WHITE_BOX,
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
    photostrip = photostripTemplate;
    await Promise.all(stripsPromise);
    return stripsList.map(({ path, description }) => ({ path, description }));
  } catch (error) {
    console.log(error);
    throw new Error('Strips failed to generate...');
  }
});

ipcMain.handle('sample-strip', async (_, image) => {
  const input = await sharp(image).resize(imageResize).toBuffer();
  const composites = imagePositions.map((pos) => ({ input, ...pos }));
  const samplePath = appendTmp(`sample-strip-${Date.now()}.jpg`);
  photostrip = await sharp(photostrip).composite(composites).toFile(samplePath);
  return samplePath;
});
