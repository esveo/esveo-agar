import { GameState, vector } from "@esveo-agar/shared";
import { setViewportToWindowDimension } from "./canvas.ts";
import { Renderer } from "./renderer.ts";
import { startWebSocketClient } from "./startWebSocketClient.ts";

const client = await startWebSocketClient();

client.socket.addEventListener("message", (event) => {
  console.log(event);
});

const button = document.createElement("button");
let i = 0;
button.textContent = "Send message";

button.addEventListener("click", () => {
  client.socket.send(`Message ${i++}`);
});

document.body.appendChild(button);
const canvas = setViewportToWindowDimension();
const renderer = new Renderer(canvas, 1);
const dummyState: GameState = {
  players: {
    1: {
      id: 1,
      position: { x: 300, y: 300 },
      radius: 10,
    },
    2: {
      id: 2,
      position: { x: 200, y: 200 },
      radius: 20,
    },
  },
  particles: new Array(100).fill(0).map((_, i) => ({
    x: Math.random() * 800,
    y: Math.random() * 800,
  })),
};

const center = { x: 200, y: 200 };
canvas.addEventListener("click", (event) => {
  center.x = event.clientX;
  center.y = event.clientY;
  renderer.render(dummyState);
});

renderer.render(dummyState);

window.addEventListener("resize", () => {
  setViewportToWindowDimension();
  renderer.render(dummyState);
});

function sendInput(event: PointerEvent) {
  const { clientX, clientY } = event;
  const direction = {
    x: clientX - window.innerWidth / 2,
    y: clientY - window.innerHeight / 2,
  };
  client.emit({
    type: "input",
    direction: vector.normalize(direction),
    playerId: 1,
  });
}

canvas.addEventListener("pointerenter", sendInput);
canvas.addEventListener("pointerleave", sendInput);
canvas.addEventListener("pointermove", sendInput);
