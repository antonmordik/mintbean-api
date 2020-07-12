import {
  WebSocket,
  WebSocketServer,
} from "https://deno.land/x/websocket/mod.ts";
import {
  Application,
} from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { parseMessage } from "./src/services/parser.ts";
import Body from "./src/interfaces/Body.ts";
import Message from "./src/constants/Message.ts";
import WSError from "./src/constants/WSError.ts";
import config from "./src/config.ts";
import router from "./src/router.ts";

const wss = new WebSocketServer(parseInt(config.WS_PORT));

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

const app = new Application();
app.use(oakCors({ credentials: true, origin: true  }));
app.use(router.routes());
app.use(router.allowedMethods());

console.log("🚀 Deno server start!");
await app.listen(`0.0.0.0:${config.API_PORT}`);
