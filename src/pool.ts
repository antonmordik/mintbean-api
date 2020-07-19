import { UserDTO, RoomUser } from "./interfaces/User.ts";
import config from "./config.ts";
import Room from "./services/game/room.ts";
import { WebSocket } from "https://deno.land/x/websocket/mod.ts";
import { createMessage } from "./services/messages/constructor.ts";
import Message from "./constants/Message.ts";

class GamePool {
  private rooms: Room[];
  private queue: RoomUser[];
  private roomSize: number = parseInt(config.ROOM_SIZE);

  constructor() {
    this.rooms = [];
    this.queue = [];
  }

  public pushToQueue(user: UserDTO, ws: WebSocket): void {
    if (!this.queue.map((u) => u.user.id).includes(user.id)) {
      this.queue.push({ user, ws });
    }

    while (this.queue.length >= this.roomSize) {
      const participants: RoomUser[] = [];
      for (let count = 0; count < this.roomSize; count += 1) {
        participants.push(this.queue.shift() as RoomUser);
      }
      const room = new Room(participants);
      this.rooms.push(room);
      participants.forEach(each => {
        each.ws.send(createMessage(Message.RoomFound, room.body))
      })
    }
  }
}

export default GamePool;
