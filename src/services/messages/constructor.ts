import Message from "../../constants/Message.ts";
import Body from "../../interfaces/Body.ts";

export const createMessage = (type: Message, body: Body) => {
  return type + "|" + JSON.stringify(body);
};
