import confetti from 'canvas-confetti';

export const fireConfetti = (durationMs: number = 1500) => {
  const end = Date.now() + durationMs;
  const defaults = { startVelocity: 25, spread: 100, ticks: 60, zIndex: 9999 } as const;

  const interval = setInterval(() => {
    confetti({ ...defaults, particleCount: 40, origin: { x: 0, y: 0.6 } });
    confetti({ ...defaults, particleCount: 40, origin: { x: 1, y: 0.6 } });
    if (Date.now() > end) {
      clearInterval(interval);
    }
  }, 250);
};

