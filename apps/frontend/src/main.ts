import { initCanvas } from "./canvas.ts";
import { startWebSocketClient } from "./startWebSocketClient.ts";

const client = await startWebSocketClient();

client.socket.addEventListener("message", (event) => {
  console.log(event);
});

const button = document.createElement("button");
let i = 0;
button.textContent = "Send message";

let userId = 0;

button.addEventListener("click", () => {
  client.socket.send(`Message ${i++}`);
});

document.body.appendChild(button);
const canvas = initCanvas(client);
