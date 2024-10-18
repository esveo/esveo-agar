import type { RawData } from "ws";
import { broadcast, GameServer } from "./index.ts";

export function handleClientEvent(userId: number, data: RawData) {
  console.log(userId, data.toString());
  broadcast(
    null,
    JSON.stringify(GameServer.wsMap, (key, value) =>
      value instanceof Map ? [...value] : value,
    ),
  );
  GameServer.wsMap.entries().forEach((e) => console.log(e[1].readyState));
}
