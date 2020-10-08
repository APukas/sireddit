import { MikroORM } from "@mikro-orm/core";
import path from "path";

import { PROD, PASSWORD, USER } from "./constants";
import { Post } from "./entities/Post";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post],
  dbName: "sireddit",
  type: "postgresql",
  user: USER,
  password: PASSWORD,
  debug: !PROD,
} as Parameters<typeof MikroORM.init>[0];
