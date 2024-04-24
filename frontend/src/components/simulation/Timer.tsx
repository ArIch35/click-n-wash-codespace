import React from 'react';
import { RingProgress, Stack, Text } from '@mantine/core';

interface TimerProps {
  label: string;
  startTime: Date;
  endTime: Date;
  callbackFinish: () => void;
}

const Timer: React.FC<TimerProps> = ({ label, startTime, endTime, callbackFinish }) => {
  const [hour, setHour] = React.useState<number>(0);
  const [minute, setMinute] = React.useState<number>(0);
  const [second, setSecond] = React.useState<number>(0);
  const [progress, setProgress] = React.useState<number>(0);

  React.useEffect(() => {
    const totalDuration = endTime.getTime() - startTime.getTime();

    const interval = setInterval(() => {
      const now = new Date();
      calculateProgress(now);
      calculateTime(now);
    }, 1000);

    const calculateProgress = (now: Date) => {
      const elapsedTime = now.getTime() - startTime.getTime();
      const diffProgress = (elapsedTime / totalDuration) * 100;

      setProgress(diffProgress);
    };

    const calculateTime = (now: Date) => {
      const diff = endTime.getTime() - now.getTime();
      const diffSeconds = Math.floor(diff / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);

      setHour(diffHours);
      setMinute(diffMinutes % 60);
      setSecond(diffSeconds % 60);
    };

    if (progress >= 100) {
      clearInterval(interval);
      callbackFinish();
    }

    return () => clearInterval(interval);
  }, [second, progress, startTime, endTime, callbackFinish]);

  const getColor = () => {
    if (progress < 50) {
      return 'blue';
    }
    if (progress < 75) {
      return 'orange';
    }
    return 'red';
  };

  return (
    <RingProgress
      size={170}
      sections={[{ value: progress, color: getColor() }]}
      label={
        <Stack>
          <Text c={getColor()} fw={400} ta="center" size="lg">
            {label}
          </Text>
          <Text c={getColor()} fw={700} ta="center" size="xl">
            {`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second
              .toString()
              .padStart(2, '0')}`}
          </Text>
        </Stack>
      }
    />
  );
};

export default Timer;
