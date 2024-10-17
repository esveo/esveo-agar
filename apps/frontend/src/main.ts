import { startWebSocketClient } from "./startWebSocketClient.ts";

const socket = await startWebSocketClient();

socket.addEventListener("message", (event) => {
  console.log(event);
});

const button = document.createElement("button");
let i = 0;
button.textContent = "Send message";

button.addEventListener("click", () => {
  socket.send(`Message ${i++}`);
});

document.body.appendChild(button);
