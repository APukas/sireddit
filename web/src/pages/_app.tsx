import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core'
import { createClient, Provider } from "urql";
import { SERVER_PORT } from '../constants';
import theme from '../theme'

const client = createClient({ url: `http://localhost:${SERVER_PORT}/graphql`, fetchOptions: { credentials: "include" } });

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
  )
}

export default MyApp
