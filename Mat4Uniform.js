import invariant from 'invariant';
import { Revisable } from './revisable';

export class Mat4Uniform extends Revisable {
  constructor(name, mat4) {
    super();
    this.name = name;
    this.data = mat4;
    //this.location = null;

    //this.needsUpload = true;
    //this.revision = Symbol();
  }
  initializeLocation(shader) {
    //this.location = this.gl.getUniformLocation(shader, this.name);
  }
  //markRevision() {
    //this.revision = Symbol();
    //this.needsUpload = true;
  //}
  //applyValue() {
    //invariant(this.location !== null, 'applyValue called before uniform location was initialized');
    //this.gl.uniformMatrix4fv(this.location, false, this.data.buffer);
    //this.needsUpload = false;
  //}
}
