import {
  BufferAttribute,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  Scene,
  WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { GUI } from 'dat.gui';

import { animate } from './utils';

const gui = new GUI();
const planeKeys = [
  { id: 'width', min: 1, start: 400, max: 500 },
  { id: 'height', min: 1, start: 400, max: 500 },
  { id: 'widthSegments', min: 1, start: 50, max: 100 },
  { id: 'heightSegments', min: 1, start: 50, max: 100 }
];
const world = {
  plane: planeKeys.reduce((acc, curr) => {
    acc[curr.id] = curr.start;
    return acc;
  }, {})
};

planeKeys.forEach(d => {
  gui.add(world.plane, d.id, d.min, d.max).onChange(generatePlane);
});

function generatePlane() {
  plane.geometry.dispose();
  plane.geometry = new PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );

  const planeArray = plane.geometry.attributes.position.array;
  const planeArrayLen = planeArray.length;

  const randomValues = [];

  for (let i = 0; i < planeArrayLen; i += 3) {
    planeArray[i] += (Math.random() - 0.5) * 3;
    planeArray[i + 1] += (Math.random() - 0.5) * 3;
    planeArray[i + 2] += (Math.random() - 0.5) * 3;

    randomValues.push(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );
  }

  plane.geometry.attributes.position.originalPosition = planeArray;
  plane.geometry.attributes.position.randomValues = randomValues;

  const colors = [];
  const planeAttributeCount = plane.geometry.attributes.position.count;

  for (let i = 0; i < planeAttributeCount; i++) {
    colors.push(0, 0.19, 0.4);
  }

  plane.geometry.setAttribute(
    'color',
    new BufferAttribute(new Float32Array(colors), 3)
  );
}

const scene = new Scene();
const camera = new PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new WebGLRenderer();
const raycaster = new Raycaster();

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

camera.position.z = 50;

const planeGeometry = new PlaneGeometry(19, 19, 17, 17);
const planeMaterial = new MeshPhongMaterial({
  side: DoubleSide,
  flatShading: true,
  vertexColors: true
});
const plane = new Mesh(planeGeometry, planeMaterial);

generatePlane();

scene.add(plane);

const light = new DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1);

const backLight = new DirectionalLight(0xffffff, 1);
backLight.position.set(0, -1, -1);

scene.add(light);
scene.add(backLight);

const mouse = { x: undefined, y: undefined };
let frame = 0;

animate(() => {
  renderer.render(scene, camera);

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(plane);
  frame += 0.01;

  const { position } = plane.geometry.attributes;
  const { array, originalPosition, randomValues } = position;
  const planeArrayLen = array.length;

  for (let i = 0; i < planeArrayLen; i += 3) {
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.01;
    array[i + 1] =
      originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.03;
  }

  position.needsUpdate = true;

  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes;
    const { a, b, c } = intersects[0].face;

    color.needsUpdate = true;

    const initialColor = { r: 0, g: 0.19, b: 0.4 };
    const hoverColor = { r: 0.1, g: 0.5, b: 1 };

    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      duration: 1,
      onUpdate: () => {
        color.setX(a, hoverColor.r);
        color.setY(a, hoverColor.g);
        color.setZ(a, hoverColor.b);

        color.setX(b, hoverColor.r);
        color.setY(b, hoverColor.g);
        color.setZ(b, hoverColor.b);

        color.setX(c, hoverColor.r);
        color.setY(c, hoverColor.g);
        color.setZ(c, hoverColor.b);
      }
    });
  }
});

addEventListener('mousemove', event => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});
