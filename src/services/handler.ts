import Message from "../constants/Message.ts";
import { UserDTO } from "../interfaces/User.ts";
import { WebSocket } from "https://deno.land/x/websocket/mod.ts";
import Body from "../interfaces/Body.ts";
import WSError from "../constants/WSError.ts";
import { createMessage } from "./messages/constructor.ts";
import { ChatStorage } from "./chat.ts";
import { UserStorage } from "./storage.ts";
import { Online } from "./online.ts";

export interface HandlerOptions {
  user: UserDTO;
  ws: WebSocket;
  online: Online
}

const chatStorage = new ChatStorage();
const userStorage = new UserStorage("users");

export const handleMessage = async (
  type: Message,
  body: Body,
  options: HandlerOptions,
) => {
  const { user, ws, online } = options;
  switch (type) {
    case Message.Connect: {
      online.add(user.id, ws);
      return ws.send(createMessage(
        Message.ContactsSend,
        {
          contacts: await chatStorage.getUserContcts(user)
        }
      ));
    }
    case Message.FindOpponent: {
      if (!body.nickname) {
        return ws.send(createMessage(Message.Error, { message: 'No nickname provided' }));
      }
      const target = await userStorage.getUserByNickname(body.nickname);
      if (!target) {
        return ws.send(createMessage(Message.Error, {
          message: 'No such user in database'
        }))
      }
      const otherContacts = await chatStorage.getUserContcts(user);
      return ws.send(createMessage(Message.ContactsSend, {
        contacts: [target, ...otherContacts],
        messages: []
      }));
    }
    case Message.SendMessage: {
      if (!body.message || !body.to) {
        return ws.send(createMessage(Message.Error, { message: 'No message provided' }));
      }

      const targetWs = online.get(body.to);

      chatStorage.putMessage({
        from: user.id,
        to: body.to,
        content: body.message
      });

      ws.send(createMessage(Message.ReceiveMessage, {
        from: user.id,
        to: body.to,
        content: body.message
      }));

      if (targetWs && !targetWs.isClosed ) {
        targetWs?.send(createMessage(Message.ReceiveMessage, {
          from: user.id,
          to: body.to,
          content: body.message
        }));
      } else {
        online.remove(body.to);
      }
      return;
    }
    case Message.GetHistory: {
      if (!body.to) {
        return ws.send(createMessage(Message.Error, { message: 'No user provided' }));
      }

      const messages = await chatStorage.getHistory([user.id, body.to]);
      return ws.send(createMessage(Message.GetHistory, {
        messages,
        to: body.to
      }))
    }
    case Message.Error: {
      online.remove(user.id);
      return ws.close(1000, WSError.InvalidBody);
    }
  }
};
