import { THREE } from 'expo-three';

export default function createLaser(position, aim) {
  var dir = new THREE.Vector3(aim.x, aim.y, aim.z);
  dir.normalize();
  var origin = new THREE.Vector3(
    position.x,
    position.y,
    position.z
  );
  var length = 0.5;
  var hex = 0x00ff00;
  var laser = new THREE.ArrowHelper(dir, origin, length, hex, 1, 0.05);
  laser.velocity = new THREE.Vector3(
    aim.x,
    aim.y,
    aim.z
  );

  return laser;
}
