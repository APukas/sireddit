import { dedupExchange, fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { SERVER_PORT } from "../constants";
import { LogoutMutation, MeQuery, MeDocument, LoginMutation, RegisterMutation } from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";

export const createUrqlClient = (ssrExchange: any) => ({
  url: `http://localhost:${SERVER_PORT}/graphql`,
  fetchOptions: { credentials: "include" as const },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => {
                return { me: null };
              }
            );
          },
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                }
                return {
                  me: result.login.user,
                };
              }
            );
          },
          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                }
                return {
                  me: result.register.user,
                };
              }
            );
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
})