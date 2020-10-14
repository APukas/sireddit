import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { MyContext } from "src/types";
import { User } from "../entities/User";
import argon2 from "argon2";

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
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") { username, password }: RegisterInput,
    @Ctx() { em }: MyContext
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
    const user = em.create(User, { username, password: hashedPassword });
    try {
      await em.persistAndFlush(user);
    } catch (error) {
      if (error.code === "23505") {
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
    return { user };
  }
  @Mutation(() => UserResponse)
  async login(
    @Arg("options") { username, password }: RegisterInput,
    @Ctx() { em }: MyContext
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

    return { user };
  }
}
