type PhotostripList = import('./Router').PhotostripList;
type PhotoboothStore = import('./store');

type Store = import('electron-store')<PhotoboothStore>;

type PhotoSizes = {
  full: string;
  small: string;
};

type ImageRatio = {
  width: number;
  height: number;
};

type AsyncReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

interface Camera {
  initialize(): Promise<void>;
  deleteImg(file: string): Promise<void>;
  getPreview(): Promise<string>;
  takePhoto(): Promise<{ full: string }>;
  takePhoto(index: number): Promise<PhotoSizes>;
}

type EventInfo = {
  displayName: string;
  uid: string;
  eventId: string;
};

interface Window {
  camera: Camera;
  cloud: {
    bucketExists: (certPath: string, bucketName: string) => Promise<boolean>;
    createEvent: (
      settings: Pick<PhotoboothStore['cloud'], 'certPath' | 'domain'>,
      id: string,
      name: string,
      password: string,
    ) => Promise<EventInfo>;
    deleteEvent: (
      certPath: string,
      uid: string,
      eventId: string,
    ) => Promise<void>;
    getEvents: (certPath: string) => Promise<EventInfo[]>;
    updateEvent: (
      settings: Pick<PhotoboothStore['cloud'], 'certPath' | 'domain'>,
      uid: string,
      fields: { id?: string; name?: string; password?: string },
    ) => Promise<EventInfo>;
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
