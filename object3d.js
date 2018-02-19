import invariant from 'invariant';
import { Matrix4 } from './matrix4';
import { Mat4Uniform } from './Mat4Uniform';
import { Revisable } from './revisable';

export class Object3D extends Revisable {
  constructor(gl) {
    super();
    this.gl = gl;
    this.model = new Matrix4();
    this.model.setIdentity();
    this.modelUniform = new Mat4Uniform('model', this.model);
    this.shader = null;
    this.arrayType = null;
    this.buffer = null
    this.data = null;

    this.vao = this.gl.createVertexArray();

    this.modelUniform.observe(() => {
      this.revise();
    });
  }
  setup() {
    invariant(this.shader, 'Object must have shader defined');

    this.gl.bindVertexArray(this.vao);

    this.positionAttribute = this.gl.getAttribLocation(this.shader.program, 'position');
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);

    this.gl.enableVertexAttribArray(this.positionAttribute);
    this.gl.vertexAttribPointer(this.positionAttribute, 3, this.gl.FLOAT, false, 0, 0);

    this.gl.bindVertexArray(null);
  }
  render() {
    this.gl.useProgram(this.shader.program);
    //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bindVertexArray(this.vao);

    this.gl.drawArrays(this.arrayType, 0, this.data.length / 3);

    this.gl.bindVertexArray(null);
  }
}
