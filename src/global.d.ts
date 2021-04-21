interface Window {
  camera: {
    initialize: () => Promise<void>;
    deleteImg: (file: string) => Promise<void>;
    getPreview: () => Promise<string>;
    takePhoto: (index: number) => Promise<string>;
  };
  photostrip: {
    initialize: () => Promise<void>;
    createStrips: () => Promise<boolean>;
  };
  printer: {
    start: (file: string) => Promise<void>;
    status: () => Promise<boolean>;
  };
  standard: {
    hrtime: NodeJS.HRTime;
  };
}
