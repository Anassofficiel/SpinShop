import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  timeRemaining: number;
}

const CountdownTimer = ({ timeRemaining }: CountdownTimerProps) => {
  const [time, setTime] = useState(timeRemaining);

  useEffect(() => {
    setTime(timeRemaining);
  }, [timeRemaining]);

  const hours = Math.floor(time / (1000 * 60 * 60));
  const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((time % (1000 * 60)) / 1000);

  if (time === 0) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent">
      <Clock className="w-4 h-4 text-accent" />
      <span className="font-mono font-bold text-accent">
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

export default CountdownTimer;
