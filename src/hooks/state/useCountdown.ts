import { useEffect, useState } from 'react';
import useNumber from './useNumber';

export const useCountDown = (initialMinute: number, initialSeconds: number) => {
  const resetedCount = useNumber(0);

  const [timeLeft, setTimeLeft] = useState({
    minutes: initialMinute,
    seconds: initialSeconds,
  });

  useEffect(() => {
    if (!timeLeft.minutes && !timeLeft.seconds) {
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        let updatedMinutes = prevTime.minutes;
        let updatedSeconds = prevTime.seconds - 1;

        if (updatedSeconds < 0) {
          updatedMinutes -= 1;
          updatedSeconds = 59;
        }

        return { minutes: updatedMinutes, seconds: updatedSeconds };
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  useEffect(() => {
    setTimeLeft({ minutes: initialMinute, seconds: initialSeconds });
  }, [initialMinute, initialSeconds, resetedCount.state]);

  const handleReset = () => resetedCount.increment();

  const minutes =
    timeLeft.minutes.toString().length === 1
      ? `0${timeLeft.minutes}`
      : `${timeLeft.minutes}`;
  const seconds =
    timeLeft.seconds.toString().length === 1
      ? `0${timeLeft.seconds}`
      : `${timeLeft.seconds}`;

  return {
    minutes,
    seconds,
    countDown: `${minutes}:${seconds}`,
    setTimeLeft,
    resetTimer: handleReset,
  };
};

export default useCountDown;
