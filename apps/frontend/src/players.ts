import { WorldState } from "./worldState.ts";

export function drawPlayers(ctx: CanvasRenderingContext2D, state: WorldState) {
  for (const player of Object.values(state.gameState.players)) {
    ctx.beginPath();
    ctx.arc(...player.position, player.radius, 0, 2 * Math.PI);
    ctx.fillStyle = player.color;
    ctx.fill();
  }
}
