import Message from "../constants/Message.ts";

export const parseMessage = <T>(
  message: string,
): [Message, string, T | null] => {
  const parts = message.split("|");
  return parts.length === 2
    ? [parts[0] as Message, parts[1], JSON.parse(parts[2]) as T]
    : [Message.Error, "", null];
};
