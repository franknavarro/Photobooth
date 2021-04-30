const { ipcMain } = require('electron');
const { Storage } = require('@google-cloud/storage');

ipcMain.handle('get-buckets', async (_, settings) => {
  console.log(settings);
  const storage = new Storage(settings);
  console.log(storage);
  const [buckets] = await storage.getBuckets();
  console.log(buckets);
  return buckets.map((b) => b.name);
});
