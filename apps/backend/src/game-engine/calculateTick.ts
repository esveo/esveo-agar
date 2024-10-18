import { ClientInputState, GAME_WOLRD_WIDTH, GameState } from "@esveo-agar/shared";
import { produce } from "immer";
import { doPlayersCollide, doesEatParticle } from "./utils";

const BASE_SPEED = 1;
const STARTING_RADIUS = 10;

/**
 * Players with bigger radii should move slower
 * 
 * First iteration: a player with 10 times the radius should move half as fast
 */
function getSpeedMulitplierFromRadius(radius: number): number {
  // function that returns 1 for radius 1, 0.5 for radius 10, 0.25 for radius 100
  return Math.pow(2, -Math.log10(radius))
}

export function calculateTick(
  oldGameState: GameState,
  clientInputStatesById: Record<number, ClientInputState>,
) : GameState {
  return produce(oldGameState, gameState => {
    const players = Object.values(gameState.players);

    // Step 1: Move players
    for (const player of players) {
      // dead players do not move
      if (player.radius===0) {
        continue;
      }

      const clientInputState = clientInputStatesById[player.id];

      if (clientInputState) {
        const speedMultiplier = getSpeedMulitplierFromRadius(player.radius) * BASE_SPEED;

        player.position.x += clientInputState.direction.x * speedMultiplier;
        player.position.y += clientInputState.direction.y * speedMultiplier;

        // check collision with outer walls
        if (player.position.x - player.radius < 0) {
          player.position.x = player.radius;
        }
        if (player.position.x +player.radius > GAME_WOLRD_WIDTH) {
          player.position.x = GAME_WOLRD_WIDTH - player.radius;
        }
      }
    }

    // Step 2: Calculate player-player collisions
    const alivePlayers = players.filter(player => player.radius > 0);
    for (const player of alivePlayers) {
      for (const otherPlayer of alivePlayers) {
        if (player.id === otherPlayer.id) {
          continue;
        }

        if (doPlayersCollide(player, otherPlayer)) {
          const sameRadius = player.radius === otherPlayer.radius;
          const randomValue = Math.random();
          if (player.radius < otherPlayer.radius || (sameRadius && randomValue > 0.5)) {
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

    // Step 3: Calculate player-particle collisions
    gameState.particles = gameState.particles.filter(particle => {
      // check collision with players
      for (const player of alivePlayers) {
        if (doesEatParticle(player, particle)) {
          player.radius++;
          return false
        }
        return true;
      }
    })

    // TODO: Remove disconnected players: idea: no input state if player is disconnected

    // TODO: Place new players/respawned players

    // TODO: Regrow particles

    return gameState;
  })
}

