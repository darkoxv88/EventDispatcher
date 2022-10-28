export function wait(duration: number): Promise<void> {
  return new Promise((res) => {
    setTimeout(
      () => res(), 
      (typeof(duration) === 'number') ? duration : 0
    );
  });
}
