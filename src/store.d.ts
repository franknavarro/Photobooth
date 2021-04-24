interface PhotostripStore {
  photostrip: {
    borders: {
      horizontal: number;
      vertical: number;
    };
    maxPhotos: number;
    stripImage: string;
    stripSize: {
      height: 6;
      width: 2 | 4;
    };
  };
  interface: {
    initialCount: number;
    countTime: number;
    waitTime: number;
  };
  printer: {
    printerName: string;
  };
}

export = PhotostripStore;
