interface PhotostripStore {
  cloud: {
    bucketName: string;
    certPath: string;
    eventUID: string;
  };
  photostrip: {
    borders: {
      horizontal: number;
      vertical: number;
    };
    photoSize: 'evenly' | '3x2';
    maxPhotos: number;
    logoPosition: 'none' | 'top' | 'bottom';
    stripImage: string;
    stripSize: {
      height: 6;
      width: 2 | 4;
    };
  };
  interface: {
    countTime: number;
    initialCount: number;
    photoPreview: 'none' | 'top' | 'bottom' | 'left' | 'right';
    primaryColor: string;
    secondaryColor: string;
    waitTime: number;
  };
  printer: {
    printerName: string;
  };
}

export = PhotostripStore;
