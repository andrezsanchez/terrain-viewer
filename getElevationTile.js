import { Vector3 } from './vector3';
import { loadImage } from './loadImage';

const token = 'pk.eyJ1IjoiYW5kcmV6c2FuY2hleiIsImEiOiJjajRzdTYzc3cwMWhjMndwMHFxb3Q2N3R5In0.zIr605z5UJEPehehu5HVYw';

function getUrl(coordinates) {
  return `https://api.mapbox.com/v4/mapbox.terrain-rgb/${coordinates.z}/${coordinates.x}/${coordinates.y}.pngraw?access_token=${token}`;
}

export class WebMercatorTile {
  constructor(imageData, coordinates) {
    this.coordinates = coordinates;
    this.imageData = imageData;
  }
}

export function getElevationTile(x, y, z) {
  const coordinates = Vector3.fromCoordinates(x, y, z);
  return loadImage(getUrl(coordinates)).then(imageData => {
    return new WebMercatorTile(imageData, coordinates);
  });
}
