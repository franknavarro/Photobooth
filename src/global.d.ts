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
    start: (printer: string, file: string) => Promise<void>;
    status: () => Promise<boolean>;
  };
  standard: {
    hrtime: NodeJS.HRTime;
  };
  store: Pick<Store, 'store'>;
}
