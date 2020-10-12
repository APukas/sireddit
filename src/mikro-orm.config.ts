import dotenv from "dotenv";
dotenv.config();

import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { PASSWORD, PORT, PROD, USER } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  type: "postgresql",
  dbName: USER,
  user: USER,
  password: PASSWORD,
  debug: !PROD,
  port: PORT,
} as Parameters<typeof MikroORM.init>[0];
