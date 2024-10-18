import { GameState, ServerEvent } from "@esveo-agar/shared";
import { createCanvas } from "./canvas.ts";
import { registerInputEvents } from "./input.ts";
import { createRenderer } from "./renderer.ts";
import { getRespawnElement } from "./respawn.ts";
import { startWebSocketClient } from "./startWebSocketClient.ts";

const client = await startWebSocketClient();
const canvas = createCanvas();
const renderer = createRenderer(canvas);
const respawnButton = getRespawnElement();

let playing = false;
let playerId: number;
let lastGameState: GameState;

client.socket.addEventListener("message", (e) => {
  const event = JSON.parse(e.data) as ServerEvent;

  switch (event.type) {
    case "serverwelcome":
      playerId = event.playerId;
      playing = true;
      registerInputEvents(canvas, client, playerId);
      return;
    case "gamestateupdate":
      if (playerId === undefined) return;
      lastGameState = event.gameState;
      renderer.render(event.gameState, playerId);
      return;
  }
});

window.addEventListener("resize", () => {
  if (!playing) return;
  if (!lastGameState) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  renderer.render(lastGameState, playerId);
});

respawnButton.addEventListener("click", () => {
  client.emit({ playerId: playerId, type: "respawn" });
  document.getElementById("ui-container")!.style.display = "none";
});
