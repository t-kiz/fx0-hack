import _ from "lodash";
import Server from "socket.io";
import Client from "./client";
import {SYNCHRONIZE} from "./constants";

export default class WebSocketServer {
  constructor(port) {
    this.clients = [];
    this.io = new Server();
    this.io.on("connection", this.onConnect.bind(this));
  }

  listen(port) {
    this.io.listen(port);
  }

  onConnect(socket) {
    let client = new Client(socket, this)
    this.clients.push(client);
    console.log(`connected: ${client.id}`);
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

  synchronize() {
    let n = this.clients.length;
    _.forEach(this.clients, (client, i) => {
      let msg = {
        delay: client.getMeanDelay(),
        index: i,
        clientCount: n
      };
      console.log(`synchronize ${client.id}`);
      console.log(msg);
      client.socket.emit(SYNCHRONIZE, msg);
    });
  }
}
