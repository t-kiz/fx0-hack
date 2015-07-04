import _ from "lodash";
import Server from "socket.io";
import Client from "./client";
import {SYNCHRONIZE, BROADCAST_PLAY_TIME} from "./constants";

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
    this.prinntConnections()
    socket.on("chat message", this.onChatMessage.bind(this));
  }

  disconnect(disconnectedClient) {
    this.clients = _.reject(this.clients, (client) => client.id === disconnectedClient.id);
    console.log(`disconnected: ${disconnectedClient.id}`);
    this.prinntConnections();
    this.synchronize();
  }

  onChatMessage(msg) {
    console.log(`received: ${msg}`);
    this.io.emit("chat message", msg);
  }

  synchronize() {
    let n = this.clients.length;
    _.forEach(this.clients, (client, i) => {
      let spendTime = ((this.startedAt !== undefined) ? (Date.now() - this.startedAt - client.getMeanDelay()) : null)
      let msg = {
        id: client.id,
        delay: client.getMeanDelay(),
        index: i,
        clientCount: n,
        spendTime: spendTime
      };
      console.log(msg);
      client.socket.emit(SYNCHRONIZE, msg);
    });
  }

  broadcastPlayTime(master, time) {
    console.log(`started: ${master.id}`);
    this.startedAt = time;
    _.forEach(this.clients, (client) => {
      if (client.id !== master.id) {
        client.socket.emit(BROADCAST_PLAY_TIME, time + this.getMeanDelay());
      }
    });
  }

  prinntConnections() {
    console.log(_.map(this.clients, (client) => client.id));
  }
}
