import { UserDTO } from "./User.ts";
import ChatMessage from "./ChatMessage.ts";

export default interface Body {
  message?: string;
  // TODO: make toDTO() implementation
  toDTO?: () => Record<string, unknown>;
  contacts?: UserDTO[];
  nickname?: string;
  to?: string;
  from?: string;
  messages?: ChatMessage[];
  content?: string;
}
