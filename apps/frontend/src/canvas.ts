import { WebsocketClient } from "./startWebSocketClient.ts";

export function initCanvas(client: WebsocketClient) {
  const canvas = document.getElementById("game") as HTMLCanvasElement;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  document.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  document.onpointerenter = (event) => {};
  document.onpointerdown = (event) => {};
  document.onpointermove = (event) => {};
  document.onpointerup = (event) => {};
  document.onpointerleave = (event) => {};
  return canvas;
}
