import { WebsocketClient } from "./startWebSocketClient.ts";

export function createCanvas(client: WebsocketClient) {
  const canvas = document.getElementById("game") as HTMLCanvasElement;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  return canvas;
}
