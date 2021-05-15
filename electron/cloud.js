const { ipcMain } = require('electron');
const admin = require('firebase-admin');
const path = require('path');
const sharp = require('sharp');
const uuid = require('uuid');

const MAX_PICTURE_SIZE = 2000;
const metadata = {
  cacheControl: 'private,max-age=5184000',
  contentDisposition: 'attatchment',
};

const getUrl = (bucketName, filePath, token) =>
  `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
    filePath,
  )}?alt=media&token=${token}`;

ipcMain.handle('bucket-exists', async (_, certPath, bucketName) => {
  let app;
  try {
    app = admin.initializeApp(
      {
        credential: admin.credential.cert(certPath),
        storageBucket: bucketName,
      },
      `bucket-checker-${uuid.v4()}`,
    );
    const bucket = app.storage().bucket();
    const exists = await bucket.exists();
    console.log({ exists, bucketName });
    return exists[0];
  } catch {
    return false;
  } finally {
    if (app) await app.delete();
  }
});

ipcMain.handle('create-event', async (_, certPath, id, name, password) => {
  let app;
  try {
    app = admin.initializeApp(
      { credential: admin.credential.cert(certPath) },
      `event-creator-${uuid.v4()}`,
    );
    console.log({ id, password, name });
    const newUser = await app.auth().createUser({
      email: id + '@frankandmissy.com',
      password,
      displayName: name,
    });
    const event = app.firestore().collection('events').doc(id);
    await event.set({ name });
    return { eventId: id, displayName: name, uid: newUser.uid };
  } catch (error) {
    throw new Error(error);
  } finally {
    if (app) await app.delete();
  }
});

ipcMain.handle('delete-event', async (_, certPath, uid, eventId) => {
  let app;
  try {
    app = admin.initializeApp(
      { credential: admin.credential.cert(certPath) },
      `event-deleter-${uuid.v4()}`,
    );
    await app.auth().deleteUser(uid);
    await app.firestore().collection('events').doc(eventId).delete();
  } catch (error) {
    console.log(error);
  } finally {
    if (app) await app.delete();
  }
});

ipcMain.handle('get-events', async (_, certPath) => {
  let app;
  try {
    app = admin.initializeApp(
      { credential: admin.credential.cert(certPath) },
      `event-grabber-${uuid.v4()}`,
    );
    const users = await app.auth().listUsers();
    const usersStripped = users.users.map(({ displayName, uid, email }) => ({
      displayName,
      uid,
      eventId: email.split('@')[0],
    }));
    return usersStripped;
  } catch (error) {
    throw new Error(error.message);
  } finally {
    if (app) await app.delete();
  }
});

ipcMain.on(
  'upload-photos',
  async (_, { certPath, bucketName, eventUID }, files, ratio) => {
    let errorKey;
    if (!certPath) errorKey = 'Key File';
    else if (!bucketName) errorKey = 'Bucket Name';
    else if (!eventUID) errorKey = 'Event ID';

    try {
      if (errorKey) {
        throw new Error(`${errorKey} is not defined in cloud settings.`);
      }
      let app;
      try {
        app = admin.initializeApp(
          {
            credential: admin.credential.cert(certPath),
            storageBucket: bucketName,
          },
          `uploader-${uuid.v4()}`,
        );
        const bucket = app.storage().bucket();
        await bucket.exists();

        const heightCalc = {
          width: MAX_PICTURE_SIZE,
          height: Math.round((MAX_PICTURE_SIZE * ratio.height) / ratio.width),
        };
        const widthCalc = {
          width: Math.round((MAX_PICTURE_SIZE * ratio.width) / ratio.height),
          height: MAX_PICTURE_SIZE,
        };
        const imageResize =
          widthCalc.width <= MAX_PICTURE_SIZE ? widthCalc : heightCalc;

        const webPrefix = '.web.jpg';

        const resized = files.map(({ full }) =>
          sharp(full)
            .resize(imageResize)
            .toFile(full + webPrefix),
        );
        await Promise.all(resized);

        const webUpload = files.map(async ({ full, small }) => {
          const destination = `${eventUID}/full/${path.basename(small)}`;
          const token = uuid.v4();
          const createdAt = parseInt(path.basename(small).split('.')[0]);
          await bucket.upload(full + webPrefix, {
            destination,
            metadata: {
              ...metadata,
              metadata: { firebaseStorageDownloadTokens: token },
            },
          });
          return { url: getUrl(bucket.name, destination, token), createdAt };
        });
        const smallUpload = files.map(async ({ small }) => {
          const destination = `${eventUID}/thumbnail/${path.basename(small)}`;
          const token = uuid.v4();
          const createdAt = parseInt(path.basename(small).split('.')[0]);
          await bucket.upload(small, {
            destination,
            metadata: {
              ...metadata,
              metadata: { firebaseStorageDownloadTokens: token },
            },
          });
          return { url: getUrl(bucket.name, destination, token), createdAt };
        });
        const webResults = await Promise.all(webUpload);
        const smallResults = await Promise.all(smallUpload);

        const eventPhotos = app.firestore().collection(eventUID);
        const databaseUpdates = webResults.map(async (webInfo, index) => {
          const smallInfo = smallResults[index];
          await eventPhotos.add({
            thumbnail: smallInfo.url,
            full: webInfo.url,
            createdAt: admin.firestore.Timestamp.fromMillis(webInfo.createdAt),
          });
        });
        await Promise.all(databaseUpdates);
      } catch (error) {
        console.log(error);
      } finally {
        if (app) await app.delete();
      }
    } catch (error) {
      console.log(error);
    }
  },
);

ipcMain.handle('update-event', async (_, certPath, uid, fields) => {
  let app;
  try {
    app = admin.initializeApp(
      { credential: admin.credential.cert(certPath) },
      `event-updater-${uuid.v4()}`,
    );
    const oldUserData = await app.auth().getUser(uid);

    const filteredFields = {};
    if (fields.id) filteredFields.email = fields.id + '@frankandmissy.com';
    if (fields.name) filteredFields.displayName = fields.name;
    if (fields.password) filteredFields.password = fields.password;
    console.log(filteredFields);
    const newUser = await app.auth().updateUser(uid, filteredFields);

    const oldId = oldUserData.email.split('@')[0];
    const newId = newUser.email.split('@')[0];
    const events = app.firestore().collection('events');
    if (oldId !== newId) await events.doc(oldId).delete();
    await events.doc(newId).set({ name: newUser.displayName });

    return {
      eventId: newId,
      displayName: newUser.displayName,
      uid: newUser.uid,
    };
  } catch (error) {
    throw new Error(error);
  } finally {
    if (app) await app.delete();
  }
});
