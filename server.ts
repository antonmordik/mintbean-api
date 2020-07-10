import {
  WebSocket,
  WebSocketServer,
} from "https://deno.land/x/websocket/mod.ts";
import {
  Application,
  Router,
  Status,
  Context,
} from "https://deno.land/x/oak/mod.ts";
import { parseMessage } from "./src/services/parser.ts";
import Body from "./src/interfaces/Body.ts";
import Message from "./src/constants/Message.ts";
import WSError from "./src/constants/WSError.ts";
import config from "./src/config.ts";

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

const router = new Router();

router.get("/", (ctx: Context) => {
  ctx.response.status = Status.OK;
  ctx.response.body = { message: "It's work !" };
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("🚀 Deno server start!");
await app.listen(`0.0.0.0:${config.API_PORT}`);
