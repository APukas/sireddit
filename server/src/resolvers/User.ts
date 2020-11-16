import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { MyContext } from "src/types";
import { User } from "../entities/User";
import argon2 from "argon2";
import { EntityManager } from "@mikro-orm/postgresql";
import { COOKIE_NAME } from "../constants";

@InputType()
class RegisterInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") { username, password }: RegisterInput,
    @Ctx() { em, req }: MyContext
  ) {
    if (username.length <= 2) {
      return {
        errors: [
          { field: "username", message: "length must be greater thant 2" },
        ],
      };
    }

    if (password.length <= 3) {
      return {
        errors: [
          { field: "password", message: "length must be greater thant 3" },
        ],
      };
    }

    const hashedPassword = await argon2.hash(password);
    let user;
    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          username,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("*");
      user = result[0];
    } catch (error) {
      if (error.detail.includes("already exists")) {
        return {
          errors: [
            {
              field: "username",
              message: "username is already taken",
            },
          ],
        };
      }
    }
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") { username, password }: RegisterInput,
    @Ctx() { em, req }: MyContext
  ) {
    const user = await em.findOne(User, { username });
    if (!user) {
      return {
        errors: [{ field: "username", message: "that username doesn't exist" }],
      };
    }
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return { errors: [{ field: "password", message: "incorrect password" }] };
    }
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) => {
      req.session.destroy((err: Error) => {
        if (err) {
          resolve(false)
          return;
        }
        res.clearCookie(COOKIE_NAME);
        resolve(true);
      })
    })
  }
}
