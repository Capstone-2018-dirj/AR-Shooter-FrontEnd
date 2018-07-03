export default function(playerPosition, heartPosition) {
  const difference = {
    x: Math.abs(playerPosition.x - heartPosition.x),
    z: Math.abs(playerPosition.z - heartPosition.z)
  };
  const buffer = 0.5; // may remove if accurate enough
  return difference.x < buffer && difference.z < buffer;
}
