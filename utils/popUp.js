import { dateDiff } from './dateDiff';

import objects from '../assets/objects.json';

const popUpEl = document.getElementById('popUp');
const objectIdEl = document.getElementById('objectId');
const timeEl = document.getElementById('time');

function convertNumToPx(num) {
  return num + 'px';
}

export function setPopUp(index, { offsetX, offsetY }) {
  const object = objects[index];

  objectIdEl.innerHTML = object['Object ID'];
  timeEl.innerHTML = dateDiff(object['Time (UTC)']);

  popUpEl.style.left = convertNumToPx(offsetX);
  popUpEl.style.top = convertNumToPx(offsetY);
  popUpEl.style.display = 'block';
}

export function removePop() {
  popUpEl.style.display = 'none';
}
