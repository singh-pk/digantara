const popUpEl = document.getElementById('popUp');
const objectIdEl = document.getElementById('objectId');
const timeEl = document.getElementById('time');

function convertNumToPx(num) {
  return num + 'px';
}

export function setPopUp(objectId, time, { offsetX, offsetY }) {
  objectIdEl.innerHTML = objectId;
  timeEl.innerHTML = time;
  popUpEl.style.left = convertNumToPx(offsetX);
  popUpEl.style.top = convertNumToPx(offsetY);
  popUpEl.style.display = 'block';
}

export function removePop() {
  popUpEl.style.display = 'none';
}
