import { startWebSocketClient } from "./startWebSocketClient.ts";

const socket = await startWebSocketClient();

socket.addEventListener("message", (event) => {
  console.log(event);
});

const button = document.createElement("button");
let i = 0;
button.textContent = "Send message";

let userId = 0;

button.addEventListener("click", () => {
  const obj = { type: "input", playerId: userId, direction: { x: 0, y: 0 } };
  socket.send(JSON.stringify(obj));
});

document.body.appendChild(button);
