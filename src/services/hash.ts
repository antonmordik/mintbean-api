import { hash as argonHash, verify as argonVerify } from "https://deno.land/x/argon2/lib/mod.ts";
import config from "../config.ts";

export const hash = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  return argonHash(str, {
    salt: crypto.getRandomValues(new Uint8Array(20)),
    secret: encoder.encode(config.HASH_KEY)
  });
}

export const verify = (str: string, hash: string): Promise<boolean> => {
  return argonVerify(hash, str);
}