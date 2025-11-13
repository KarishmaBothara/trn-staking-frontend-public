import React from 'react';
import { Intercom as IC } from '@intercom/messenger-js-sdk';
import * as E from 'fp-ts/lib/Either';
import { IntercomUserHashResponse } from 'common/types';
import { PathReporter } from 'io-ts/lib/PathReporter';
import appConfig from 'utils/appConfig';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@futureverse/auth-react';
import useAuthenticationMethod from 'hooks/useAuthenticationMethod';

export default function Intercom() {
  const { userSession } = useAuth();
  const authenticationMethod = useAuthenticationMethod();

  const fetchUseHash = async () => {
    const res = await fetch('/api/generateIntercomUserHash', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(userSession?.user?.access_token && {
          Authorization: `Bearer ${userSession.user.access_token}`,
        }),
      },
    });
    const raw = await res.text();
    const responseR = IntercomUserHashResponse.decode(JSON.parse(raw));

    if (E.isLeft(responseR)) {
      throw new Error(`Failed to decode body: ${PathReporter.report(responseR).join(', ')}`);
    }

    return responseR.right;
  };

  const { data } = useQuery({
    queryKey: ['intercomUserHash', userSession?.user?.access_token],
    queryFn: () => fetchUseHash(),
    enabled: !!userSession?.user?.access_token,
  });

  React.useEffect(() => {
    if (userSession && authenticationMethod && data?.userHash) {
      let email: string | undefined;
      if (authenticationMethod.method === 'fv:email') {
        email = authenticationMethod.email;
      } else if (
        authenticationMethod.method === 'fv:dynamic-custodial-idp' &&
        authenticationMethod.email
      ) {
        email = authenticationMethod.email;
      } else {
        email = undefined;
      }

      IC({
        api_base: 'https://api-iam.intercom.io',
        app_id: appConfig().intercomId,
        user_hash: data.userHash,
        user_id: userSession.futurepass,
        wallet: userSession.eoa,
        email,
      });
    }
  }, [authenticationMethod, userSession, data]);

  return <></>;
}
