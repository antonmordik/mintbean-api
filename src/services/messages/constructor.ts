import Message from "../../constants/Message.ts";
import Body from "../../interfaces/Body.ts";

export const createMessage = (type: Message, body: Body) => {
  // TODO: pass into stringify body.toDTO()
  return type + "|" + JSON.stringify(body);
};
