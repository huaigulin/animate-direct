/**
 * Check if a point (a, b) is within an ellipse centered at (x, y) with radii rx and ry
 * @param {number} x
 * @param {number} y
 * @param {number} rx
 * @param {number} ry
 * @param {number} a
 * @param {number} b
 * @returns > 1 if outside, == 1 if on, < 1 if inside the ellipse
 */
function ellipseCheck(x, y, rx, ry, a, b) {
  const p =
    parseInt(Math.pow(a - x, 2)) / parseInt(Math.pow(rx, 2)) +
    parseInt(Math.pow(b - y, 2)) / parseInt(Math.pow(ry, 2));
  return p;
}

export { ellipseCheck };
