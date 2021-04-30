const { ipcMain } = require('electron');
const { Storage } = require('@google-cloud/storage');

ipcMain.handle('get-buckets', async (_, settings) => {
  const storage = new Storage(settings);
  const [buckets] = await storage.getBuckets();
  return buckets.map((b) => b.name);
});
