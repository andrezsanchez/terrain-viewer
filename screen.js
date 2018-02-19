import { Revisable } from './revisable';

export class Screen extends Revisable {
  constructor(containerElement) {
    super();
    this.containerElement = containerElement;
    this.canvasElement = containerElement.getElementsByTagName('canvas')[0];

    const attributes = {
      //antialias: true,
    };

    this.gl = this.canvasElement.getContext('webgl2', attributes);

    if (!this.gl) {
      throw new Error('Could not create WebGL2 context');
    }

    this.width = null;
    this.height = null;
    this.updateCanvasSize();
    window.addEventListener('resize', this.updateCanvasSize.bind(this));
  }
  updateCanvasSize() {
    const containerDimensions = this.containerElement.getBoundingClientRect();
    this.width = containerDimensions.width * window.devicePixelRatio;
    this.height = containerDimensions.height * window.devicePixelRatio;
    this.canvasElement.width = this.width;
    this.canvasElement.height = this.height;
    this.canvasElement.style.width = `${containerDimensions.width}px`;
    this.canvasElement.style.height = `${containerDimensions.height}px`
    this.gl.viewport(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.revise();
  }
}
