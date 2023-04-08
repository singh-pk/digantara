const format = {
  year: 31536000,
  month: 2592000,
  week: 604800,
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1
};

export function dateDiff(date) {
  let diff = (Date.now() - new Date(date).getTime()) / 1000;

  const resultantArr = [];

  Object.keys(format).forEach(key => {
    const value = Math.floor(diff / format[key]);

    if (value) {
      resultantArr.push(`${value} ${key}`);
      diff -= value * format[key];
    }
  });

  return resultantArr.join(', ');
}
