import { validateJwt } from "https://deno.land/x/djwt/validate.ts";
import {
  makeJwt,
  setExpiration,
  Jose,
  Payload,
} from "https://deno.land/x/djwt/create.ts";
import config from "../config.ts";

const header: Jose = {
  alg: "HS256",
  typ: "JWT",
};

export const generate = async (message: string | object): Promise<string> => {
  const payload: Payload = {
    iss: typeof message === "object" ? JSON.stringify(message) : message,
    exp: setExpiration(new Date().getTime() + 120 * 60 * 1000),
  };

  return new Promise((resolve, reject) => {
    try {
      const result = makeJwt({ header, payload, key: config.JWT_KEY });
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
};

export const validate = async <T>(jwt: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    validateJwt(jwt, config.JWT_KEY).then((validation) => {
      if (validation.isValid && validation.payload && validation.payload.iss) {
        resolve(JSON.parse(validation.payload.iss) as T);
      } else {
        reject(new Error("Token validation failed"));
      }
    }).catch((err) => {
      reject(err);
    });
  });
};
