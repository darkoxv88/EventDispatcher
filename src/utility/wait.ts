export function wait(duration: number): Promise<void> {
  duration = (typeof(duration) === 'number') ? duration : 0;
  duration = (duration >= 0) ? duration : 0;

  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, duration);
  });
}
