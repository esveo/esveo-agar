import { Particle, Player, Vector } from "@esveo-agar/shared";

/**
 * Returns true, if the player collides with the particle
 */
export function doesEatParticle(
  player: Player,
  particle: Particle,
) : boolean {
  // Check x and y coordinates separately for better performance
  if (
    Math.abs(player.position.x - particle.x) >= player.radius ||
    Math.abs(player.position.y - particle.y) >= player.radius
) {
    return false;
  }

  const distance = getDistance(player.position, particle);
  return distance < player.radius;
}

export function doPlayersCollide(player1: Player, player2: Player) {
  const sumOfRadii = player1.radius + player2.radius;

  // Check x and y coordinates separately for better performance
  if (
    Math.abs(player1.position.x - player2.position.x) >= sumOfRadii ||
    Math.abs(player1.position.y - player2.position.y) >= sumOfRadii
  ) {
    return false;
  }

  const distance = getDistance(player1.position, player2.position);
  return distance < sumOfRadii;
}

/**
 * Returns the euclidean distance between two points
 */
export function getDistance(point1: Vector, point2: Vector) {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
}