import _ from "lodash";
import {INIT_CONNECTION} from "./constants";

export default class Client {
  constructor(socket) {
    this.socket = socket;
    this.delays = [];
    this.id = socket.client.conn.id;
    this.socket.on(INIT_CONNECTION, this.initialize.bind(this));
  }

  initialize(msg) {
    this.delays.push(Date.now() - msg);
    console.log(this.delays);
    console.log(this.getMeanDelay());
  }

  getMeanDelay() {
    return _.reduce(this.delays, (sum, d) => sum + d) / this.delays.length;
  }
}
