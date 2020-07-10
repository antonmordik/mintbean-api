import { Collection } from "https://deno.land/x/mongo@v0.8.0/mod.ts";
import database from "../database.ts";

export class UserStorage {
  private collection: Collection;

  constructor(collection: string) {
    this.collection = database.collection(collection);
  }

  // TODO: implement this and others
  public async add(): Promise<{}> {
    return this.collection.insertOne({});
  }
}
