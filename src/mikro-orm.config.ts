import dotenv from "dotenv";
dotenv.config();

import { MikroORM } from "@mikro-orm/core";
import path from "path";

import { PROD, PASSWORD, USER } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  dbName: "sireddit",
  type: "postgresql",
  user: USER,
  password: PASSWORD,
  debug: !PROD,
} as Parameters<typeof MikroORM.init>[0];
