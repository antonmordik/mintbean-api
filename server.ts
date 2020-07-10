import {
  WebSocket,
  WebSocketServer,
} from "https://deno.land/x/websocket/mod.ts";
import { parseMessage } from "./src/services/parser.ts";
import Body from "./src/interfaces/Body.ts";
import Message from "./src/constants/Message.ts";
import WSError from "./src/constants/WSError.ts";

const wss = new WebSocketServer(8080);

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (message: string) => {
    console.log(message);
    const [type, user, body] = parseMessage<Body>(message);
    if (type === Message.Error) {
      return ws.close(1000, WSError.InvalidBody);
    }
    ws.send(message);
  });
});
