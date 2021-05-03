type PhotostripList = import('./Router').PhotostripList;
type PhotoboothStore = import('./store');

type Store = import('electron-store')<PhotoboothStore>;
type CloudSettings = import('@google-cloud/storage').StorageOptions;

type PhotoSizes = {
  full: string;
  small: string;
};

type ImageRatio = {
  width: number;
  height: number;
};

interface Camera {
  initialize(): Promise<void>;
  deleteImg(file: string): Promise<void>;
  getPreview(): Promise<string>;
  takePhoto(): Promise<{ full: string }>;
  takePhoto(index: number): Promise<PhotoSizes>;
}

interface Window {
  camera: Camera;
  cloud: {
    getBuckets: (settings: CloudSettings) => Promise<string[]>;
    uploadPhotos: (
      settings: PhotoboothStore['cloud'],
      files: PhotoSizes[],
      ratio: ImageRatio,
    ) => void;
  };
  photostrip: {
    initialize: (
      settings: PhotoboothStore['photostrip'],
    ) => Promise<ImageRatio>;
    createStrips: () => Promise<PhotostripList>;
    sampleStrip: (image: string) => Promise<string>;
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
