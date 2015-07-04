import WebSocketServer from "./websocketserver";
import {port} from "./constants";

let server = new WebSocketServer();

server.listen(port);
