function rotate(point, d) {
  const angle = d * (Math.PI / 180);
  const newPoint = { x: 0, y: 0 };
  newPoint.x = (point.x * (Math.cos(angle)) - point.y * (Math.sin(angle)));
  newPoint.y = (point.y * (Math.cos(angle)) + point.x * (Math.sin(angle)));
  return newPoint;
}

function getVectorLength(v) {
  return Math.sqrt((v.x * v.x) + (v.y * v.y));
}

function max2(v) {
  const newV = { x: 0, y: 0 };
  if (getVectorLength(v) > 2) {
    newV.x = v.x / (getVectorLength(v) / 2);
    newV.y = v.y / (getVectorLength(v) / 2);
  }
  return newV;
}

export {
  rotate,
  getVectorLength,
  max2,
};
