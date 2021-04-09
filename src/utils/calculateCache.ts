export enum Interval {
  SMALL = 15,
  MEDIUM = 30,
  LARGE = 60,
}

export const calculateCache = (interval: Interval = Interval.LARGE) => {
  const currentDateTime = new Date();
  const seconds = currentDateTime.getSeconds();
  const minutes = currentDateTime.getMinutes();
  const secondsTo = 60 - seconds;
  let minutesTo = (secondsTo === 0 ? 60 : 59) - minutes;
  if (interval === Interval.SMALL) {
    if (minutes < 15) {
      minutesTo = (secondsTo === 0 ? 15 : 14) - minutes;
    }
    if (minutes < 30) {
      minutesTo = (secondsTo === 0 ? 30 : 29) - minutes;
    }
    if (minutes < 45) {
      minutesTo = (secondsTo === 0 ? 45 : 44) - minutes;
    }
  }
  if (interval === Interval.MEDIUM) {
    if (minutes < 30) {
      minutesTo = (secondsTo === 0 ? 30 : 29) - minutes;
    }
  }
  return `${minutesTo * 60 + secondsTo} seconds`;
};
