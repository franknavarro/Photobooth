import { useState, useEffect, useCallback } from 'react';

type ResetCount = (start: number) => void;

const useCountDown = (start = 6): [number, ResetCount] => {
  const [count, setCount] = useState<number>(start);

  const resetCount = useCallback<ResetCount>((newStart) => {
    setCount(newStart);
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (count > 0) {
      timeout = setTimeout(() => setCount(count - 1), 1000);
    }
    return () => clearTimeout(timeout);
  }, [count]);

  return [count, resetCount];
};

export default useCountDown;
