import {
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  InstancedMesh,
  Object3D,
  Color
} from 'three';

import { ecefToLla } from './ecefToLla';
import {
  convertFromKmToUnit,
  convertKmToM,
  degToRad,
  getPostionOnMap
} from '.';

import objects from '../assets/objects.json';

function generateNewInstance(count) {
  const geometry = new SphereGeometry(0.1, 50, 50);
  const material = new MeshBasicMaterial();
  return new InstancedMesh(geometry, material, count);
}

const plottedPoints = { start: 0, end: 480 };

export function createOrbitalObjects(group, radius) {
  const currentSlice = objects.slice(plottedPoints.start, plottedPoints.end);

  const mesh = generateNewInstance(currentSlice.length);

  const dummy = new Object3D();

  currentSlice.forEach((d, idx) => {
    const { lat, lon, alt } = ecefToLla({
      x: convertKmToM(d.X),
      y: convertKmToM(d.Y),
      z: convertKmToM(d.Z)
    });

    const h = convertFromKmToUnit(radius * 1000 + alt / 1000);

    const [x, y, z] = getPostionOnMap(degToRad(lat), degToRad(lon), radius + h);

    dummy.position.set(x, y, z);
    dummy.updateMatrix();

    mesh.setMatrixAt(idx, dummy.matrix);
    mesh.setColorAt(idx, new Color(d.color_code));
  });

  mesh.userData = {
    start: plottedPoints.start,
    objectId: currentSlice[0]['Object ID']
  };

  group.add(mesh);

  plottedPoints.start = plottedPoints.end;
  plottedPoints.end += 480;

  if (plottedPoints.end <= objects.length) {
    setTimeout(() => {
      requestAnimationFrame(() => createOrbitalObjects(group, radius));
    }, 4);
  }
}
