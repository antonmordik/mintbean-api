import {
  Router,
  Status,
  Context,
} from "https://deno.land/x/oak/mod.ts";
import { parseHeaders } from "./services/parser.ts";
import { UserStorage } from "./services/storage.ts";

const userStorage = new UserStorage('users');
const router = new Router();

router.get("/ping", (ctx: Context) => {
  ctx.response.status = Status.OK;
  ctx.response.body = { message: "pong!" };
});

router.post("/user", async (ctx: Context) => {
  const { request, response } = ctx;
  const { value: body } = await request.body();
  if (['email', 'password', 'nickname'].every(field => field in body)) {
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
    response.body = { message: "Body should have 'email', 'password', 'nickname' fields." };
  }
});

export default router;