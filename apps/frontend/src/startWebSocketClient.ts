export async function startWebSocketClient(): Promise<WebSocket> {
  const socket = new WebSocket("ws://localhost:3001");

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

  return socket;
}
