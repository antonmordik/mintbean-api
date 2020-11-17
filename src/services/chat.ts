import { Collection } from "https://deno.land/x/mongo@v0.8.0/mod.ts";
import database from "../database.ts";
import { User, IncommingUser, UserDTO } from "../interfaces/User.ts";
import { hash, verify } from "./hash.ts";
import ChatMessage from "../interfaces/ChatMessage.ts";
import { UserStorage } from './storage.ts';

export class ChatStorage {
  private userStorage: UserStorage;
  constructor() {
    this.userStorage = new UserStorage("users");
  }

  public async putMessage(msg: ChatMessage): Promise<ChatMessage> {
    const collections =  await database.listCollectionNames();
    const collectionNames = [`${msg.from}_${msg.to}`, `${msg.to}_${msg.from}`];

    let foundCollection = null;

    for (const collection of collections) {
      if (collectionNames.includes(collection)) {
        foundCollection = collection;
        break;
      }
    }

    if (!foundCollection) {
      foundCollection = `${msg.from}_${msg.to}`;
    }

    return database.collection(foundCollection).insertOne({
      ...msg,
      date: new Date()
    });
  }

  public async getUserContcts(user: UserDTO): Promise<UserDTO[]> {
    const collections =  await database.listCollectionNames();
    const foundCollections = [];
    
    for (const collection of collections) {
      if (collection.includes(user.id)) {
        foundCollections.push(collection);
        break;
      }
    }

    if (!foundCollections.length) {
      return [];
    }

    const contacts: string[] = foundCollections.map((collection: string) => {
      return collection.split('_').filter(userId => userId !== user.id);
    }).reduce((acc, next) => [...acc, ...next], []);

    return this.userStorage.getUsersByIds(contacts);
  }

  public async getHistory([userA, userB]: [string, string]): Promise<ChatMessage[]> {
    const collections =  await database.listCollectionNames();
    let foundCollection = null;
    
    for (const collection of collections) {
      if (collection.includes(userA) && collection.includes(userB)) {
        foundCollection = collection;
        break;
      }
    }

    if (!foundCollection) {
      return [];
    }

    return database.collection(foundCollection).find();
  }
}
