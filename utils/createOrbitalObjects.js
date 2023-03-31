import { Mesh, MeshBasicMaterial, SphereGeometry } from 'three';

import { ecefToLla } from './ecefToLla';
import {
  convertFromKmToUnit,
  convertKmToM,
  degToRad,
  getPostionOnMap
} from '.';

import objects from '../assets/objects.json';

function generateNewBox(color_code) {
  const boxGeometry = new SphereGeometry(0.1, 50, 50);
  const boxMaterial = new MeshBasicMaterial({ color: color_code });
  return new Mesh(boxGeometry, boxMaterial);
}

const plottedPoints = { start: 0, end: 100 };

export function createOrbitalObjects(group, radius) {
  objects.slice(plottedPoints.start, plottedPoints.end).forEach(d => {
    const box = generateNewBox(d.color_code);

    const { lat, lon, alt } = ecefToLla({
      x: convertKmToM(d.X),
      y: convertKmToM(d.Y),
      z: convertKmToM(d.Z)
    });

    const h = convertFromKmToUnit(radius * 1000 + alt / 1000);

    const [x, y, z] = getPostionOnMap(degToRad(lat), degToRad(lon), radius + h);

    box.position.set(x, y, z);

    box.lookAt(0, 0, 0);

    box.objectId = d['Object ID'];
    box.time = d['Time (UTC)'];

    group.add(box);
  });

  plottedPoints.start = plottedPoints.end;
  plottedPoints.end += 100;

  if (plottedPoints.end <= objects.length) {
    setTimeout(() => {
      requestAnimationFrame(() => createOrbitalObjects(group, radius));
    }, 4);
  }
}
