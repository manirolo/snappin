import { useEffect, useRef, useState } from "react";

export const useProgressPending = () => {
  const [progress, setProgress] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => clearTimeout(timeoutRef.current!), []);

  const tick = (current: number, setter: (v: number) => void) => {
    // Slow down as we approach 90
    const remaining = 90 - current;
    if (remaining <= 0) return;

    const increment = Math.random() * Math.min(remaining * 0.3, 8) + 0.5; // 0.5–8% bite
    const delay = Math.random() * 600 + 200; // 200–800ms pause between ticks

    timeoutRef.current = setTimeout(() => {
      const next = Math.round(Math.min(current + increment, 90));
      setter(next);
      tick(next, setter); // schedule next tick
    }, delay);
  };

  const start = () => {
    clearTimeout(timeoutRef.current!);
    setProgress(0);
    setIsPending(true);
    tick(0, setProgress);
  };

  const finish = (onDone?: () => void) => {
    clearTimeout(timeoutRef.current!);
    setProgress(100);
    setTimeout(() => {
      setIsPending(false);
      setProgress(0);
      onDone?.();
    }, 2000);
  };

  const reset = () => {
    clearTimeout(timeoutRef.current!);
    setIsPending(false);
    setProgress(0);
  };

  return { progress, isPending, start, finish, reset };
};
