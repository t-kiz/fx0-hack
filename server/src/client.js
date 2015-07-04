import _ from "lodash";
import {INIT_CONNECTION} from "./constants";

export default class Client {
  constructor(socket, server) {
    this.socket = socket;
    this.server = server;
    this.delays = [];
    this.id = socket.client.conn.id;
    this.socket.on(INIT_CONNECTION, this.initialize.bind(this));
  }

  initialize(msg) {
    this.delays.push(Date.now() - msg.time);
    if (msg.remain === 0) { this.server.synchronize(); }
  }

  getMeanDelay() {
    return _.reduce(this.delays, (sum, d) => sum + d) / this.delays.length;
  }
}
