import type {
  ClientEvent,
  ClientInputState,
  GameState,
} from "@esveo-agar/shared";
import { WebSocket, WebSocketServer } from "ws";
import { calculateTick } from "./game-engine/calculateTick.ts";

const MAX_FRAME_TIME_MS = 1000 / 60;

export async function startWebSocketServer() {
  const wss = new WebSocketServer({ port: 3001 });

  const wsMap = new Map<number, WebSocket>();
  let gameState: GameState = { players: {}, particles: [] };
  const clientInputStatesById: Record<string, ClientInputState> = {};
  const respawningPlayerIds: Set<number> = new Set();

  let totalInitiatedConnections = 0;
  wss.on("connection", (ws) => {
    console.log("New connection!");
    const playerId = totalInitiatedConnections++;
    wsMap.set(playerId, ws);

    ws.on("error", console.error);

    ws.on("close", () => {
      console.log("Connection closed");
    });

    ws.on("pong", () => {
      potentiallyDeadSockets.delete(ws);
    });

    ws.on("message", (data) => {
      const payload = JSON.parse(data.toString()) as ClientEvent;

      switch (payload.type) {
        case "input":
          clientInputStatesById[playerId] ??= { direction: { x: 0, y: 0 } };
          clientInputStatesById[playerId].direction = payload.direction;
          return;
        case "respawn":
          respawningPlayerIds.add(playerId);
          clientInputStatesById[playerId] ??= { direction: { x: 0, y: 0 } };
          return;
        default:
          payload satisfies never;
      }
    });

    ws.send(JSON.stringify({ type: "serverwelcome", playerId }));
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

  while (true) {
    const now = Date.now();
    gameState = calculateTick(
      gameState,
      clone(clientInputStatesById),
      Array.from(respawningPlayerIds),
    );
    respawningPlayerIds.clear();
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ type: "gamestateupdate", gameState }));
    });
    const timeSpent = Date.now() - now;
    if (timeSpent > MAX_FRAME_TIME_MS) {
      console.warn(
        `Frame took ${timeSpent}ms, expected ${MAX_FRAME_TIME_MS}ms`,
      );
      continue;
    } else {
      await sleep(MAX_FRAME_TIME_MS - timeSpent);
    }
  }
}

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x));
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
