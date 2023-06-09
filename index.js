import './index.css';

import {
  Group,
  InstancedMesh,
  Mesh,
  PerspectiveCamera,
  Raycaster,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  TextureLoader,
  WebGLRenderer
} from 'three';
import gsap from 'gsap';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

import { animate, convertFromKmToUnit, degToRad } from './utils';
import { createOrbitalObjects } from './utils/createOrbitalObjects';
import { removePop, setPopUp } from './utils/popUp';

const RADIUS_EARTH = convertFromKmToUnit(6378.1);

const scene = new Scene();
const camera = new PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new WebGLRenderer({ antialias: true });

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

const canvas = document.body.appendChild(renderer.domElement);

const globeGeometry = new SphereGeometry(RADIUS_EARTH, 50, 50);
const globeMaterial = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    globeTexture: {
      value: new TextureLoader().load('./assets/images/globe.jpeg')
    }
  }
});
const globe = new Mesh(globeGeometry, globeMaterial);

const group = new Group();
group.add(globe);
scene.add(group);

globe.rotateY(-degToRad(90));

camera.position.z = 25;

const mouse = {
  x: undefined,
  y: undefined,
  isMouseDown: false,
  isHovering: false,
  dX: 0,
  dY: 0
};
const rotation = { x: 0, y: 0 };

function onMouseMove(event) {
  mouse.x = (event.offsetX / innerWidth) * 2 - 1;
  mouse.y = -(event.offsetY / innerHeight) * 2 + 1;
  mouse.offsetX = event.offsetX;
  mouse.offsetY = event.offsetY;

  if (mouse.isMouseDown) {
    event.preventDefault();

    const dX = event.offsetX - mouse.dX;
    const dY = event.offsetY - mouse.dY;

    rotation.x += dY * 0.005;
    rotation.y += dX * 0.005;

    gsap.to(group.rotation, {
      x: rotation.x,
      y: rotation.y,
      duration: 1
    });

    mouse.dX = event.offsetX;
    mouse.dY = event.offsetY;
  }
}

function onMouseDown(event) {
  mouse.isMouseDown = true;
  mouse.dX = event.offsetX;
  mouse.dY = event.offsetY;
}

function onMouseUp() {
  mouse.isMouseDown = false;
}

function onResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}

function getGroupChildren(fn) {
  return fn ? group.children.filter(fn) : group.children;
}

function onLoad() {
  const raycaster = new Raycaster();

  animate(() => {
    renderer.render(scene, camera);

    if (mouse.x) {
      removePop();
      mouse.isHovering = false;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(
        getGroupChildren(d => d.visible)
      );
      const intersectsLen = intersects.length;

      for (let i = 0; i < intersectsLen; i++) {
        const { object, instanceId } = intersects[i];

        if (!(object instanceof InstancedMesh)) {
          break;
        }

        const { start } = object.userData;

        mouse.isHovering = true;
        setPopUp(start + instanceId, mouse);
      }
    }

    if (!mouse.isMouseDown && !mouse.isHovering) {
      group.rotation.y += 0.002;
    }
  });

  setTimeout(() => createOrbitalObjects(group, RADIUS_EARTH), 16);
}

const input = document.getElementById('search');

function onChange({ target: { value } }) {
  for (const mesh of getGroupChildren(d => d instanceof InstancedMesh)) {
    if (value.length && mesh.userData.objectId !== Number(value)) {
      mesh.visible = false;
    } else if (!mesh.visible) {
      mesh.visible = true;
    }
  }
}

const eventListeners = [
  { elem: canvas, type: 'mousemove', listener: onMouseMove },
  { elem: canvas, type: 'mousedown', listener: onMouseDown },
  { elem: window, type: 'mouseup', listener: onMouseUp },
  { elem: window, type: 'resize', listener: onResize },
  { elem: window, type: 'load', listener: onLoad },
  { elem: input, type: 'input', listener: onChange }
];

eventListeners.forEach(({ elem, type, listener }) => {
  elem.addEventListener(type, listener);
});
