import invariant from 'invariant';
import { Screen } from './screen';
import { Vector3 } from './Vector3';
import { Vector4 } from './Vector4';
import { Matrix4 } from './Matrix4';
import { Mat4Uniform } from './Mat4Uniform';
import { cubeLines } from './cubeLines';
import { createLatticeLines } from './latticeLines';
import { createGridPoints } from './gridPoints';
import { Lines } from './lines';
import { Points } from './points';
import { Camera } from './camera';
import { InputManager } from './InputManager';
import { handleCameraInput } from './handleCameraInput';
import { getElevationTile } from './getElevationTile';
import { Revisable } from './revisable';
import { parseImageDataElevation } from './parseImageDataElevation';
import {
  createFragmentShader,
  createVertexShader,
  createProgram
} from './shader';

import shaderFrag from './shader.frag.glsl';
import shaderVert from './shader.vert.glsl';

const containerElement = document.getElementsByClassName('container')[0];

const screen = new Screen(containerElement);
const gl = screen.gl;

class Shader extends Revisable {
  constructor(program) {
    super();
    this.program = program;
    this.objects = new Set();
  }
  addObject(object) {
    this.objects.add(object);
    this.revise();
  }
}

const fragmentShader = createFragmentShader(gl, shaderFrag);
const vertexShader = createVertexShader(gl, shaderVert);
const shaderProgram = createProgram(gl, vertexShader, fragmentShader);
const shader = new Shader(shaderProgram);

const viewUniform = new Mat4Uniform('view', new Matrix4());
viewUniform.data.setIdentity();
viewUniform.data.setPosition(new Vector3().set(0, 0, -10));

const camera = new Camera();
camera.updatePose();
viewUniform.data.copy(camera.poseInverse);

const inputManager = new InputManager();
inputManager.listen();

const uploadBuffer = new Float32Array(16);
function upload(uniform, shader) {
  const location = gl.getUniformLocation(shader, uniform.name);
  uploadBuffer.set(uniform.data.buffer);
  gl.uniformMatrix4fv(location, false, uploadBuffer);
}

// associated with an object
// associated with many uniforms
class ShaderManager extends Revisable {
  constructor() {
    super();
    this.uniforms = new Set();
  }
  add(uniform) {
    this.uniforms.add(uniform);
    this.revise();

    uniform.observe(() => this.revise());
  }
}

const shaderManager = new ShaderManager();
shaderManager.add(viewUniform);

function updateProjectionMatrix(mat4, tanRatio, pixelRatio, screenWidth, screenHeight) {
  const halfWidth = tanRatio * screenWidth / (2 * pixelRatio);
  const halfHeight = tanRatio * screenHeight / (2 * pixelRatio);

  mat4.setPerspective(-halfWidth, halfWidth, halfHeight, -halfHeight, 0.5, 10000);
}

class Scene extends Revisable {
  constructor() {
    super();
    this.camera = null;
    this.uniforms = [];
    this.objects = new Set();
    this.shaders = new Map();
    this.screen = null;
    this.projectionUniform = new Mat4Uniform('projection', new Matrix4());
    this.tanRatio = Math.PI / (2 * 1440);
    this.clearColor = new Vector4().set(0, 0, 0, 1);
    this.clearFlags = gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT;
  }
  updateProjectionMatrix() {
    updateProjectionMatrix(
      this.projectionUniform.data,
      this.tanRatio,
      window.devicePixelRatio,
      this.screen.width,
      this.screen.height
    );
    this.revise();
  }
  setScreen(screen) {
    this.screen = screen;
    this.updateProjectionMatrix();
    this.screen.observe(() => this.updateProjectionMatrix());
  }
  setCamera(camera) {
    this.camera = camera;
    this.camera.observe(() => this.revise());
    this.revise();
  }
  addObject(object) {
    this.objects.add(object);
    const shaderCount = this.shaders.get(object.shader) || 0;
    this.shaders.set(object.shader, shaderCount + 1)
    object.observe(() => {
      this.revise();
    });
    this.revise();
  }
  removeObject(object) {
    this.objects.delete(object);
    const shaderCount = (this.shaders.get(object.shader) || 0) - 1;
    this.shaders.set(object.shader, shaderCount);
    if (shaderCount <= 0) {
      this.shaders.delete(object.shader);
    }
    this.revise();
  }
  render() {
    gl.clearColor(this.clearColor.x, this.clearColor.y, this.clearColor.z, this.clearColor.w);
    gl.clear(this.clearFlags);

    this.shaders.forEach((count, shader) => {
      gl.useProgram(shader.program);
      upload(viewUniform, shader.program);
      upload(this.projectionUniform, shader.program);

      shader.objects.forEach(object => {
        upload(object.modelUniform, shader.program);
        object.render();
      });
    });

    const err = gl.getError();
    if (err) {
      throw new Error(err);
    }
  }
}

const scene = new Scene();
scene.setCamera(camera);
scene.setScreen(screen)

function render() {
  scene.render();
}

let previousTime = performance.now();

function handleInput(delta) {
  handleCameraInput(delta, inputManager, camera, viewUniform);
}

const inverseMap = new WeakMap();
function inverse(mat4) {
  cache = inverseMap.get(mat4);
  if (!cache) {
    cache = new Matrix4();
    inverseMap.set(mat4, cache);
  }
  let revision = null;

  return () => {
    if (revision !== mat4.revision) {
      revision = mat4.revision;
      Matrix4.invertPose(this.cache, mat4);
    }

    return cache;
  };
}

let shouldRender = true;
function requestRender() {
  shouldRender = true;
}

function animate(time) {
  requestAnimationFrame(animate);

  const delta = (time - previousTime) * 0.001;
  previousTime = time;

  // Don't process more than a quarter second of input at a time.
  //handleInput(Math.min(delta, 0.25));
  const cappedDelta = Math.min(delta, 0.25);
  handleCameraInput(cappedDelta, inputManager, camera, viewUniform);

  if (shouldRender) {
    render();
    shouldRender = false;
  }
}
animate();
scene.observe(() => {
  requestRender();
});

getElevationTile(7 * 64, 14 * 64, 12).then((tile) => {
  const imageData = tile.imageData;
  const temp = new Vector3();
  function getPosition(dest, from, dimensions) {
    // We need to copy `from` in case `dest` === `from`
    temp.copy(from);

    // Get a base frame to add from
    dest.copy(dimensions);
    Vector3.divideScalar(dest, dest, 2);
    Vector3.multiplyScalar(dest, dest, -1);

    // Add the current coordinate
    Vector3.add(dest, dest, temp);

    // Scale down size
    Vector3.divideScalar(dest, dest, 2);

    dest.z = 0.025 * parseImageDataElevation(imageData, temp.x, temp.y);
  }

  const pointsData = createLatticeLines(255, 255, getPosition);
  const lines = new Lines(gl);

  //const pointsData = createGridPoints(255, 255, getPosition);
  //const lines = new Points(gl);

  lines.buffer = gl.createBuffer();
  lines.shader = shader;
  shader.addObject(lines);

  const buffer = lines.buffer;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, pointsData, gl.STATIC_DRAW);

  lines.data = pointsData;
  lines.setup();

  lines.model.setIdentity();

  scene.addObject(lines);
});
