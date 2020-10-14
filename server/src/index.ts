import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import cors from "cors";

import mikroOrmConfig from "./mikro-orm.config";
import { PORT } from "./constants";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/Post";
import { UserResolver } from "./resolvers/User";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  const app = express();

  app.use(cors({ origin: "http://localhost:3000", credentials: true }))

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: { em: orm.em },
  });


  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
};
main().catch((e) => console.error(e));
