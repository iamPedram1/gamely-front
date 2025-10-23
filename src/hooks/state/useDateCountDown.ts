import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const useDateCountDown = (isoString: string) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      const targetDate = dayjs(isoString);
      const diff = targetDate.diff(now);

      if (diff < 0) {
        // Countdown has ended
        setTimeLeft("Time's up!");
        clearInterval(interval);
      } else {
        // Update the time left
        setTimeLeft(dayjs.duration(diff).format('HH:mm:ss'));
      }
    }, 1000);

    // Cleanup the interval on unmount
    return () => clearInterval(interval);
  }, [isoString]);

  return timeLeft;
};

export default useDateCountDown;
