export class Vector4 {
  constructor(
    public buffer:Float64Array = new Float64Array(4)
  ) {}
  set(x:number, y:number, z:number, w:number):Vector4 {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }
  copy(vec:Vector4):Vector4 {
    this.x = vec.x;
    this.y = vec.y;
    this.z = vec.z;
    this.w = vec.w;
    return this;
  }
  get x():number {
    return this.buffer[0];
  }
  set x(value:number) {
    this.buffer[0] = value;
  }
  get y():number {
    return this.buffer[1];
  }
  set y(value:number) {
    this.buffer[1] = value;
  }
  get z():number {
    return this.buffer[2];
  }
  set z(value:number) {
    this.buffer[2] = value;
  }
  get w():number {
    return this.buffer[3];
  }
  set w(value:number) {
    this.buffer[3] = value;
  }
  equals(vec:Vector4):boolean {
    return (
      this.x === vec.x &&
      this.y === vec.y &&
      this.z === vec.z && 
      this.w === vec.w
    );
  }
  toArray():number[] {
    return Array.from(this.buffer);
  }
}
