export function heartGrabbed(playerPosition, heartPosition) {
  const difference = {
    x: Math.abs(playerPosition.x - heartPosition.x),
    z: Math.abs(playerPosition.z - heartPosition.z)
  };
  const buffer = 0.5; // may remove if accurate enough
  return difference.x < buffer && difference.z < buffer;
}

export function howMuchHealth(currentHealth) {
  if (currentHealth <= 6) return currentHealth + 3;
  return 10;
}
