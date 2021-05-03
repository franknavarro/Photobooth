const { ipcMain } = require('electron');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const sharp = require('sharp');

const MAX_PICTURE_SIZE = 2000;
const metadata = {
  cacheControl: 'private,max-age=5184000',
  contentDisposition: 'attatchment',
};

ipcMain.handle('get-buckets', async (_, settings) => {
  const storage = new Storage(settings);
  const [buckets] = await storage.getBuckets();
  return buckets.map((b) => b.name);
});

ipcMain.on(
  'upload-photos',
  async (
    _,
    { projectId, keyFilename, bucketName, bucketPath },
    files,
    ratio,
  ) => {
    let errorKey;
    if (!projectId) errorKey = 'Project ID';
    else if (!keyFilename) errorKey = 'Key File';
    else if (!bucketName) errorKey = 'Bucket Name';

    try {
      if (errorKey) {
        throw new Error(`${errorKey} is not defined in cloud settings.`);
      }

      const heightCalc = {
        width: MAX_PICTURE_SIZE,
        height: (MAX_PICTURE_SIZE * ratio.height) / ratio.width,
      };
      const widthCalc = {
        width: (MAX_PICTURE_SIZE * ratio.width) / ratio.height,
        height: MAX_PICTURE_SIZE,
      };
      const imageResize =
        widthCalc.width <= MAX_PICTURE_SIZE ? widthCalc : heightCalc;

      const webPrefix = '.web.jpg';

      const startResize = process.hrtime();
      const resized = files.map(({ full }) =>
        sharp(full)
          .resize(imageResize)
          .toFile(full + webPrefix),
      );
      await Promise.all(resized);
      const endResize = process.hrtime(startResize);
      console.log(
        `Resized images for web in ${endResize[0]}s ${
          endResize[1] / 1000000
        }ms`,
      );

      const startUpload = process.hrtime();
      const bucket = new Storage({ projectId, keyFilename }).bucket(bucketName);
      const webUpload = files.map(({ full, small }) =>
        bucket.upload(full + webPrefix, {
          destination: `${bucketPath}/full/${path.basename(small)}`,
          metadata,
        }),
      );
      const smallUpload = files.map(({ small }) =>
        bucket.upload(small, {
          destination: `${bucketPath}/thumbnail/${path.basename(small)}`,
          metadata,
        }),
      );
      await Promise.all([...webUpload, ...smallUpload]);
      const endUpload = process.hrtime(startUpload);
      console.log(
        `Uploaded images to GCS in ${endUpload[0]}s ${
          endUpload[1] / 1000000
        }ms`,
      );
    } catch (error) {
      console.log(error.message);
    }
  },
);
