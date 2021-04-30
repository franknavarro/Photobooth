import { useState, useEffect, Dispatch, SetStateAction } from 'react';

type CountDownReturn = [number, Dispatch<SetStateAction<number>>];

const useCountDown = (start = 6): CountDownReturn => {
  const [count, setCount] = useState<number>(start);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (count > 0) {
      timeout = setTimeout(() => setCount(count - 1), 1000);
    }
    return () => clearTimeout(timeout);
  }, [count]);

  return [count, setCount];
};

export default useCountDown;
