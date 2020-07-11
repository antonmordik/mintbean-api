import { Collection } from "https://deno.land/x/mongo@v0.8.0/mod.ts";
import database from "../database.ts";
import { generate, validate } from "./jwt.ts";
import { User, IncommingUser, UserDTO } from "../interfaces/User.ts";
import { hash, verify } from "./hash.ts";

export class UserStorage {
  private collection: Collection;

  constructor(collection: string) {
    this.collection = database.collection(collection);
  }

  private transformUser(user: User): UserDTO {
    const dto = { id: user._id.$oid, ...user };
    delete dto.password;
    delete dto._id;
    return dto;
  }

  private async checkUniqEmail(email: string): Promise<boolean> {
    const users = await this.collection.find() as User[];
    return users.every(user => user.email !== email);
  }

  public async add(user: IncommingUser): Promise<[string, UserDTO]> {
    if (!(await this.checkUniqEmail(user.email))) {
      throw new Error("User with this email already exists.");
    }
    user.password = await hash(user.password);
    const result = await this.collection.insertOne(user);
    const transfer = this.transformUser({...user, _id: result });
    return [await generate(transfer), transfer];
  }
}
