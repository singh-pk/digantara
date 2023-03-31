export function animate(fn) {
  return fn(requestAnimationFrame(() => animate(fn)));
}

export function getPostionOnMap(latitude, longitude, radius) {
  const x = radius * Math.cos(latitude) * Math.sin(longitude);
  const y = radius * Math.sin(latitude);
  const z = radius * Math.cos(latitude) * Math.cos(longitude);

  return [x, y, z];
}

export function degToRad(degree) {
  return (degree / 180) * Math.PI;
}

export function convertFromKmToUnit(km) {
  return km / 1000;
}

export function convertKmToM(km) {
  return km * 1000;
}
