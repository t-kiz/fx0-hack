import Server from "socket.io";

class WebSocketServer {
  constructor(port) {
    this.io = new Server();
    this.io.on("connection", this.onConnect.bind(this));
    this.io.listen(port);
  }

  onConnect(socket) {
    socket.on("disconnect", this.onDisconnect.bind(this));
  }

  onDisconnect() {
  }
}
