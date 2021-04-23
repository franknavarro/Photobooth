import { useRef } from 'react';
const useStore = () => {
  const store = useRef(window.store.store);
  return store.current;
};

export default useStore;
