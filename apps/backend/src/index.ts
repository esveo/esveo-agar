import { startWebSocketServer } from "./startWebSocketServer.ts";

export const GameServer = startWebSocketServer();

export function broadcast(playerId: number | null, message: string) {
  if (!playerId) {
    for (const client of GameServer.wss.clients) {
      client.send(message);
    }
    return;
  }
  GameServer.wsMap.get(playerId)?.send(message);
}
