import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultClient,
} from "connectkit";
import { chain, createClient, WagmiConfig } from "wagmi";
import { SnackbarProvider } from "notistack";
import { providers } from "ethers";
import { AnimatePresence } from "framer-motion";
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material';
import { theme } from '../styles/theme';
import '../styles/globals.css';

const alchemyId = process.env.ALCHEMY_APIKEY;

const client = createClient(
  getDefaultClient({
    appName: "zkSMARTHealthCards",
    chains: [
      chain.polygonMumbai,
      chain.localhost,
    ],
    alchemyId,
  })
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <WagmiConfig client={client}>
        <ConnectKitProvider mode="light">
          <AnimatePresence>
            <SnackbarProvider>
              <Component {...pageProps} />
            </SnackbarProvider>
          </AnimatePresence>
        </ConnectKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  );
}

export default MyApp
