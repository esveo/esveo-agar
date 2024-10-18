import { Vector } from "@esveo-agar/shared";
import { WebsocketClient } from "./startWebSocketClient.ts";

export function initCanvas(client: WebsocketClient) {
  const canvas = document.getElementById("game") as HTMLCanvasElement;

  const center: Vector = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    center.x = window.innerWidth / 2;
    center.y = window.innerHeight / 2;
  });

  document.onpointerenter = (event) => {};
  document.onpointerdown = (event) => {};
  document.onpointermove = (event) => {};
  document.onpointerup = (event) => {};
  document.onpointerleave = (event) => {};
  return canvas;
}
