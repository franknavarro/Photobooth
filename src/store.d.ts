interface MyStore {
  photostrip: {
    maxPhotos: number;
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

export = MyStore;
