import { ClientEvent } from "@esveo-agar/shared";

export type WebsocketClient = {
  socket: WebSocket;
  emit: (event: ClientEvent) => void;
};

export async function startWebSocketClient(): Promise<WebsocketClient> {
  const socket = new WebSocket(
    (location.protocol === "https:" ? "wss://" : "ws://") + location.host,
  );

  await new Promise<void>((resolve, reject) => {
    socket.addEventListener(
      "open",
      (event) => {
        resolve();
      },
      { once: true },
    );

    socket.addEventListener("error", (event) => {
      reject(new Error("Could not connect", { cause: event }));
    });
  });

  return {
    socket,
    emit: (event: ClientEvent) => {
      socket.send(JSON.stringify(event));
    },
  };
}
