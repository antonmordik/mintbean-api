import { RoomUser } from "../../interfaces/User.ts";
import Body from "../../interfaces/Body.ts";

export default class Room {

  static ids: string[] = [];
  private id: string;
  private players: RoomUser[];
  public body: Body;

  constructor(users: RoomUser[]) {
    let id = Math.random().toString(36).substring(7);
    while (Room.ids.includes(id)) {
      id = Math.random().toString(36).substring(7);
    }
    this.id = id;
    Room.ids.push(this.id);
    this.players = users;
    this.body = {};
  }
}