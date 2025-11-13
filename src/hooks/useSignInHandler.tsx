import { useConnect, useConnectors, useWalletClient } from 'wagmi';
import useAuthenticationMethod from './useAuthenticationMethod';
import { createNamedHook } from './createNamedHook';
import { useAuth } from '@futureverse/auth-react';
import { useAuthUi } from '@futureverse/auth-ui';
import { UserSession } from '@futureverse/auth';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function useSignInHandlerImpl(): void {
  const router = useRouter();
  const pathname = usePathname();
  const { authClient, userSession, isFetchingSession } = useAuth();
  const authenticationMethod = useAuthenticationMethod();

  const connectors = useConnectors();
  const { connect } = useConnect();
  const walletClient = useWalletClient();

  const { openLogin, isLoginOpen } = useAuthUi();

  useEffect(() => {
    const userStateChange = (user: UserSession | undefined) => {
      if (user) {
        router.push('/dashboard');
      } else {
        if (pathname != '/') {
          router.replace('/');
        }
      }
    };

    authClient.addUserStateListener(userStateChange);
    return () => {
      authClient.removeUserStateListener(userStateChange);
    };
  }, [authClient, pathname, router]);

  useEffect(() => {
    if (isFetchingSession || isLoginOpen) {
      return;
    }

    if (pathname != '/') {
      if (!userSession) {
        router.replace('/dashboard');
        openLogin();
      }
    }
  }, [userSession, pathname, isFetchingSession, router, isLoginOpen, openLogin]);

  useEffect(() => {
    if (userSession && authenticationMethod && walletClient.error) {
      // re-sign in with xaman if necessary
      if (authenticationMethod.method === 'xaman') {
        if (pathname !== '/' && pathname !== '/login') {
          console.warn(
            `Detected null signer after successful sign-in. Error=${walletClient.error}. Reloading.`
          );

          location.reload();
        }
      }
    }
  }, [
    connect,
    userSession,
    authenticationMethod,
    walletClient,
    walletClient.error,
    connectors,
    pathname,
  ]);
}

export default createNamedHook('useSignInHandler', useSignInHandlerImpl);
