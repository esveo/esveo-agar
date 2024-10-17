import { WebSocket, WebSocketServer } from "ws";

export function startWebSocketServer() {
  const wss = new WebSocketServer({ port: 3001 });

  wss.on("connection", (ws) => {
    console.log("New connection!");

    ws.on("error", console.error);

    ws.on("close", () => {
      console.log("Connection closed");
    });

    ws.on("pong", () => {
      potentiallyDeadSockets.delete(ws);
    });

    ws.on("message", (data) => {
      console.log("received, broadcasting it to all others:", data.toString());
      for (const client of wss.clients) {
        client.send(data.toString());
      }
    });

    ws.send("Welcome to the server!");
  });

  const potentiallyDeadSockets = new Set<WebSocket>();
  setInterval(() => {
    for (const client of wss.clients) {
      if (potentiallyDeadSockets.has(client)) {
        console.log("Terminating dead connection");
        client.terminate();
        continue;
      }

      client.ping();
      potentiallyDeadSockets.add(client);
    }
  }, 5000);
}
