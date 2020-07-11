import {
  hash as argonHash,
  verify as argonVerify,
} from "https://deno.land/x/argon2/lib/mod.ts";

export const hash = async (str: string): Promise<string> => {
  return argonHash(str);
};

export const verify = (str: string, hash: string): Promise<boolean> => {
  return argonVerify(hash, str);
};
