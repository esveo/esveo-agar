import { worldSize } from "@esveo-agar/shared";
import { WorldState } from "./worldState.ts";

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  state: WorldState,
) {
  ctx.fillStyle = "black";

  ctx.strokeStyle = "#ddd";

  const gridLineGap = 20;

  for (let i = 0; i < worldSize[0]; i += gridLineGap) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, worldSize[1]);
    ctx.stroke();
  }

  ctx.strokeStyle = "#ddd";

  for (let i = 0; i < worldSize[1]; i += gridLineGap) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(worldSize[0], i);
    ctx.stroke();
  }
}
