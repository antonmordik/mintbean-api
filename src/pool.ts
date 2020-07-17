import { UserDTO } from "./interfaces/User.ts";
import config from "./config.ts";

class GamePool {
  private rooms: any[];
  private queue: UserDTO[];
  private roomSize: number = parseInt(config.ROOM_SIZE);

  constructor() {
    this.rooms = [];
    this.queue = [];
  }

  public pushToQueue(user: UserDTO) {
    if (!this.queue.map((u) => u.id).includes(user.id)) {
      this.queue.push(user);
    }

    while (this.queue.length >= this.roomSize) {
      const participants = [];
      for (let count = 0; count < this.roomSize; count += 1) {
        participants.push(this.queue.shift());
      }
    }
  }
}

export default GamePool;
