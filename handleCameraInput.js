import { Vector3 } from './vector3';
import { Matrix4 } from './matrix4';

const motion = new Vector3();
const tempMatrix4 = new Matrix4();
export function handleCameraInput(delta, inputManager, camera, viewUniform) {
  const rotationSpeed = Math.PI / 2;

  const r = inputManager.keyStates.get('d') ? 1 : 0;
  const l = inputManager.keyStates.get('a') ? 1 : 0;
  const u = inputManager.keyStates.get('w') ? 1 : 0;
  const d = inputManager.keyStates.get('s') ? 1 : 0;
  motion.x = r - l;
  motion.y = u - d;
  if (motion.x !== 0.0 || motion.y !== 0.0) {
    const position = camera.groundPosition;
    
    Vector3.normalize(motion, motion);
    Vector3.multiplyScalar(motion, motion, delta);

    if (inputManager.keyStates.get('Shift')) {
      camera.zRotationAngle += motion.x * rotationSpeed;
      camera.xRotationAngle -= motion.y * rotationSpeed;
      camera.xRotationAngle = Math.max(Math.min(Math.PI / 2, camera.xRotationAngle), 0);
    }
    else {
      Vector3.multiplyScalar(motion, motion, camera.distance);
      tempMatrix4.setIdentity();
      tempMatrix4.setPosition(motion);
      Matrix4.multiply(tempMatrix4, camera.zRotation, tempMatrix4);
      Vector3.add(position, position, tempMatrix4.getPosition());
    }

    camera.updatePose();
    viewUniform.data.copy(camera.poseInverse);
    viewUniform.revise();
  }
  const zoomIn = inputManager.keyStates.get('r') ? 1 : 0;
  const zoomOut = inputManager.keyStates.get('f') ? 1 : 0;
  const zoomDirection = zoomOut - zoomIn;
  if (zoomDirection !== 0) {
    camera.distance *= 1.0 + zoomDirection * delta;
    camera.updatePose();
    viewUniform.data.copy(camera.poseInverse);
    viewUniform.revise();
  }
}
