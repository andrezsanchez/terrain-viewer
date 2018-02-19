import { Object3D } from './object3d';

export class Points extends Object3D {
  constructor(gl) {
    super(gl);
    this.arrayType = gl.POINTS;
  }
}
