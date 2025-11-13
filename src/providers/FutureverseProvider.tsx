import { FutureverseAuthProvider, FutureverseWagmiProvider } from '@futureverse/auth-react';
import { TrnApiProvider } from '@futureverse/transact-react';
import { AuthUiProvider, DefaultTheme, type ThemeConfig } from '@futureverse/auth-ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { authClient, getWagmiConfig, config } from './FutureverseProviderConfig';

const customTheme: ThemeConfig = {
  ...DefaultTheme,
  defaultAuthOption: 'web3',
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60, // 1 hour
    },
  },
});

export function FutureverseProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TrnApiProvider
        network={config.stage === 'production' ? 'root' : 'porcini'}
        useArchiveNode={false}
      >
        <FutureverseWagmiProvider getWagmiConfig={getWagmiConfig}>
          <FutureverseAuthProvider authClient={authClient}>
            <AuthUiProvider authClient={authClient} themeConfig={customTheme}>
              {children}
            </AuthUiProvider>
          </FutureverseAuthProvider>
        </FutureverseWagmiProvider>
      </TrnApiProvider>
    </QueryClientProvider>
  );
}
