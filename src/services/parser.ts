import Message from "../constants/Message.ts";

export const parseMessage = <T>(
  message: string,
): [Message, string, T | string | null] => {
  const parts = message.split("|");
  return parts.length === 3
    ? [parts[0] as Message, parts[1], parts[2] as string]
    : [Message.Error, "", null];
};
