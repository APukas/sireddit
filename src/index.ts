import { MikroORM } from "@mikro-orm/core";
import dotenv from "dotenv";
dotenv.config();

import mikroOrmConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();
};
main().catch((e) => console.log(e));
