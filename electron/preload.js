// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require('electron');
const { store } = require('./store');

contextBridge.exposeInMainWorld('camera', {
  initialize: () => ipcRenderer.invoke('initialize-camera'),
  getPreview: () => ipcRenderer.invoke('get-preview'),
  takePhoto: async (position) => {
    const image = await ipcRenderer.invoke('take-photo');
    const smallImg = await ipcRenderer.invoke('add-image', image, position);
    return smallImg;
  },
  deleteImg: (path) => ipcRenderer.send('delete-img', path),
});

contextBridge.exposeInMainWorld('standard', {
  hrtime: (t) => process.hrtime(t),
});

contextBridge.exposeInMainWorld('photostrip', {
  initialize: async () => {
    const testImg = await ipcRenderer.invoke('take-photo');
    await ipcRenderer.invoke('initialize-strip', testImg);
    ipcRenderer.send('delete-img', testImg);
  },
  createStrips: () => ipcRenderer.invoke('create-strips'),
});

contextBridge.exposeInMainWorld('printer', {
  start: (printer, photo) => ipcRenderer.invoke('start-print', printer, photo),
  status: () => ipcRenderer.invoke('print-status'),
});

contextBridge.exposeInMainWorld('store', {
  store: store.store,
});
