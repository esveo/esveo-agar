import { WebSocket, WebSocketServer } from "ws";
import { handleClientEvent } from "./handleClientEvent.ts";

export function startWebSocketServer() {
  const wss = new WebSocketServer({ port: 3001 });

  const wsMap = new Map<number, WebSocket>();

  let totalInitiatedConnections = 0;
  wss.on("connection", (ws) => {
    console.log("New connection!");
    const userId = totalInitiatedConnections;
    wsMap.set(userId, ws);
    totalInitiatedConnections++;

    ws.on("error", console.error);

    ws.on("close", () => {
      console.log("Connection closed");
    });

    ws.on("pong", () => {
      potentiallyDeadSockets.delete(ws);
    });

    ws.on("message", (data) => {
      handleClientEvent(userId, data);
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

  return { wss, wsMap };
}
