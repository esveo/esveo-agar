import type {
  ClientEvent,
  ClientInputState,
  GameState,
} from "@esveo-agar/shared";
import http from "http";
import { WebSocket, WebSocketServer } from "ws";
import { calculateTick } from "./game-engine/calculateTick.ts";

const MAX_FRAME_TIME_MS = 1000 / 60;

export async function startWebSocketServer() {
  const wss = new WebSocketServer({ noServer: true });
  const httpServer = http.createServer((req, res) => {
    const isWebSocketRequest = req.headers.upgrade === "websocket";
    if (isWebSocketRequest) {
      wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
        wss.emit("connection", ws, req);
      });
      return;
    } else {
      const proxyOptions = {
        hostname: "localhost",
        port: 3000,
        path: req.url,
        method: req.method,
        headers: req.headers,
      };
      const proxy = http.request(proxyOptions, (proxyRes) => {
        console.log(req.url, proxyRes.statusCode);
        res.writeHead(proxyRes.statusCode ?? 200, proxyRes.headers);
        proxyRes.pipe(res, {
          end: true,
        });
      });

      req.pipe(proxy, {
        end: true,
      });
    }
  });

  httpServer.listen(3001);

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
