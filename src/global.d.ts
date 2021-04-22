type PhotostripList = import('./Router').PhotostripList;

interface Window {
  camera: {
    initialize: () => Promise<void>;
    deleteImg: (file: string) => Promise<void>;
    getPreview: () => Promise<string>;
    takePhoto: (index: number) => Promise<string>;
  };
  photostrip: {
    initialize: () => Promise<void>;
    createStrips: () => Promise<PhotostripList>;
  };
  printer: {
    start: (file: string) => Promise<void>;
    status: () => Promise<boolean>;
  };
  standard: {
    hrtime: NodeJS.HRTime;
  };
}
