import { Server } from "socket.io";

export class LiveReload {
  private _io: Server;

  createServer() {
    this._io = new Server(3001);

    this._io.on("connection", (socket) => {
      console.log("Client connected in dev mode");
    });

    return this._io;
  }
}
