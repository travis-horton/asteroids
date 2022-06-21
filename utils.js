function vLength(v) {
  return Math.sqrt((v.x * v.x) + (v.y * v.y));
}

function max2(v) {
  const newV = { x: 0, y: 0 };
  if (vLength(v) > 2) {
    newV.x = v.x / (vLength(v) / 2);
    newV.y = v.y / (vLength(v) / 2);
  }
  return newV;
}

export {
  vLength,
  max2,
};
