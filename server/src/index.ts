import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import connectRedis from "connect-redis";
import session from "express-session";
import redis from "redis";
import cors from "cors";

import mikroOrmConfig from "./mikro-orm.config";
import { SERVER_PORT, CLIENT_PORT, PROD, COOKIE_NAME, SESSION_SECRET } from "./constants";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/Post";
import { UserResolver } from "./resolvers/User";
import { MyContext } from "./types";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(cors({ origin: `http://localhost:${CLIENT_PORT}`, credentials: true }))

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: PROD
      },
      saveUninitialized: false,
      secret: SESSION_SECRET,
      resave: false,
    })
  );


  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => <MyContext>({ em: orm.em, req, res }),
  });


  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port: ${SERVER_PORT}`);
  });
};
main().catch((e) => console.error(e));
