import {
  Router,
  Status,
  Context,
} from "https://deno.land/x/oak/mod.ts";
import { UserStorage } from "./services/storage.ts";
import { validate } from "./services/jwt.ts";
import { UserDTO } from "./interfaces/User.ts";

const userStorage = new UserStorage("users");
const router = new Router();

router.get("/ping", (ctx: Context) => {
  ctx.response.status = Status.OK;
  ctx.response.body = { message: "pong!" };
});

router.post("/signup", async ({ request, response }: Context) => {
  const { value: body } = await request.body();
  if (["email", "password", "nickname"].every((field) => field in body)) {
    try {
      const [token, user] = await userStorage.add(body);
      response.status = Status.OK;
      response.body = { message: "Registration succeed!", token, user };
    } catch (err) {
      response.status = Status.BadRequest;
      response.body = { message: err.message };
    }
  } else {
    response.status = Status.BadRequest;
    response.body = {
      message: "Body should have 'email', 'password', 'nickname' fields.",
    };
  }
});

router.post("/signin", async ({ request, response }: Context) => {
  const { value: body } = await request.body();
  if (["email", "password"].every((field) => field in body)) {
    try {
      const [token, user] = await userStorage.login(body);
      response.status = Status.OK;
      response.body = { message: "Login succeed!", token, user };
    } catch (err) {
      response.status = Status.BadRequest;
      response.body = { message: err.message };
    }
  } else {
    response.status = Status.BadRequest;
    response.body = {
      message: "Body should have 'email', 'password' fields.",
    };
  }
});

router.get("/me", async ({ request, response }: Context) => {
  const authorization = request.headers.get("authorization");
  if (authorization) {
    try {
      const user = await validate<UserDTO>(authorization);
      response.status = Status.OK;
      response.body = { message: "User found.", user };
    } catch (err) {
      response.status = Status.BadRequest;
      response.body = { message: err.message };
    }
  } else {
    response.status = Status.Unauthorized;
    response.body = { message: "Invalid user token." };
  }
});

export default router;
