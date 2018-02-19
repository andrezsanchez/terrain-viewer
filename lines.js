import { Object3D } from './object3d';

export class Lines extends Object3D {
  constructor(gl) {
    super(gl);
    this.arrayType = gl.LINES;
  }
}
