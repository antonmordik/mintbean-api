import Message from "../../constants/Message.ts";
import { validate } from "../jwt.ts";
import { UserDTO } from "../../interfaces/User.ts";

export const parseMessage = async <T>(
  message: string,
): Promise<[Message, UserDTO, object]> => {
  const parts = message.split("|");
  if (parts.length !== 3) {
    throw new Error("Incorrect ws message format");
  }

  const type = parts[0] as Message;
  const user = await validate<UserDTO>(parts[1]);
  const payload = JSON.parse(parts[2]);

  return [type, user, payload];
};
