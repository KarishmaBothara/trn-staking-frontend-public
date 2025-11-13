import { CacheProvider, EmotionCache } from '@emotion/react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { FutureverseProvider } from 'providers/FutureverseProvider';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import NextNProgress from 'nextjs-progressbar';
import createEmotionCache from '../utils/createEmotionCache';
import { FutureverseThemeProvider } from '@futureverse/component-library';
import NavigationContainer from 'containers/NavigationContainer';
import { StorageProvider } from 'containers/Storage';
import Maintenance from 'modules/maintenance';
import appConfig from 'utils/appConfig';
import Intercom from 'modules/shared/components/Intercom';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const apolloClient = new ApolloClient({
  uri: appConfig().archiveDBUrl,
  cache: new InMemoryCache(),
});

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const { enableMaintenanceMode } = appConfig();
  const pathname = usePathname();

  if (enableMaintenanceMode) {
    return (
      <>
        <Head>
          <title>Staking</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <FutureverseThemeProvider>
          <NextNProgress startPosition={0.3} height={3} options={{ easing: 'ease', speed: 300 }} />
          <Maintenance />
        </FutureverseThemeProvider>
      </>
    );
  }

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script id="google-analytics" strategy="lazyOnload">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
            page_path: window.location.pathname,
            });
        `}
      </Script>
      <FutureverseThemeProvider>
        <FutureverseProvider>
          <NavigationContainer>
            <CacheProvider value={emotionCache}>
              <Head>
                <title>Staking</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
              </Head>
              <NextNProgress
                startPosition={0.3}
                height={3}
                options={{ easing: 'ease', speed: 300 }}
              />
              {pathname === '/' ? (
                <Component {...pageProps} />
              ) : (
                <ApolloProvider client={apolloClient}>
                  <StorageProvider>
                    <Intercom />
                    <Component {...pageProps} />
                  </StorageProvider>
                </ApolloProvider>
              )}
            </CacheProvider>
          </NavigationContainer>
        </FutureverseProvider>
      </FutureverseThemeProvider>
    </>
  );
}
