import { ThemeProvider, CSSReset, ColorModeProvider } from "@chakra-ui/core";
import { createClient, Provider, dedupExchange, fetchExchange } from "urql";
import { Cache, cacheExchange, QueryInput } from "@urql/exchange-graphcache";
import { SERVER_PORT } from "../constants";
import theme from "../theme";
import { LoginMutation, MeDocument, MeQuery, RegisterMutation } from "../generated/graphql";

const betterUpdateQuery = <Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  updateFn: (r: Result, q: Query) => Query
) => {
  return cache.updateQuery(qi, (data) => updateFn(result, data as any) as any);
};

const client = createClient({
  url: `http://localhost:${SERVER_PORT}/graphql`,
  fetchOptions: { credentials: "include" },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
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
                  me: result.login.user
                }
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
                  me: result.register.user
                }
              }

            );
          },
        },
      },
    },
    ),
    fetchExchange,
  ],
});

function MyApp({ Component, pageProps }) {
  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <CSSReset />
          <Component {...pageProps} />
        </ColorModeProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
