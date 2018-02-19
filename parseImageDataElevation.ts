import invariant from 'invariant';

export function parseImageDataElevation(imageData:ImageData, x:number, y:number):number {
  invariant(x >= 0 && x < imageData.width, 'x out of bounds');
  invariant(y >= 0 && y < imageData.height, 'y out of bounds');

  const index = y * imageData.width * 4 + x * 4;
  const r = imageData.data[index];
  const g = imageData.data[index + 1];
  const b = imageData.data[index + 2];
  return -10000 + ((r * 256 * 256 + g * 256 + b) * 0.1);
}
