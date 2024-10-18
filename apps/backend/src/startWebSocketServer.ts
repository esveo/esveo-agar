import type { UpdateGameStateEvent } from "@esveo-agar/shared";
import { WebSocket, WebSocketServer } from "ws";

export function startWebSocketServer() {
  const wss = new WebSocketServer({ port: 3001, path: "/ws" });

  wss.on("connection", (ws) => {
    console.log("New connection!");

    ws.on("error", console.error);

    ws.on("close", () => {
      console.log("Connection closed");
      clearInterval(interval);
    });

    ws.on("pong", () => {
      potentiallyDeadSockets.delete(ws);
    });

    ws.on("message", (data) => {
      console.log("received, broadcasting it to all others:", data.toString());
      // for (const client of wss.clients) {
      //   client.send(data.toString());
      // }
    });

    let i = 0;
    const interval = setInterval(() => {
      i++;
      const newGameState: UpdateGameStateEvent = {
        you: 1,
        players: {
          1: {
            position: [
              200 + Math.sin(i / 80) * 200,
              200 + Math.cos(i / 80) * 200,
            ],
            radius: 10,
            color: "red",
          },
        },
        food: [],
      };

      ws.send(JSON.stringify(newGameState));
    }, 16);
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
