import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestTimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
  isPaused?: boolean;
}

const TestTimer = ({ initialTime, onTimeUp, isPaused = false }: TestTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUp, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = (timeLeft / initialTime) * 100;
  const isLow = percentage < 20;

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-lg font-semibold transition-colors',
        isLow ? 'bg-destructive/10 text-destructive animate-pulse' : 'bg-primary/10 text-primary'
      )}
    >
      <Clock className="h-5 w-5" />
      {formatTime(timeLeft)}
    </div>
  );
};

export default TestTimer;
