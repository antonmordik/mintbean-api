import { validateJwt } from "https://deno.land/x/djwt/validate.ts";
import { makeJwt, setExpiration, Jose, Payload } from "https://deno.land/x/djwt/create.ts";
import config from "../config.ts";

const header: Jose = {
  alg: "HS256",
  typ: "JWT",
};

export const generate = async (message: string | object): Promise<string> => {
  const payload: Payload = {
    iss: typeof message === 'object' ? JSON.stringify(message) : message,
    exp: setExpiration(new Date().getTime() + 120 * 60 * 1000),
  };

  return new Promise((resolve, reject) => {
    try {
      const result = makeJwt({ header, payload, key: config.JWT_KEY });
      resolve(result);
    } catch (err) {
      reject(err);
    }
  }) 
}

export const validate = async (jwt: string): Promise<boolean> => {
  return (await validateJwt(jwt, config.JWT_KEY)).isValid;
}