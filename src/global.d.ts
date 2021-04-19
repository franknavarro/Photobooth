interface Window {
  photostrip: {
    initialize: () => Promise<boolean>;
  };
  printer: {
    start: (file: string) => Promise<null>;
    status: () => Promise<boolean>;
  };
}
