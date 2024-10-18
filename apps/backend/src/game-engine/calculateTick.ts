import {
  GAME_WOLRD_HEIGHT,
  GAME_WOLRD_WIDTH,
  type ClientInputState,
  type GameState,
  type Particle,
  type Player,
  type Vector,
} from "@esveo-agar/shared";
import { produce } from "immer";

const BASE_SPEED = 10;
const STARTING_RADIUS = 10;
/**
 * Particles spawned per tick. > 1 and integer value!
 */
const NEW_PARTICLES_PER_TICK = 1;
const MAX_PARTICLE_COUNT = 500;

/**
 * Players with bigger radii should move slower
 *
 * First iteration: a player with 10 times the radius should move half as fast
 */
function getSpeedMulitplierFromRadius(radius: number): number {
  // function that returns 1 for radius 1, 0.5 for radius 10, 0.25 for radius 100
  return Math.pow(2, -Math.log10(radius));
}

export function calculateTick(
  oldGameState: GameState,
  clientInputStatesById: Record<number, ClientInputState>,
  respawnPlayerIds: number[],
): GameState {
  return produce(oldGameState, (gameState) => {
    // Add missing players
    for (const playerId of Object.keys(clientInputStatesById).map(Number)) {
      if (!gameState.players[playerId]) {
        gameState.players[playerId] = {
          id: playerId,
          position: generateRandomNonCollidingPosition(
            gameState,
            STARTING_RADIUS,
          ),
          radius: STARTING_RADIUS,
        };
      }
    }

    // Respawn non-new players
    for (const playerId of respawnPlayerIds) {
      const player = gameState.players[playerId];
      if (player) {
        player.position = generateRandomNonCollidingPosition(
          gameState,
          player.radius,
        );
        player.radius = STARTING_RADIUS;
      }
    }

    const players = Object.values(gameState.players);

    // Move players
    for (const player of players) {
      // dead players do not move
      if (player.radius === 0) {
        continue;
      }

      const clientInputState = clientInputStatesById[player.id];

      if (clientInputState) {
        const speedMultiplier =
          getSpeedMulitplierFromRadius(player.radius) * BASE_SPEED;

        player.position.x += clientInputState.direction.x * speedMultiplier;
        player.position.y += clientInputState.direction.y * speedMultiplier;

        // check collision with outer walls
        if (player.position.x - player.radius < 0) {
          player.position.x = player.radius;
        }
        if (player.position.x + player.radius > GAME_WOLRD_WIDTH) {
          player.position.x = GAME_WOLRD_WIDTH - player.radius;
        }
        if (player.position.y - player.radius < 0) {
          player.position.y = player.radius;
        }
        if (player.position.y + player.radius > GAME_WOLRD_HEIGHT) {
          player.position.y = GAME_WOLRD_HEIGHT - player.radius;
        }
      }
    }

    // Calculate player-player collisions
    const alivePlayers = players.filter((player) => player.radius > 0);
    for (const player of alivePlayers) {
      for (const otherPlayer of alivePlayers) {
        if (player.id === otherPlayer.id) {
          continue;
        }

        if (doPlayersCollide(player, otherPlayer)) {
          const sameRadius = player.radius === otherPlayer.radius;
          const randomValue = Math.random();
          if (
            player.radius < otherPlayer.radius ||
            (sameRadius && randomValue > 0.5)
          ) {
            // Player dies
            otherPlayer.radius += player.radius;
            player.radius = 0;
          } else {
            // Other player dies
            player.radius += otherPlayer.radius;
            otherPlayer.radius = 0;
          }
        }
      }
    }

    // Calculate player-particle collisions
    gameState.particles = gameState.particles.filter((particle) => {
      // check collision with players
      for (const player of alivePlayers) {
        if (doesEatParticle(player, particle)) {
          player.radius += 10 / player.radius;
          return false;
        }
      }
      return true;
    });

    // Regrow particles
    if (gameState.particles.length < MAX_PARTICLE_COUNT) {
      for (let i = 0; i < NEW_PARTICLES_PER_TICK; i++) {
        gameState.particles.push(generateRandomPosition());
      }
    }

    return gameState;
  });
}

/**
 * Generate coordinates for a new player that do not collide with existing players (with a given radius)
 */
function generateRandomNonCollidingPosition(
  gameState: GameState,
  radius: number,
): Vector {
  const players = Object.values(gameState.players).filter(
    (player) => player.radius > 0,
  );

  while (true) {
    let x = Math.random() * GAME_WOLRD_WIDTH;
    if (x + radius > GAME_WOLRD_WIDTH) x = GAME_WOLRD_WIDTH - radius;
    if (x - radius < 0) x = radius;

    let y = Math.random() * GAME_WOLRD_WIDTH;
    if (y + radius > GAME_WOLRD_HEIGHT) y = GAME_WOLRD_HEIGHT - radius;
    if (y - radius < 0) y = radius;

    const collidesWithPlayer = players.some((player) =>
      doPlayersCollide(player, { id: 0, position: { x, y }, radius }),
    );

    if (!collidesWithPlayer) {
      return { x, y };
    }
  }
}

/**
 * Generate random coordinates within the game world
 */
function generateRandomPosition(): Vector {
  return {
    x: Math.floor(Math.random() * GAME_WOLRD_WIDTH),
    y: Math.floor(Math.random() * GAME_WOLRD_HEIGHT),
  };
}

/**
 * Returns true, if the player collides with the particle
 */
export function doesEatParticle(player: Player, particle: Particle): boolean {
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
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2),
  );
}
