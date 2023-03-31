const a = 6378137;
const b = 6356752.3142;
const pi = Math.PI;

export function ecefToLla(ecef) {
  const { x, y, z } = ecef;

  const x2 = x * x;
  const y2 = y * y;
  const z2 = z * z;
  const e = Math.sqrt(1 - (b / a) ** 2);
  const b2 = b * b;
  const e2 = e * e;
  const ep = e * (a / b);
  const r = Math.sqrt(x2 + y2);
  const r2 = r * r;
  const E2 = a ** 2 - b ** 2;
  const F = 54 * b2 * z2;
  const G = r2 + (1 - e2) * z2 - e2 * E2;
  const c = (e2 * e2 * F * r2) / (G * G * G);
  const s = (1 + c + Math.sqrt(c * c + 2 * c)) ** (1 / 3);
  const P = F / (3 * (s + 1 / s + 1) ** 2 * G * G);
  const Q = Math.sqrt(1 + 2 * e2 * e2 * P);
  const ro =
    -(P * e2 * r) / (1 + Q) +
    Math.sqrt(
      ((a * a) / 2) * (1 + 1 / Q) -
        (P * (1 - e2) * z2) / (Q * (1 + Q)) -
        (P * r2) / 2
    );
  const tmp = (r - e2 * ro) ** 2;
  const U = Math.sqrt(tmp + z2);
  const V = Math.sqrt(tmp + (1 - e2) * z2);
  const zo = (b2 * z) / (a * V);

  const height = U * (1 - b2 / (a * V));

  const lat = Math.atan((z + ep * ep * zo) / r);
  const temp = Math.atan(y / x);

  let long;

  if (x >= 0) {
    long = temp;
  } else if (x < 0 && y >= 0) {
    long = pi + temp;
  } else {
    long = temp - pi;
  }

  const lat0 = lat / (pi / 180);
  const lon0 = long / (pi / 180);
  const alt0 = height;

  return { lon: lon0, lat: lat0, alt: alt0 };
}
