export class Vector3 {
  constructor(
    public buffer:Float64Array = new Float64Array(3)
  ) {}
  static fromCoordinates(x:number, y:number, z:number):Vector3 {
    const vector = new Vector3();
    vector.x = x;
    vector.y = y;
    vector.z = z;
    return vector;
  }
  set(x:number, y:number, z:number):Vector3 {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  copy(vec3:Vector3):Vector3 {
    this.x = vec3.x;
    this.y = vec3.y;
    this.z = vec3.z;
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
  equals(vec3:Vector3):boolean {
    return (
      this.x === vec3.x &&
      this.y === vec3.y &&
      this.z === vec3.z
    );
  }
  static cross(dest:Vector3, a:Vector3, b:Vector3):Vector3 {
    const x = (a.y * b.z) - (a.z * b.y);
    const y = (a.z * b.x) - (a.x * b.z);
    const z = (a.x * b.y) - (a.y * b.x);
    dest.x = x;
    dest.y = y;
    dest.z = z;
    return dest;
  }
  static dot(a:Vector3, b:Vector3):number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }
  static multiplyScalar(dest:Vector3, source:Vector3, value:number) {
    dest.x = source.x * value;
    dest.y = source.y * value;
    dest.z = source.z * value;
  }
  static divideScalar(dest:Vector3, source:Vector3, value:number) {
    dest.x = source.x / value;
    dest.y = source.y / value;
    dest.z = source.z / value;
  }
  static add(dest:Vector3, a:Vector3, b:Vector3) {
    dest.x = a.x + b.x;
    dest.y = a.y + b.y;
    dest.z = a.z + b.z;
  }
  static subtract(dest:Vector3, a:Vector3, b:Vector3) {
    dest.x = a.x - b.x;
    dest.y = a.y - b.y;
    dest.z = a.z - b.z;
  }
  magnitude2():number {
    return (this.x * this.x) + (this.y * this.y) + (this.z * this.z);
  }
  magnitude():number {
    return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
  }
  static normalize(dest:Vector3, source:Vector3) {
    Vector3.divideScalar(dest, source, source.magnitude());
  }
  static safeNormalize(dest:Vector3, source:Vector3):boolean {
    const magnitudeSquared = source.magnitude2();

    if (magnitudeSquared === 0) {
      return false;
    }

    const magnitude = Math.sqrt(magnitudeSquared);
    Vector3.divideScalar(dest, source, magnitude);
    return true;
  }
}
