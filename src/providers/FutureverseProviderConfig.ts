import { FutureverseAuthClient } from '@futureverse/auth-react/auth';
import { createWagmiConfig } from '@futureverse/auth-react/wagmi';
import appConfig from 'utils/appConfig';

// Centralised Futureverse provider configuration to avoid re-instantiating
// objects/functions inside the React tree.
const config = appConfig();

const host = config.host ?? 'http://localhost:3000';
const authorizationURL = config.fvEnv === "production" ? "https://login.pass.online" : "https://login.passonline.cloud";
const signerURL = config.fvEnv === "production" ? "https://signer.pass.online" : "https://signer.passonline.cloud";

export const authClient = new FutureverseAuthClient({
  clientId: config.clientId,
  environment: config.fvEnv,
  redirectUri: `${host}/dashboard`,
  authorizationURL,
  signerURL,
});

export const getWagmiConfig = async () =>
  createWagmiConfig({
    walletConnectProjectId: config.walletConnectProjectId,
    xamanAPIKey: config.xamanApiKey,
    authClient,
  });

export { config, host };
