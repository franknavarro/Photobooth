interface PhotostripStore {
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
    primaryColor: string;
    secondaryColor: string;
    initialCount: number;
    countTime: number;
    waitTime: number;
  };
  printer: {
    printerName: string;
  };
}

export = PhotostripStore;
