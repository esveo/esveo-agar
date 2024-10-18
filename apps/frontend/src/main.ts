import { UpdateGameStateEvent, Vector, worldSize } from "@esveo-agar/shared";
import { drawBackground } from "./background.ts";
import { drawPlayers } from "./players.ts";
import { setupCanvas } from "./setupCanvas.ts";
import { startWebSocketClient } from "./startWebSocketClient.ts";
import { WorldState } from "./worldState.ts";

const socket = await startWebSocketClient();
const [canvas, ctx] = setupCanvas();

const cameraPosition: Vector = [worldSize[0] * 0.5, worldSize[1] * 0.5];
const cameraSize = 1000;

const worldState: WorldState = {
  camera: {
    position: cameraPosition,
    size: cameraSize,
  },
  gameState: {
    you: 1,
    players: {
      1: {
        position: [200, 200],
        radius: 10,
        color: "red",
      },
    },
    food: [],
  },
};

function paint() {
  const you = worldState.gameState.players[worldState.gameState.you]!;
  worldState.camera.position = you.position;
  worldState.camera.size = you.radius * 20;
  ctx.restore();
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.translate(canvas.width * 0.5, canvas.height * 0.5);

  const xScale = canvas.width / worldState.camera.size;
  const yScale = canvas.height / worldState.camera.size;
  const relevantScale = Math.min(xScale, yScale);

  ctx.scale(relevantScale, relevantScale);
  ctx.translate(-worldState.camera.position[0], -worldState.camera.position[1]);

  drawBackground(ctx, worldState);
  drawPlayers(ctx, worldState);

  requestAnimationFrame(paint);
}

requestAnimationFrame(paint);

document.body.appendChild(canvas);

socket.addEventListener("message", (event) => {
  const gameState: UpdateGameStateEvent = JSON.parse(event.data);
  worldState.gameState = gameState;
});
