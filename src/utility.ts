export const orderOfMagnitude = (started: number, finished: number): number => {
  const diff = finished - started;
  if (diff <= 0) {
    return 0;
  }

  return `${diff}`.length;
};
