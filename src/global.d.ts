type PhotostripList = import('./Router').PhotostripList;
type PhotoboothStore = import('./store');

type Store = import('electron-store')<PhotoboothStore>;

interface Window {
  camera: {
    initialize: () => Promise<void>;
    deleteImg: (file: string) => Promise<void>;
    getPreview: () => Promise<string>;
    takePhoto: (index: number) => Promise<string>;
  };
  photostrip: {
    initialize: (
      stripImage: PhotoboothStore['photostrip']['stripImage'],
      borderSize: PhotoboothStore['photostrip']['borders'],
      stripSize: PhotoboothStore['photostrip']['stripSize'],
    ) => Promise<void>;
    createStrips: () => Promise<PhotostripList>;
  };
  printer: {
    start: (
      printer: PhotoboothStore['printer']['printerName'],
      file: string,
    ) => Promise<void>;
    status: () => Promise<boolean>;
    list: () => Promise<string[]>;
  };
  standard: {
    hrtime: NodeJS.HRTime;
  };
  store: {
    set: Store['set'];
    store: () => Store['store'];
  };
}
