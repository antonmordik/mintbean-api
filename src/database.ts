import { MongoClient } from "https://deno.land/x/mongo@v0.8.0/mod.ts";
import config from "./config.ts";

const client = new MongoClient();
client.connectWithUri(config.DB_URI);
const database = client.database(config.DB_NAME);

export default database;
