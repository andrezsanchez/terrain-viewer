import { Vector3 } from './vector3';
import { Matrix4 } from './matrix4';
import { Revisable } from './revisable';

export class Camera extends Revisable {
  constructor() {
    super();

    // The final resulting pose of the camera
    this.pose = new Matrix4();
    this.pose.setIdentity();

    // The inverse of the final pose
    this.poseInverse = new Matrix4();
    this.poseInverse.setIdentity();

    this.up = Vector3.fromCoordinates(0, 0, 1);

    this.groundPosition = Vector3.fromCoordinates(0, 0, 0);
    this.distance = 60;
    this.xRotationAngle = 0;
    this.zRotationAngle = Math.PI;
    this.xRotation = new Matrix4();
    this.zRotation = new Matrix4();
    this.revise();
  }
  updatePose() {
    const position = this.pose.getPosition();
    this.pose.setIdentity();

    this.xRotation.setRotateX(this.xRotationAngle);
    this.zRotation.setRotateZ(this.zRotationAngle);

    // pose = z * x * translateZ(-dist)
    position.copy(this.groundPosition);
    Matrix4.multiply(this.pose, this.pose, this.zRotation);
    Matrix4.multiply(this.pose, this.pose, this.xRotation);

    const translation = new Matrix4();
    translation.setIdentity();
    translation.getPosition().z = this.distance;

    Matrix4.multiply(this.pose, this.pose, translation);

    Matrix4.invertPose(this.poseInverse, this.pose);
    this.revise();
  }
}
