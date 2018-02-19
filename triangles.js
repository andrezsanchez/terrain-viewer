import { Object3D } from './object3d';

export class Triangles extends Object3D {
  constructor() {
    super();
    this.arrayType = gl.TRIANGLES;
  }
}
