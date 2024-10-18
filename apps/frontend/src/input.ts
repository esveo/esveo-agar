import { vector } from "@esveo-agar/shared";
import { WebsocketClient } from "./startWebSocketClient.ts";

export function registerInputEvents(
  canvas: HTMLCanvasElement,
  client: WebsocketClient,
  playerId: number,
) {
  function sendInput(event: PointerEvent) {
    const { clientX, clientY } = event;
    const direction = {
      x: clientX - window.innerWidth / 2,
      y: clientY - window.innerHeight / 2,
    };
    client.emit({
      type: "input",
      direction: vector.normalize(direction),
      playerId: playerId,
    });
  }

  canvas.addEventListener("pointerenter", sendInput);
  canvas.addEventListener("pointerleave", sendInput);
  canvas.addEventListener("pointermove", sendInput);
}
