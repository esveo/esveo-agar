import { PlayerId } from "@esveo-agar/shared";
import { WebsocketClient } from "./startWebSocketClient.ts";

export function respawnElement(client: WebsocketClient, playerId: PlayerId) {
  const respawnButton = document.getElementById(
    "spawn-button",
  ) as HTMLButtonElement;

  respawnButton.addEventListener("click", () => {
    client.emit({
      playerId: playerId,
      type: "respawn",
    });
  });

  return respawnButton;
}
