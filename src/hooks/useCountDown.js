import { useState, useEffect, useCallback } from 'react';

const useCountDown = (start = 6) => {
  const [count, setCount] = useState(start);

  const resetCount = useCallback((newStart) => {
    setCount(newStart);
  }, []);

  useEffect(() => {
    let timeout;
    if (count > 0) {
      timeout = setTimeout(() => setCount(count - 1), 1000);
    }
    return () => clearTimeout(timeout);
  }, [count]);

  return [count, resetCount];
};

export default useCountDown;
