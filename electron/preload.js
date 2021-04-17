// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('camera', {
  getPreview: () => ipcRenderer.invoke('get-preview'),
  takePhoto: async (position) => {
    let start = process.hrtime();
    const image = await ipcRenderer.invoke('take-photo');
    start = process.hrtime();
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
    const cameraInit = await ipcRenderer.invoke('initialize-camera');
    if (cameraInit) {
      const testImg = await ipcRenderer.invoke('take-photo');
      return ipcRenderer.invoke('initialize-strip', testImg);
    } else {
      return false;
    }
  },
  createStrips: () => ipcRenderer.invoke('create-strips'),
});

contextBridge.exposeInMainWorld('printer', {
  start: (photo) => ipcRenderer.invoke('start-print', photo),
  status: () => ipcRenderer.invoke('print-status'),
});
