import { Vector3 } from './vector3';
import { Matrix4 } from './matrix4';

export function createLatticeLines(columns, rows, getPosition) {
  const latticeRows = rows;
  const latticeColumns = columns;
  const numBaseLines = 2 * latticeRows * latticeColumns
  const numLines = numBaseLines + latticeRows + latticeColumns;
  const latticeLines = new Float32Array(numLines * 6);

  const center = new Vector3();
  const right = new Vector3();
  const down = new Vector3();
  const position = new Vector3();

  const dimensions = Vector3.fromCoordinates(latticeColumns, latticeRows, 0);
  for (let y = 0; y < latticeRows; y++) {
    for (let x = 0; x < latticeColumns; x++) {
      const index = (y * latticeColumns + x) * 12;

      center.set(x, y, 0);
      getPosition(center, center, dimensions);

      right.set(x + 1, y, 0);
      getPosition(right, right, dimensions);

      down.set(x, y + 1, 0);
      getPosition(down, down, dimensions);

      latticeLines[index] = center.x;
      latticeLines[index + 1] = center.y;
      latticeLines[index + 2] = center.z;

      latticeLines[index + 3] = right.x;
      latticeLines[index + 4] = right.y;
      latticeLines[index + 5] = right.z;

      latticeLines[index + 6] = center.x;
      latticeLines[index + 7] = center.y;
      latticeLines[index + 8] = center.z;

      latticeLines[index + 9] = down.x;
      latticeLines[index + 10] = down.y;
      latticeLines[index + 11] = down.z;
    }
  }

  {
    const startIndex = numBaseLines * 6;
    const x = latticeColumns;
    const start = new Vector3();
    const end = new Vector3();

    for (let y = 0; y < latticeRows; y++) {
      const index = startIndex + y * 6;

      start.set(x, y, 0);
      getPosition(start, start, dimensions);

      end.set(x, y + 1, 0);
      getPosition(end, end, dimensions);

      latticeLines[index] = start.x;
      latticeLines[index + 1] = start.y;
      latticeLines[index + 2] = start.z;

      latticeLines[index + 3] = end.x;
      latticeLines[index + 4] = end.y;
      latticeLines[index + 5] = end.z;
    }
  }

  {
    const startIndex = numBaseLines * 6 + latticeRows * 6;
    const y = latticeRows;
    const start = new Vector3();
    const end = new Vector3();

    for (let x = 0; x < latticeColumns; x++) {
      start.set(x, y, 0);
      getPosition(start, start, dimensions);

      end.set(x + 1, y, 0);
      getPosition(end, end, dimensions);

      const index = startIndex + x * 6;
      latticeLines[index] = start.x;
      latticeLines[index + 1] = start.y;
      latticeLines[index + 2] = start.z;

      latticeLines[index + 3] = end.x;
      latticeLines[index + 4] = end.y;
      latticeLines[index + 5] = end.z;
    }
  }

  return latticeLines;
}
