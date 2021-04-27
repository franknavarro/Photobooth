import { useRef } from 'react';

const useStore = (): PhotoboothStore => {
  const store = useRef<PhotoboothStore>(window.store.store());

  return store.current;
};

export default useStore;
