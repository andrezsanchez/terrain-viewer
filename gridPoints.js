import { Vector3 } from './vector3';
import { Matrix4 } from './matrix4';

export function createGridPoints(columns, rows, getPosition) {
  const numPoints = rows * columns;
  const points = new Float32Array(numPoints * 3);

  const position = new Vector3();

  const dimensions = Vector3.fromCoordinates(columns, rows, 0);
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      const index = (y * columns + x) * 3;

      position.set(x, y, 0);
      getPosition(position, position, dimensions);

      points[index] = position.x;
      points[index + 1] = position.y;
      points[index + 2] = position.z;
    }
  }

  return points;
}
