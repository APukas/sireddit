import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

import mikroOrmConfig from "./mikro-orm.config";
import { PORT } from "./constants";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/Post";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [PostResolver], validate: false }),
    context: { em: orm.em },
  });

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
};
main().catch((e) => console.error(e));
