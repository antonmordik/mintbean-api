import Message from "../constants/Message.ts";
import { UserDTO } from "../interfaces/User.ts";
import { WebSocket } from "https://deno.land/x/websocket/mod.ts";
import Body from "../interfaces/Body.ts";
import GamePool from "../pool.ts";
import WSError from "../constants/WSError.ts";
import { createMessage } from "./messages/constructor.ts";

export interface HandlerOptions {
  user: UserDTO;
  pool: GamePool;
  ws: WebSocket;
}

export const handleMessage = async (
  type: Message,
  body: Body,
  options: HandlerOptions,
) => {
  const { user, pool, ws } = options;
  switch (type) {
    case Message.Connect: {
      pool.pushToQueue(user);
      return ws.send(
        createMessage(
          Message.Connected,
          { message: "Queued user " + user.email },
        ),
      );
    }
    case Message.Error: {
      return ws.close(1000, WSError.InvalidBody);
    }
  }
};
