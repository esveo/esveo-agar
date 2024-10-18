import { ClientEvent } from "@esveo-agar/shared";

export class WebsocketClient {
  constructor(private socket: WebSocket) {}
  emit(event: ClientEvent) {
    this.socket.send(JSON.stringify(event));
  }
}
