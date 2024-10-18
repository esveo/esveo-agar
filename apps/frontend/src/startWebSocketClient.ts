import { ClientEvent } from "@esveo-agar/shared";

export type WebsocketClient = {
  socket: WebSocket;
  emit: (event: ClientEvent) => void;
};

export async function startWebSocketClient(): Promise<WebsocketClient> {
  const socket = new WebSocket(
    "ws://94cc-2003-c9-3f06-ad01-2551-81d2-7e33-3656.ngrok-free.app",
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
