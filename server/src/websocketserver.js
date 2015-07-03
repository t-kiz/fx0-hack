import Server from "socket.io";

export default class WebSocketServer {
  constructor(port) {
    this.io = new Server();
    this.io.on("connection", this.onConnect.bind(this));
  }

  listen(port) {
    this.io.listen(port);
  }

  onConnect(socket) {
    console.log("connect!");
    socket.on("chat message", this.onChatMessage.bind(this));
    socket.on("disconnect", this.onDisconnect.bind(this));
  }

  onDisconnect() {
    console.log("disconnect...");
  }

  onChatMessage(msg) {
    console.log(`received: ${msg}`);
    this.io.emit("chat message", msg);
  }
}
