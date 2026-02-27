import { useEffect, useState } from 'react';

export const useTimer = (count: number, secCount: number) => {
  const [timerCount, setCount] = useState(count);
  const [timerCountSec, setCountSec] = useState(secCount);
  const [canCancel, setCanCancel] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timerCountSec > 0) {
        setCountSec(timerCountSec - 1);
      }
      if (timerCountSec === 0) {
        if (timerCount === 0) {
          clearInterval(timer);
        } else {
          setCountSec(59);
          setCount(timerCount - 1);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timerCount, timerCountSec]);

  useEffect(() => {
    if (timerCount === 0 && timerCountSec === 0) {
      setCanCancel(false);
    }
  }, [timerCount, timerCountSec]);
  return { timerCount, timerCountSec, canCancel };
};
