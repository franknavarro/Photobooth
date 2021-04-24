import { useState, useCallback } from 'react';

const useStore = (): [PhotoboothStore, () => void] => {
  const [store, setStore] = useState<PhotoboothStore>(window.store.store);

  const refreshStore = useCallback(() => {
    setStore(window.store.store);
  }, []);

  return [store, refreshStore];
};

export default useStore;
